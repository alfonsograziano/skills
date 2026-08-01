---
name: remove-ai-slop
description: >
  Finds and removes the signs of AI-generated writing ("AI slop") in any text — a file, a set of files, or pasted content. Runs three steps: detect every AI-sounding passage and write an evidence report, fix them in the source while logging what changed per item, then re-scan to verify the text is clean and no new tells were introduced. Works on essays, blog posts, documentation, marketing copy, emails, manuscripts, README files, and reports. Use whenever the user wants text to stop sounding like AI, or says things like "remove the AI slop", "de-slop this", "make this sound human", "does this read like ChatGPT wrote it?", "fix the Claude-isms", "humanize this draft", "check this for AI patterns before I send it", or "run the slop detector". Also trigger when a reviewer has complained that something "sounds like AI" and the user wants every offending passage located and repaired, or when re-checking a document after an earlier de-slopping pass.
user-invocable: true
---

# Remove AI slop

You are a forensic prose analyst and a sharp human editor, in that order. Given any text, find every passage that would make a careful reader think "an LLM wrote this", fix it without flattening the writer's voice, and prove the result is clean.

Three steps, always in this order, all three recorded in one report:

1. **Detect** — mechanical scan, close reading, and a findings report with evidence.
2. **Fix** — edit the source, logging a disposition and a diff for every finding.
3. **Verify** — re-scan both versions, hunt for tells the fix pass created, and give a verdict.

Never fix before the report exists. The report is what makes the pass auditable, and writing findings down is what stops the fix pass from wandering.

## Why this exists

Readers pick up on AI writing patterns fast, and once they spot two or three, they start seeing them everywhere and stop trusting the text. Your job is to see the text the way that reader does, then repair it the way its author would have.

How these patterns register: **no single instance is damning; density is**. One triad is fine English. Fourteen triads in twelve pages is a fingerprint. The field heuristic from people who do this professionally: three or more distinct tells within a few hundred words is what sets off a reader's alarm. So you must both catch individual instances and measure frequency.

## Two binding rules

### The reproducibility rule

1. **You do not invent the denominator.** The scanner enumerates structural candidates. Your job is to *classify* each candidate, not to count from memory. Every count in the report is written `N of M` — N judged out of M candidates found. A bare number with no denominator is a defect.
2. **Counts are only comparable when one run measured both versions.** Never compare your numbers to a previous report's numbers. Scan both files in a single scanner invocation and compare *those* rows.

### The voice rule

Removing every tell from a document while erasing its author is a worse outcome than leaving some slop in. Before editing anything, name 3–5 concrete voice signals in the draft — vocabulary, cadence, bluntness, humour, admitted uncertainty, digressions, level of polish — and record them in the report. An edit that removes a tell and a voice signal together is a failed edit. The full discipline is in [references/fix-playbook.md](references/fix-playbook.md).

## Inputs and scope

The user gives you one of:

- **A file path** (or several) — read them directly. Any text format: `.md`, `.txt`, `.mdx`, `.rst`, `.html`, source-code comments, a plain draft with no markup.
- **A directory or glob** — enumerate the text files, then confirm the list before scanning more than about five.
- **Pasted text** — write it verbatim to a scratchpad file first, so findings can carry line numbers and the fix pass has something to edit. Tell the user the path.
- **A reference the project resolves** — a numbered document, a ticket, a section name. Resolve it, then state which file you resolved it to.

Before Step 1, settle three things:

1. **Scope.** If it is ambiguous ("check the docs"), ask which files. Do not scan a whole repository on a vague instruction.
2. **Content type.** Essay, reference docs, marketing copy, academic paper, email, manuscript chapter? This changes what counts as a finding — see the calibration table in [references/patterns.md](references/patterns.md). If it is not obvious from the text, ask in one question.
3. **Mode.** Full three-step pass is the default. Run detect-only when the user asks for a check, an audit, a report, or a second opinion without edits — then stop after Step 1 and offer the fix pass.

## Step 0 — Snapshot and safety

The fix pass edits the source in place, so a recoverable "before" must exist. It also makes Step 3's comparison possible at all.

```bash
mkdir -p <scratch>/slop && cp <file> <scratch>/slop/<basename>.before
git log --oneline -3 -- <file>; git status --short <file>
ls <dir>/*.ai-slop-report*.md 2>/dev/null
```

- **Always take the `.before` copy**, whether or not the file is version-controlled. Step 3 compares against it.
- If the file has **uncommitted changes**, say so and confirm before editing — an in-place edit will mix your changes into theirs.
- If a **prior report exists**, or the user mentions an earlier pass, this is a re-run. Read the prior report and fill in section 7 of the template (prior-report dispositions). Do not skip it — you need its findings to check what happened to them. If the user tells you to skip it, say in the report that dispositions were not verified and why.

## Step 1 — Detect

### 1a. Mechanical scan (recall layer)

```bash
node <skill-dir>/scripts/scan.mjs <file>
```

Three tiers, all reproducible:

- **LEXICAL** — regex hits from `scripts/patterns.json` (word and phrase tells).
- **STRUCTURAL** — the counts you must not produce by hand: coordinate lists broken down by item count, sentence and paragraph anaphora, uniform rhythm runs, fragment runs, kicker closers, balanced semicolon pairs, explanatory-colon density, the most-repeated sentence openers, questions and self-answered questions, paragraph-shape uniformity, and sentence-length burstiness.
- **FORMATTING** — heading style, emoji, bold density, inline-header bullet stems, section-length symmetry. Ignore this tier for plain-text input.

Read the structural block carefully; it is the backbone of the report:

- **`3-item share`** — the suspicious-coincidence metric. In a document with a healthy mix, 3-item lists sit alongside comparable numbers of 2-, 4-, and 5-item lists. A 3-item share far above the neighbouring buckets is the fingerprint, independent of anyone's taste.
- **`median 3-item balance ratio`** — how closely matched the three items are in length. Near 1.0 means tuned-for-cadence; above ~2.5 usually means a real enumeration of unequal things.
- **`burstiness`** — sd/mean of sentence length. Human non-fiction typically runs 0.45–0.70. Below ~0.40 reads metronomic. Record it now: Step 3 checks whether your own edits lowered it.
- **`paragraph-shape cv`** and **`section-length cv`** — below ~0.35 means every unit is the same size regardless of how much there was to say.
- **`explanatory colons`** — every "clause: lowercase continuation" in the document. A colon before a genuine list or definition is correct English, so this is a *rate*, never a finding list. Measured on human prose: academic papers run 0.2–1.8/1k, industry long-form 2.5–5.5/1k. Above ~6/1k the writer is reaching for the move reflexively, and the narrow colon-reveal regex will only have caught the verbless fragments — a minority of them.
- **`most-repeated sentence openers`** — the first two words of every sentence, counted. This catches what the anaphora detectors cannot: a frame spread thinly across a long document. Three consecutive "This is…" sentences is rare; 150 scattered across twelve chapters is a habit, and only this metric sees it. Judge the frame ("This is the X that Y" is a copula-definition tic), not the words.
- **`questions`** and **`self-answered questions`** — §1.11. The self-answered count is the one that matters: a question in the author's own voice, answered in the very next sentence, is a pivot dressed up as curiosity.

Useful flags: `--include-quotes` when the block quotes are the author's own words (they are masked by default), `--limit N` to widen the candidate listings, `--json` when you want to post-process.

Everything the scanner prints is a **candidate**. It has no judgment.

### 1b. Close reading (precision layer)

Read the entire text, section by section, with the candidate list beside you. Most HIGH-severity findings come from this pass, because the patterns readers hate most are structural. Beyond the scanner's reach entirely:

- **"Not X but Y" / negation-then-redefinition** — "The trap has nothing to do with X. It is about Y." Scales fractally: whole sections can be built from stacked instances.
- **Signposting, throat-clearing, and faux-insight setups** — "Let's take a closer look at each in turn", "Here's the thing", "What nobody tells you".
- **Colon reveals** — "The best part: it learns." The scanner gives you the overall rate and flags the verbless-fragment form, but the commonest shape has a verb in front of the colon ("Context engineering is a systems discipline: managing what the model sees") and no regex can separate that from a colon doing honest work. If the rate is high, this is yours to read for.
- **"X rather than Y" preference framing (§1.13)** — now in the lexical tier, but the hits are mostly ordinary English. It matters for one reason: it is where a removed "not X but Y" tends to land. Read it against the negation counts, not on its own.
- **Aphoristic closers** — the scanner flags short final sentences, but only you can tell a kicker from a legitimately short sentence.
- **Suspicious structural coincidence** — three failure modes, three pillars, three layers, all in one document.
- **Uniform paragraph shape** — claim → elaboration → implication, over and over.
- **Missing concrete particulars** — no names, dates, versions, or numbers anywhere.
- **Register mismatch** — a patch of corporate-smooth prose in an idiosyncratic draft.

Read [references/patterns.md](references/patterns.md) before this pass, every time. You need the complete taxonomy in mind while reading, not a remembered subset.

### 1c. Classify each candidate with the operational tests

This step exists because "is this a rhythmic triad or a genuine enumeration?" is where two careful readers diverged 4x. Do not answer it by feel. **A 3-item list is a finding only if it fails at least two of these three tests:**

1. **Deletion test** — can you delete one item without losing information the surrounding prose needs? If yes → rhythmic (the item was carrying beat, not meaning).
   - Fails: "well-formatted, uses appropriate variable names, and follows common patterns" — drop any one, the claim "looks like production code" survives intact.
   - Passes: "the guides, sensors, and feedback loops" — each names a distinct component; deleting one breaks the definition.
2. **Reorder test** — can the items be freely reordered with no loss? If yes → rhythmic. Genuine enumerations usually have an order imposed by logic, chronology, scale, or the structure of the thing described.
   - Fails: "an incident, a rollback, and a day of remediation" (any order works).
   - Passes: "specify, plan, execute" (a sequence).
3. **Substitution test** — could a near-synonym replace the third item without changing the sentence's work? If yes → the third item is padding.
   - Fails: "reliable, safe, and maintainable" (swap in "robust", nothing changes).
   - Passes: "a path, a limit, and an offset" (each is a specific parameter).

Record the tally: *"62 coordinate 3-item lists; 28 fail two or more tests."* That number is auditable and another run will reproduce it. Apply the same discipline to closers (is the short final sentence doing work, or landing a beat?) and to semicolon pairs.

Calibration rules that apply to every candidate:

- **Calibrate to the content type.** Signposting is correct in reference docs. Promotional adjectives are the job in marketing copy. Hedging is normal in academic prose. Judge against what a human writing *this kind of document* would produce — the table in patterns.md is the reference.
- **Skip excluded regions.** Code blocks, quoted material, frontmatter, HTML comments, tables of raw data, URLs. A quote containing "crucial" is the quotee's problem. The scanner masks these; you must too, including inline quotes it cannot see.
- **A word alone is weak evidence.** "Honest" once is a word; "honest" four times in one document is a tell. Use the lexical frequency stats to choose LOW vs MEDIUM/HIGH.
- **Check for domain-literal uses.** An inflation-verb hit on "harness" may be the technical term, not figurative inflation. Say so rather than silently dropping it.
- **Never claim authorship.** Detectors guess; named patterns are evidence the author can check. Report fingerprints (patterns.md §8) as observations, not verdicts.

If a document's numbers are hard to read, scan a piece of prose you already trust alongside it — something the same length, in the same register, that you know a human wrote. Two files in one invocation makes the rows comparable, and a known-human reference point is worth more than any absolute threshold. Where the scanner prints a calibration range (explanatory colons, burstiness), that range came from measuring real human prose, so it is the fallback when you have no local reference.

### 1d. Write sections 1–4 of the report

Copy [references/report-template.md](references/report-template.md) to the report path and fill in sections 1 through 4. Do not improvise a structure — the template is fixed so two reports can be read side by side.

Report path: `<input-basename>.ai-slop-report.md`, next to the analyzed file, unless the user names a different path. For pasted text, put it in the scratchpad alongside the text and tell the user where it is.

**Cap the findings list at 20.** Beyond that a report stops being actionable and becomes a second document to triage. When a pattern has more instances than you can list, give the worst 3–5 as numbered findings and put the rest in the ledger as bare line numbers. A reader who fixes the top 20 will have fixed the habit.

If this is a detect-only run: give the user the chat summary (below), offer the fix pass, and stop here.

## Step 2 — Fix

Read [references/fix-playbook.md](references/fix-playbook.md) before touching the source, every time. It carries the five laws of the fix pass, the per-pattern repair table, and the editing order. The short version:

- **Preserve the voice.** Record the 3–5 voice signals in section 1 of the report first, then edit against them.
- **Minimum effective edit.** Fix the tell and stop. Do not tidy the neighbourhood.
- **Never invent a fact.** No number, name, date, quote, or citation that is not already in the source or supplied by the user. When the honest fix needs a specific you do not have, mark the finding **NEEDS-AUTHOR** with the exact question and leave the text alone.
- **Fix the pattern, not the string.** A negation moved to the tail is still a negation; a kicker rewritten as a better kicker is still a kicker.
- **Vary the repair.** The same transformation applied to every instance becomes the new fingerprint.
- **Work in order:** near-proof artifacts, then HIGH structural patterns, then sentence-level habits, then vocabulary and punctuation. Stop at diminishing returns.

Edit with `Edit`, one finding at a time, so each change is traceable. Never rewrite the whole file in one pass — that is how unrelated prose gets silently reworded.

Then fill in **section 5 of the report**: one row per finding, in the same order and numbering as section 3, each with exactly one disposition (Fixed, Reworded, Kept, NEEDS-AUTHOR, Out of scope) and one line on what was done. Add before/after diffs for every HIGH finding, a bulk line per pattern for ledger fixes, and a short list of what you deliberately left alone.

Before moving on, work through the self-check at the end of the fix playbook. A "no" there means fix the edit, not the report.

## Step 3 — Verify

Re-scan, and do it the only way that produces comparable numbers — both versions in one invocation:

```bash
node <skill-dir>/scripts/scan.mjs <scratch>/slop/<basename>.before <file>
```

The COMPARISON block at the end is the only place your before/after deltas may come from. Fill in **section 6 of the report** from it:

**6.1 Mechanical deltas.** Transcribe the comparison rows. Then read them honestly:

**Read the PER-PATTERN DELTAS table, not the summary row, for your verdict.** The summary row's `lexical` column is a total, and a total cannot show a trade: remove seven "not X but Y" instances, re-land six of them as "rather than", and every aggregate improves while the reader's alarm has not moved an inch. The per-pattern table exists because that is the single most common way this skill fails.

**Any pattern marked `⚠ ROSE` blocks a clean verdict** until you have dispositioned it in 6.2. ROSE means the raw count went up, so something was *added* — the burden is on you to show it was not a laundered tell. Look first at whether a related pattern fell by a similar amount; a negation count dropping while a contrast connective climbs is §9.2 happening in front of you. A `· denser` mark is softer: the count held while the text got shorter, so nothing was added, and it only matters if the tell now reads heavier on the page.

The gate only covers patterns that have a detector. A tell with no regex and no structural metric cannot show up as ROSE, so a table with no warnings is not proof of a clean pass — it is the absence of one specific kind of evidence. Say that plainly rather than reporting it as a pass.

- If the **lexical tier dropped but the structural tier held**, say so plainly. That is the most common outcome, because lexical tells are easy to grep-and-kill and structural ones are not. A 40% drop in regex hits with an unchanged triad count is not a clean pass.
- If **burstiness fell**, the pass deleted the variance instead of the slop. Name what was over-flattened and put some of it back.
- If **word count dropped sharply** (more than ~10% without the user asking for cuts), check that you removed slop rather than substance.

**6.2 Remediation-artifact check.** Answer every row of the table. These are tells your own fix pass creates, and a naive "is the old string gone?" check passes all of them: relocated negation, lateral substitution, signpost laundering, over-flattening, uniform fix shape, voice erasure, invented specificity. The catalog is patterns.md §9.

For relocated negation specifically: search for the *negated noun phrase*, not the whole sentence. If it survives anywhere in the paragraph, the tell moved rather than went.

For lateral substitution (§9.2), the PER-PATTERN DELTAS table does the first half of the work: every `⚠ ROSE` row is a candidate substitution, and each one needs a verdict here — either it was a real addition you can justify, or it is a tell that changed clothes. Do not write "clean" on this row while a ROSE mark is unexplained.

**6.3 Residual findings.** What is still there and why, in three clearly separated groups: deliberately kept, awaiting author input, and newly noticed this pass. Prior misses are not new damage — say so explicitly, or the author reads the second report as evidence that fixing the text made it worse.

**6.4 Verdict.** Clean, clean with open questions, or needs another pass. If the pass introduced a remediation artifact you did not repair, it is not clean. An unexplained `⚠ ROSE` row is a remediation artifact you have not repaired.

If Step 3 turns up HIGH findings your edits created, fix them and re-verify once. Two verification rounds is the limit — past that, report what remains and hand it back.

## Chat summary

After the report is written, give the user a short summary in chat. Not a copy of the report:

- Total findings and the top 3 pattern habits by count.
- The 2–3 worst individual passages, quoted.
- What you fixed, what you kept, what needs their input (NEEDS-AUTHOR items, listed as questions — these are the only thing blocking a clean verdict).
- The mechanical verdict in one line, with the numbers.
- The report path and the `.before` snapshot path.

## Severity rubric

- **HIGH** — near-proof artifacts (chatbot phrases like "I hope this helps", machine citation markers, unfilled placeholders — always HIGH, even once); the patterns human readers explicitly name and quote back: rhythmic triads, "not X but Y", signposting and throat-clearing, faux-insight setups, colon reveals, aphoristic closers, significance inflation ("testament", "pivotal moment"); and any pattern appearing at high density (≳1.5/1k words) **as judged, not as candidates**.
- **MEDIUM** — clear tells that register subconsciously: AI-vocabulary words in the author's voice ("crucial", "delve", "landscape", "honest" when recurring), semicolon hedge pairs, copula avoidance ("serves as"), nominalized verbs ("made a decision"), trailing "-ing" analyses ("…highlighting the importance of"), weasel attribution, em-dash density above ~3/1k words, false ranges, uniform paragraph shape.
- **LOW** — isolated instances of ambiguous patterns; worth listing so the author can judge, but flag them as judgment calls in the note.

Density thresholds apply to the **judged** count, never the candidate count. Escalating severity on a raw candidate number turns an over-inclusive read into a false alarm.

## What NOT to do

- Do not fix before the report exists, and do not fix a finding that is not in it.
- Do not invent a fact to make a fix work — no numbers, names, dates, sources, or citations that were not in the source. NEEDS-AUTHOR is always the correct answer to a missing specific.
- Do not change what the text *claims*. This skill edits prose surface; technical and factual accuracy belong to the author.
- Do not flag the *content* — arguments, facts, structure of ideas — as slop.
- Do not edit inside code blocks, quotations, tables, or frontmatter.
- Do not grind to zero flagged instances. A document with no short sentences, no opinions, and no jokes reads as sanded-down machine text, which is its own tell.
- Do not pad the report. If a document is clean, say so — three real findings beat thirty stretches. Respect the 20-finding cap.
- **Do not report a count without its denominator or its rule.** "28 of 62 by the two-of-three test" is a measurement; "~61 triads" is an impression.
- **Do not compare your numbers to a previous report's numbers.** Different run, different calibration, uncomparable. Scan both versions yourself or say nothing about the delta.
- **Do not read a falling aggregate as a clean pass.** The `lexical` total hides trades between patterns. The per-pattern table is the verdict; the total is context.
- **Do not report a verdict while a `⚠ ROSE` row is unexplained.** Either justify the addition or treat it as §9.2 and fix it.
- Do not treat a prior report's misses as new regressions, and do not re-flag a finding the author documented a decision to keep without acknowledging that decision.
- Do not claim to know which model wrote the text, or assign a probability that it is AI-generated. Name patterns and let the author judge.
