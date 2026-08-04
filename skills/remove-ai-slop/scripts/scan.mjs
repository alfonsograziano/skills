#!/usr/bin/env node
// Mechanical AI-slop scanner — the recall layer of the remove-ai-slop skill.
//
// Two tiers, both mechanical and both reproducible:
//   LEXICAL    — regex hits from patterns.json (word and phrase tells).
//   STRUCTURAL — coordinate-list lengths, sentence/paragraph anaphora, uniform
//                rhythm runs, fragment runs, kicker closers, balanced semicolons,
//                explanatory-colon density, repeated sentence openers, questions
//                and self-answered questions, burstiness, paragraph-shape and
//                section-length uniformity, and formatting habits (emoji headings,
//                bold density, bullet stems).
//
// Three of those measure DISPERSED habits — explanatory colons, repeated sentence
// openers, self-answered questions. They exist because the run-based detectors are
// blind to a tic spread thinly across a long document: "This is …" opening 150
// sentences across 12 chapters never produces 3 in a row, so nothing else here
// would ever see it.
//
// The structural tier exists to fix a specific failure: two close readings of one
// document disagreed 4x on "how many triads are there", because neither stated a
// rule. The model must not invent the denominator. This script enumerates
// CANDIDATES; the model only classifies each one and reports both numbers.
//
// Nothing here is a finding. Every hit is a candidate for the close-reading pass.
//
// Works on Markdown and on plain text. Regions whose prose is not the author's
// (code, frontmatter, tables, URLs, block quotes) are masked line-for-line so
// every reported line number matches the source file.
//
// Usage: node scan.mjs [--json] [--no-structural] [--include-quotes] [--limit N]
//                      <file> [<file>...]
//
// Passing two or more files also prints a COMPARISON block — same detectors, same
// thresholds, so those rows (and only those rows) are comparable across versions.
// That is how before/after deltas must be produced: one invocation, both files.
//
// Passing exactly two files adds PER-PATTERN DELTAS, which flags every pattern
// whose density ROSE. Aggregate totals cannot catch lateral substitution (§9.2):
// trading "not X but Y" for "X rather than Y" improves every total at once.

import { readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const here = dirname(fileURLToPath(import.meta.url));
const { patterns } = JSON.parse(readFileSync(join(here, 'patterns.json'), 'utf8'));

let values = {};
let files = [];
try {
  const parsed = parseArgs({
    options: {
      json: { type: 'boolean', default: false },
      'no-structural': { type: 'boolean', default: false },
      'include-quotes': { type: 'boolean', default: false },
      limit: { type: 'string', default: '40' },
    },
    allowPositionals: true,
  });
  values = parsed.values;
  files = parsed.positionals;
} catch (err) {
  console.error(`${err.message}\n`);
}

if (files.length === 0) {
  console.error(
    'Usage: node scan.mjs [--json] [--no-structural] [--include-quotes] [--limit N] <file> [<file>...]\n' +
      "  --include-quotes  also scan block quotes (default: skipped — quoted prose is the quotee's)\n" +
      '  --limit N         max candidates listed per detector (default 40)',
  );
  process.exit(1);
}
const LIMIT = Number.parseInt(values.limit, 10) || 40;

// --- Masking ---------------------------------------------------------------
// Blank out regions the skill must not judge, preserving line count and column
// positions so every line number in the output points at the real source line.
function maskExcludedRegions(text, { includeQuotes }) {
  const lines = text.split('\n');
  let inFence = false;
  let inFrontmatter = false;
  let inComment = false;
  return lines.map((line, i) => {
    // Frontmatter: YAML (---) or TOML (+++) delimited, only at the top of the file.
    if (i === 0 && /^\s*(---|\+\+\+)\s*$/.test(line)) { inFrontmatter = true; return ''; }
    if (inFrontmatter) { if (/^\s*(---|\+\+\+)\s*$/.test(line)) inFrontmatter = false; return ''; }
    // HTML comments, single- and multi-line.
    if (inComment) { if (line.includes('-->')) inComment = false; return ''; }
    if (/<!--/.test(line) && !line.includes('-->')) { inComment = true; return ''; }
    if (/<!--.*-->/.test(line)) line = line.replace(/<!--.*?-->/g, (m) => ' '.repeat(m.length));
    // Fenced code blocks.
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; return ''; }
    if (inFence) return '';
    // Markdown tables — raw data, not prose.
    if (/^\s*\|/.test(line)) return '';
    // Images and link-reference definitions.
    if (/^\s*!\[/.test(line)) return '';
    if (/^\s*\[[^\]]+\]:\s*\S+/.test(line)) return '';
    // ALL-CAPS directive lines (IMAGE_IDEA:, FIGURE 3 PLACEHOLDER:, TODO:, …) —
    // production notes rather than prose, in any authoring pipeline.
    if (/^\s*[A-Z][A-Z0-9_ .-]{2,}:/.test(line)) return '';
    // Block quotes: someone else's words unless the caller opts in.
    if (!includeQuotes && /^\s*>/.test(line)) return '';
    return (
      line
        // Inline code spans.
        .replace(/`[^`]*`/g, (m) => ' '.repeat(m.length))
        // Link targets, keeping the visible link text.
        .replace(/\]\([^)]*\)/g, (m) => `](${' '.repeat(Math.max(0, m.length - 3))})`)
        // Bare URLs.
        .replace(/\bhttps?:\/\/\S+/g, (m) => ' '.repeat(m.length))
        // Inline HTML tags.
        .replace(/<\/?[a-zA-Z][^>]*>/g, (m) => ' '.repeat(m.length))
    );
  });
}

const wordsIn = (s) => (s.match(/[A-Za-z0-9'’-]+/g) ?? []).length;
const firstWord = (s) => (s.match(/[A-Za-z’']+/) ?? [''])[0].toLowerCase();
const cv = (xs) => {
  if (xs.length < 2) return null;
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  if (!mean) return null;
  const sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length);
  return +(sd / mean).toFixed(3);
};

// Sentence split that tolerates the abbreviations technical prose contains.
const ABBREV = /\b(e\.g|i\.e|etc|vs|cf|Dr|Mr|Mrs|Ms|Prof|Inc|Ltd|St|Fig|No|approx|al|Jr|Sr)\.$/i;
function splitSentences(block) {
  const parts = block.split(/(?<=[.!?])["'’”)]?\s+/);
  const out = [];
  for (const p of parts) {
    const prev = out[out.length - 1];
    if (prev && (ABBREV.test(prev.trim()) || /\b[A-Z]\.$/.test(prev.trim()))) {
      out[out.length - 1] = `${prev} ${p}`;
    } else out.push(p);
  }
  return out.map((s) => s.trim()).filter((s) => wordsIn(s) > 0);
}

// Blank-line-separated blocks, kept as raw joined lines so a regex can match across
// a hard-wrapped line break ("The part\neveryone misses:") while offsets still map
// back to a real line number. Blocks never merge across a blank line, so no pattern
// can match across a paragraph boundary.
function blocks(maskedLines) {
  const out = [];
  let cur = null;
  maskedLines.forEach((line, i) => {
    if (line.trim() === '') { if (cur) { out.push(cur); cur = null; } return; }
    if (!cur) cur = { startLine: i + 1, lines: [line] };
    else cur.lines.push(line);
  });
  if (cur) out.push(cur);
  return out;
}

// Paragraphs = blank-line-separated runs of prose, excluding headings, list items
// and tables (a bulleted list of three things is not a rhythmic triad).
function paragraphs(lines) {
  const blocks = [];
  let cur = null;
  lines.forEach((line, i) => {
    const t = line.trim();
    const skip =
      t === '' ||
      /^#{1,6}\s/.test(t) ||
      /^([*\-+]|\d+[.)])\s/.test(t) ||
      /^\|/.test(t) ||
      /^(---|\*\*\*|___)+$/.test(t) ||
      /^\*[^*]+\*$/.test(t);
    if (skip) { if (cur) { blocks.push(cur); cur = null; } return; }
    if (!cur) cur = { line: i + 1, text: t };
    else cur.text += ` ${t}`;
  });
  if (cur) blocks.push(cur);
  return blocks;
}

// --- Structural detectors --------------------------------------------------

// Coordinate lists ("A, B, and C"). The item count drives the LENGTH
// DISTRIBUTION: a document where 3-item lists dwarf 2- and 4-item lists is
// displaying the suspicious-coincidence tell, and that is fully mechanical.
const LIST_RE = /((?:[^,;:.—()]+,\s+){1,6}(?:and|or)\s+[^,;:.—()]+)/g;
function coordinateLists(sentence) {
  const found = [];
  for (const m of sentence.matchAll(LIST_RE)) {
    const seg = m[1].trim();
    if (wordsIn(seg) < 4) continue;
    const oxford = /,\s+(and|or)\s+/.test(seg);
    const commas = (seg.match(/,/g) ?? []).length;
    const items = oxford ? commas + 1 : commas + 2;
    if (items < 2 || items > 8) continue;
    // Split into items to measure balance (longest ÷ shortest, in words).
    const tail = seg.split(/,\s+(?:and|or)\s+|\s+(?:and|or)\s+/);
    const lens = tail.map(wordsIn).filter((n) => n > 0);
    const balance = lens.length > 1 ? +(Math.max(...lens) / Math.max(1, Math.min(...lens))).toFixed(2) : null;
    found.push({ items, balance, text: seg.length > 120 ? `${seg.slice(0, 117)}…` : seg });
  }
  return found;
}

// Formatting habits. Read off the RAW lines, because masking removes the very
// markup being counted. Meaningless for plain-text input; ignore it there.
const EMOJI_RE = /\p{Extended_Pictographic}/u;
function isTitleCase(text) {
  const words = text.replace(/[^\w\s'’-]/g, ' ').split(/\s+/).filter(Boolean);
  const sig = words.filter((w) => w.length > 3);
  if (sig.length < 3) return false;
  return sig.filter((w) => /^[A-Z]/.test(w)).length / sig.length >= 0.75;
}
function analyzeFormatting(rawLines, maskedLines) {
  const headings = [];
  let inFence = false;
  rawLines.forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; return; }
    if (inFence) return;
    const m = /^(#{1,6})\s+(.*?)\s*$/.exec(line);
    if (m) headings.push({ line: i + 1, level: m[1].length, text: m[2] });
  });

  // Prose words per section, to expose suspiciously parallel section lengths.
  const sectionWords = [];
  for (let h = 0; h < headings.length; h++) {
    const start = headings[h].line;
    const end = h + 1 < headings.length ? headings[h + 1].line - 1 : maskedLines.length;
    const w = wordsIn(maskedLines.slice(start, end).join('\n'));
    if (w > 0) sectionWords.push({ line: start, heading: headings[h].text, words: w });
  }

  const boldSpans = [];
  maskedLines.forEach((line, i) => {
    for (const m of line.matchAll(/\*\*[^*\n]+\*\*/g)) boldSpans.push({ line: i + 1, text: m[0] });
  });
  const bulletStems = [];
  rawLines.forEach((line, i) => {
    if (/^\s*([*\-+]|\d+[.)])\s+\*\*[^*]+\*\*\s*[:—–-]?/.test(line)) {
      bulletStems.push({ line: i + 1, text: line.trim().slice(0, 90) });
    }
  });

  return {
    headings: headings.length,
    emojiHeadings: headings.filter((h) => EMOJI_RE.test(h.text)),
    colonHeadings: headings.filter((h) => /\S: \S/.test(h.text)),
    titleCaseHeadings: headings.filter((h) => isTitleCase(h.text)),
    boldSpans,
    bulletStems,
    sectionWords,
    sectionLengthCv: cv(sectionWords.map((s) => s.words)),
    emojiInProse: maskedLines.flatMap((line, i) => (EMOJI_RE.test(line) ? [{ line: i + 1, text: line.trim().slice(0, 90) }] : [])),
    curlyQuotes: maskedLines.reduce((n, line) => n + (line.match(/[“”‘]/g) ?? []).length, 0),
  };
}

function analyzeStructure(lines) {
  const paras = paragraphs(lines);
  const listHist = {};
  const cands = {
    triadList: [],
    sentenceRun: [],
    fragmentRun: [],
    anaphoraSentence: [],
    anaphoraParagraph: [],
    closer: [],
    semicolon: [],
    explanatoryColon: [],
    selfAnsweredQuestion: [],
  };
  const allSentenceLens = [];
  const paraSentenceCounts = [];
  const openerCounts = new Map();
  let questionCount = 0;

  for (const p of paras) {
    const sents = splitSentences(p.text);
    sents.forEach((s) => allSentenceLens.push(wordsIn(s)));
    paraSentenceCounts.push(sents.length);

    for (const s of sents) {
      for (const l of coordinateLists(s)) {
        listHist[l.items] = (listHist[l.items] ?? 0) + 1;
        if (l.items === 3) cands.triadList.push({ line: p.line, balance: l.balance, text: l.text });
      }
      // Balanced semicolon pairs: both halves substantial and similar in length.
      const semi = s.indexOf(';');
      if (semi > 0) {
        const a = wordsIn(s.slice(0, semi));
        const b = wordsIn(s.slice(semi + 1));
        if (a >= 4 && b >= 4 && Math.max(a, b) / Math.min(a, b) <= 1.5) {
          cands.semicolon.push({
            line: p.line,
            ratio: +(Math.max(a, b) / Math.min(a, b)).toFixed(2),
            text: s.length > 150 ? `${s.slice(0, 147)}…` : s,
          });
        }
      }
    }

    // Explanatory colons, dispersed sentence openers, and self-answered questions.
    // All three are DENSITY signals for habits that never form a local run, so the
    // anaphora and closer detectors above are structurally blind to them.
    sents.forEach((s, i) => {
      const t = s.trim();

      // "clause: lowercase continuation". A colon before a genuine list, label, or
      // definition is correct English, so no single instance is a finding — the
      // narrow colon-reveal regex in patterns.json flags individual cases. What
      // this measures is how often the document reaches for the move at all.
      for (const m of t.matchAll(/[^\s:]:\s+[a-z]/g)) {
        const at = m.index + 1;
        cands.explanatoryColon.push({
          line: p.line,
          text: `…${t.slice(Math.max(0, at - 45), Math.min(t.length, at + 45)).trim()}…`,
        });
      }

      // First two words of the sentence. A habit spread thinly across a whole
      // document ("This is …" 150 times in 12 chapters) never trips the anaphora
      // run detector, which needs 3 consecutive sentences.
      if (wordsIn(t) >= 4) {
        const opener = (t.match(/[A-Za-z’'-]+/g) ?? []).slice(0, 2).join(' ').toLowerCase();
        if (opener.includes(' ')) openerCounts.set(opener, (openerCounts.get(opener) ?? 0) + 1);
      }

      // Rhetorical question as transition (§1.11): a question in the author's own
      // voice, answered by the writer in the next sentence rather than left open.
      const isQ = (x) => /\?["'’”)\]]*$/.test(x.trim());
      if (isQ(t)) {
        questionCount++;
        const next = sents[i + 1];
        if (next && !isQ(next)) {
          cands.selfAnsweredQuestion.push({
            line: p.line,
            text: `${t.slice(0, 80)}  →  ${next.trim().slice(0, 60)}…`,
          });
        }
      }
    });

    // Sentence anaphora: consecutive sentences opening with the same word.
    let run = 1;
    for (let i = 1; i <= sents.length; i++) {
      const same = i < sents.length && firstWord(sents[i]) && firstWord(sents[i]) === firstWord(sents[i - 1]);
      if (same) run++;
      else {
        if (run >= 3) {
          cands.anaphoraSentence.push({ line: p.line, run, word: firstWord(sents[i - 1]), text: sents[i - run].slice(0, 90) });
        }
        run = 1;
      }
    }

    // Fragment runs: 2+ consecutive very short sentences — "Fast. Simple.
    // Effective." / "That's it. That's the whole thing."
    let frag = 0;
    for (let i = 0; i <= sents.length; i++) {
      const short = i < sents.length && wordsIn(sents[i]) <= 4;
      if (short) frag++;
      else {
        if (frag >= 2) {
          cands.fragmentRun.push({ line: p.line, run: frag, text: sents.slice(i - frag, i).join(' ').slice(0, 90) });
        }
        frag = 0;
      }
    }

    // Uniform rhythm runs: 3+ consecutive sentences of near-identical length.
    for (let i = 0; i + 2 < sents.length; i++) {
      const w = [wordsIn(sents[i]), wordsIn(sents[i + 1]), wordsIn(sents[i + 2])];
      if (w.some((n) => n < 6 || n > 45)) continue;
      const med = [...w].sort((a, b) => a - b)[1];
      if (w.every((n) => Math.abs(n - med) / med <= 0.3)) {
        cands.sentenceRun.push({ line: p.line, lens: w, text: sents[i].slice(0, 90) });
        i += 2;
      }
    }

    // Kicker closers: a short final sentence after a long one.
    if (sents.length >= 2) {
      const last = sents[sents.length - 1];
      const prev = sents[sents.length - 2];
      const lw = wordsIn(last);
      const contrast = /\b(not|rather than|instead of|but|while|yet)\b|;/i.test(last);
      if ((lw <= 10 && wordsIn(prev) >= 18) || (lw <= 26 && contrast && wordsIn(prev) >= 20)) {
        cands.closer.push({ line: p.line, words: lw, kicker: lw <= 10, text: last.length > 130 ? `${last.slice(0, 127)}…` : last });
      }
    }
  }

  // Paragraph anaphora: consecutive paragraphs opening with the same two words.
  const key = (t) => t.split(/\s+/).slice(0, 2).join(' ').toLowerCase().replace(/[^a-z ]/g, '');
  let run = 1;
  for (let i = 1; i <= paras.length; i++) {
    const same = i < paras.length && key(paras[i].text) && key(paras[i].text) === key(paras[i - 1].text);
    if (same) run++;
    else {
      if (run >= 2) cands.anaphoraParagraph.push({ line: paras[i - run].line, run, opener: key(paras[i - 1].text) });
      run = 1;
    }
  }

  const n = allSentenceLens.length || 1;
  const mean = allSentenceLens.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(allSentenceLens.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const triadBalances = cands.triadList.map((t) => t.balance).filter((x) => x != null).sort((a, b) => a - b);
  const paraHist = {};
  for (const c of paraSentenceCounts) paraHist[c] = (paraHist[c] ?? 0) + 1;

  return {
    paragraphs: paras.length,
    sentences: n,
    meanSentenceWords: +mean.toFixed(1),
    burstiness: +(sd / (mean || 1)).toFixed(3),
    listLengthHistogram: listHist,
    medianTriadBalance: triadBalances.length ? triadBalances[Math.floor(triadBalances.length / 2)] : null,
    paragraphSentenceHistogram: paraHist,
    paragraphShapeCv: cv(paraSentenceCounts),
    questions: questionCount,
    openerBigrams: [...openerCounts.entries()]
      .filter(([, n]) => n >= 3)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([opener, count]) => ({ opener, count })),
    candidates: cands,
  };
}

// --- Run -------------------------------------------------------------------

function excerpt(text, index, matchLen) {
  const radius = 70;
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + matchLen + radius);
  const body = text.slice(start, end).replace(/\s+/g, ' ').trim();
  return (start > 0 ? '…' : '') + body + (end < text.length ? '…' : '');
}

const results = [];
for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const rawLines = raw.split('\n');
  const lines = maskExcludedRegions(raw, { includeQuotes: values['include-quotes'] });
  const words = wordsIn(lines.join('\n'));

  const hits = [];
  const proseBlocks = blocks(lines);
  for (const p of patterns) {
    const re = new RegExp(p.regex, p.flags ?? 'gi');
    for (const b of proseBlocks) {
      const text = b.lines.join('\n');
      for (const m of text.matchAll(re)) {
        // Offset → source line: count the newlines the match starts after.
        const nl = (text.slice(0, m.index).match(/\n/g) ?? []).length;
        hits.push({
          pattern: p.id,
          name: p.name,
          category: p.category,
          line: b.startLine + nl,
          match: m[0].replace(/\s+/g, ' '),
          excerpt: excerpt(text, m.index, m[0].length),
          note: p.note,
        });
      }
    }
  }

  const counts = {};
  for (const h of hits) counts[h.name] = (counts[h.name] ?? 0) + 1;
  const stats = Object.entries(counts)
    .map(([name, count]) => ({ name, count, per1k: words === 0 ? 0 : +(count / (words / 1000)).toFixed(2) }))
    .sort((a, b) => b.count - a.count);

  results.push({
    file,
    words,
    stats,
    hits: hits.sort((a, b) => a.line - b.line),
    structure: values['no-structural'] ? null : analyzeStructure(lines),
    formatting: values['no-structural'] ? null : analyzeFormatting(rawLines, lines),
  });
}

const per1k = (n, w) => (w === 0 ? 0 : +(n / (w / 1000)).toFixed(2));

if (values.json) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const r of results) {
    const excluded = `code, frontmatter, tables, URLs${values['include-quotes'] ? '' : ', block quotes'}`;
    console.log(`\n=== ${basename(r.file)} — ${r.words} words of author prose (${excluded} excluded) ===\n`);
    console.log('LEXICAL TIER — regex hits');
    for (const s of r.stats) console.log(`  ${String(s.count).padStart(3)}  (${String(s.per1k).padStart(5)}/1k)  ${s.name}`);
    if (r.stats.length === 0) console.log('  (no lexical-tier hits)');

    if (r.structure) {
      const st = r.structure;
      const c = st.candidates;
      console.log('\nSTRUCTURAL TIER — mechanical candidate counts (the denominator; judge each)');
      const hist = Object.entries(st.listLengthHistogram).sort((a, b) => +a[0] - +b[0]);
      const total = hist.reduce((a, [, n]) => a + n, 0);
      const three = st.listLengthHistogram[3] ?? 0;
      console.log(`  Coordinate lists by item count: ${hist.map(([k, v]) => `${k}-item:${v}`).join('  ') || '(none)'}`);
      console.log(`    → 3-item share: ${total ? Math.round((three / total) * 100) : 0}% of ${total} lists  (${per1k(three, r.words)}/1k words)`);
      console.log(`    → median 3-item balance ratio: ${st.medianTriadBalance ?? 'n/a'}  (1.0 = perfectly matched item lengths)`);
      console.log(`  Sentence-anaphora runs (3+ sentences, same opening word):   ${c.anaphoraSentence.length}`);
      console.log(`  Paragraph-anaphora runs (2+ paragraphs, same opening):      ${c.anaphoraParagraph.length}`);
      console.log(`  Uniform rhythm runs (3 consecutive sentences ±30% length):  ${c.sentenceRun.length}`);
      console.log(`  Fragment runs (2+ consecutive sentences of ≤4 words):       ${c.fragmentRun.length}`);
      console.log(`  Kicker/antithesis closers (short final sentence):           ${c.closer.length}  (${per1k(c.closer.length, r.words)}/1k)`);
      console.log(`  Balanced semicolon pairs (halves within 1.5x):              ${c.semicolon.length}`);
      console.log(`  Explanatory colons ("clause: lowercase"):                   ${c.explanatoryColon.length}  (${per1k(c.explanatoryColon.length, r.words)}/1k)`);
      console.log('    → a habit signal, not a finding list: a colon before a genuine list or');
      console.log('      definition is correct, so judge the rate, not the instance. Measured on');
      console.log('      human prose: academic papers 0.2-1.8/1k, industry long-form 2.5-5.5/1k.');
      console.log('      Above ~6/1k the document is reaching for the move reflexively.');
      console.log(`  Questions in author prose:                                  ${st.questions}  (${per1k(st.questions, r.words)}/1k)`);
      console.log(`    → of which self-answered in the next sentence (§1.11):    ${c.selfAnsweredQuestion.length}`);
      console.log(`  Sentence-length burstiness (sd/mean): ${st.burstiness}   mean ${st.meanSentenceWords} words over ${st.sentences} sentences`);
      console.log('    → human non-fiction typically 0.45-0.70; below ~0.40 reads metronomic.');
      const ph = Object.entries(st.paragraphSentenceHistogram).sort((a, b) => +a[0] - +b[0]);
      console.log(`  Paragraph shape: ${st.paragraphs} paragraphs, sentences-per-paragraph ${ph.map(([k, v]) => `${k}:${v}`).join('  ') || '(none)'}`);
      console.log(`    → shape variation (cv): ${st.paragraphShapeCv ?? 'n/a'}  (below ~0.35 = every paragraph the same size)`);
      if (st.openerBigrams.length) {
        const top = st.openerBigrams.slice(0, 10);
        console.log('  Most-repeated sentence openers (first two words, 3+ uses):');
        for (const o of top) {
          console.log(`    ${String(o.count).padStart(4)}  (${String(per1k(o.count, r.words)).padStart(5)}/1k)  "${o.opener}…"`);
        }
        console.log('    → dispersed habits, invisible to the anaphora run detector above. Judge the');
        console.log('      frame, not the words: "this is…" 40 times is a copula-definition tic.');
      }

      const f = r.formatting;
      console.log('\nFORMATTING TIER — markup habits (ignore for plain-text input)');
      console.log(`  Headings: ${f.headings}  (emoji: ${f.emojiHeadings.length}, "Topic: subtitle" form: ${f.colonHeadings.length}, Title Case: ${f.titleCaseHeadings.length})`);
      if (f.sectionWords.length > 1) {
        console.log(`  Section prose lengths (words): ${f.sectionWords.map((s) => s.words).join(', ')}`);
        console.log(`    → length variation (cv): ${f.sectionLengthCv ?? 'n/a'}  (below ~0.35 = suspiciously parallel sections)`);
      }
      console.log(`  Bold spans in prose: ${f.boldSpans.length}  (${per1k(f.boldSpans.length, r.words)}/1k)   inline-header bullet stems: ${f.bulletStems.length}`);
      console.log(`  Emoji in prose lines: ${f.emojiInProse.length}   curly quotes/apostrophes: ${f.curlyQuotes}`);

      const show = (label, arr, fmt, limit = LIMIT) => {
        if (arr.length === 0) return;
        console.log(`\n  ${label} (${arr.length}${arr.length > limit ? `, showing ${limit}` : ''}):`);
        for (const x of arr.slice(0, limit)) console.log(`    L${x.line} ${fmt(x)}`);
      };
      show('3-item coordinate lists', c.triadList, (x) => `[bal ${x.balance}] ${x.text}`);
      show('Sentence anaphora', c.anaphoraSentence, (x) => `[x${x.run} "${x.word}"] ${x.text}…`);
      show('Paragraph anaphora', c.anaphoraParagraph, (x) => `[x${x.run}] "${x.opener}…"`);
      show('Uniform rhythm runs', c.sentenceRun, (x) => `[${x.lens.join('/')} words] ${x.text}…`);
      show('Fragment runs', c.fragmentRun, (x) => `[x${x.run}] ${x.text}`);
      show('Closers', c.closer, (x) => `[${x.words}w${x.kicker ? ' KICKER' : ''}] ${x.text}`);
      show('Balanced semicolons', c.semicolon, (x) => `[${x.ratio}x] ${x.text}`);
      show('Self-answered questions', c.selfAnsweredQuestion, (x) => x.text);
      show('Explanatory colons', c.explanatoryColon, (x) => x.text);
      show('Emoji headings', f.emojiHeadings, (x) => x.text);
      show('Title Case headings', f.titleCaseHeadings, (x) => x.text);
      show('Inline-header bullet stems', f.bulletStems, (x) => x.text);
    }

    console.log('\nLEXICAL candidate lines (judge each in context — these are NOT findings yet):');
    for (const h of r.hits) console.log(`  L${h.line} [${h.name}] ${h.excerpt}`);
  }

  if (results.length > 1) {
    console.log('\n=== COMPARISON ===');
    const rows = results.map((r) => ({
      f: basename(r.file),
      w: r.words,
      t3: r.structure ? (r.structure.listLengthHistogram[3] ?? 0) : 0,
      cl: r.structure ? r.structure.candidates.closer.length : 0,
      fr: r.structure ? r.structure.candidates.fragmentRun.length : 0,
      ur: r.structure ? r.structure.candidates.sentenceRun.length : 0,
      bu: r.structure ? r.structure.burstiness : 0,
      lx: r.hits.length,
    }));
    console.log('  file                          words   3-item  closers  frags  unifRun  burst  lexical');
    for (const x of rows) {
      console.log(
        `  ${x.f.padEnd(28).slice(0, 28)}  ${String(x.w).padStart(6)}  ${String(x.t3).padStart(6)}  ` +
          `${String(x.cl).padStart(7)}  ${String(x.fr).padStart(5)}  ${String(x.ur).padStart(7)}  ` +
          `${String(x.bu).padStart(5)}  ${String(x.lx).padStart(7)}`,
      );
    }
    console.log('  Same detectors, same thresholds → these numbers ARE comparable across versions.');
    console.log('  Watch burst: if it FELL, the edit deleted the variance instead of the slop.');
    console.log('  The lexical column is a TOTAL. One pattern falling hides another rising, which');
    console.log('  is why the per-pattern table below exists — read that, not this, for a verdict.');
  }

  // Per-pattern deltas. The aggregate rows above cannot show lateral substitution
  // (§9.2): a pass that trades "not X but Y" for "X rather than Y" improves every
  // total while the reader's alarm stays exactly where it was. This is the gate.
  if (results.length === 2) {
    const gateMetrics = (r) => {
      const m = new Map();
      for (const s of r.stats) m.set(s.name, s.count);
      if (r.structure) {
        const c = r.structure.candidates;
        m.set('[structural] 3-item coordinate lists', r.structure.listLengthHistogram[3] ?? 0);
        m.set('[structural] kicker/antithesis closers', c.closer.length);
        m.set('[structural] balanced semicolon pairs', c.semicolon.length);
        m.set('[structural] uniform rhythm runs', c.sentenceRun.length);
        m.set('[structural] fragment runs', c.fragmentRun.length);
        m.set('[structural] sentence-anaphora runs', c.anaphoraSentence.length);
        m.set('[structural] explanatory colons', c.explanatoryColon.length);
        m.set('[structural] self-answered questions', c.selfAnsweredQuestion.length);
      }
      return m;
    };
    const [before, after] = results;
    const bm = gateMetrics(before);
    const am = gateMetrics(after);
    const rows = [...new Set([...bm.keys(), ...am.keys()])]
      .map((name) => {
        const bc = bm.get(name) ?? 0;
        const ac = am.get(name) ?? 0;
        const bp = per1k(bc, before.words);
        const ap = per1k(ac, after.words);
        // ROSE means the raw count actually went up — something was ADDED, which is
        // what lateral substitution looks like. Cutting words cannot manufacture it.
        // An unchanged count in a shorter text is flagged separately and quietly as
        // "denser", and only when the shift is material, so a 1-word trim is silent.
        const delta = +(ap - bp).toFixed(2);
        return { name, bc, ac, bp, ap, delta, rose: ac > bc, denser: ac === bc && delta >= 0.3 };
      })
      .filter((x) => x.bc || x.ac)
      .sort(
        (a, b) =>
          Number(b.rose) - Number(a.rose) ||
          Number(b.denser) - Number(a.denser) ||
          b.delta - a.delta ||
          a.name.localeCompare(b.name),
      );

    console.log('\n  PER-PATTERN DELTAS — count and (per 1k words), worst first');
    console.log(`    ${'pattern'.padEnd(46)}${'before'.padStart(13)}${'after'.padStart(13)}${'Δ/1k'.padStart(8)}`);
    for (const x of rows) {
      const cell = (c, p) => `${String(c).padStart(5)} (${String(p).padStart(5)})`;
      const d = `${x.delta > 0 ? '+' : ''}${x.delta.toFixed(2)}`;
      const flag = x.rose ? '  ⚠ ROSE' : x.denser ? '  · denser' : '';
      console.log(
        `    ${x.name.padEnd(46).slice(0, 46)}${cell(x.bc, x.bp).padStart(13)}${cell(x.ac, x.ap).padStart(13)}` +
          `${d.padStart(8)}${flag}`,
      );
    }
    const risen = rows.filter((x) => x.rose);
    const denser = rows.filter((x) => x.denser);
    console.log('');
    if (risen.length) {
      console.log(`  ⚠ ${risen.length} pattern(s) ROSE — the count went UP, so something was added.`);
      console.log('    Treat each as lateral substitution (§9.2) until you prove otherwise, and give');
      console.log('    every one a disposition in report section 6.2. The classic case is a negation');
      console.log('    removed from one sentence and re-landed as a contrast connective in the next.');
    } else {
      console.log('  No pattern rose.');
    }
    if (denser.length) {
      console.log(`  · ${denser.length} pattern(s) held their count while the text got shorter, so their`);
      console.log('    density rose. Nothing was added; note it only if the tell now reads heavier.');
    }
    console.log('  This gate only covers patterns that HAVE a detector. A tell with no regex and no');
    console.log('  structural metric cannot rise here — that is a limit of the gate, not a clean bill.');
  }

  console.log('\nReminder: candidates are not findings. The structural counts above are the');
  console.log('DENOMINATOR — report "N of M candidates judged rhythmic", never a bare N you');
  console.log('arrived at by reading. See SKILL.md for the deletion/reorder/substitution tests.');
}
