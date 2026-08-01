<!--
REPORT TEMPLATE — remove-ai-slop

Copy this file to the report path, then fill it in. Do not restructure it: the headings and column names are fixed so that two reports of the same document, or reports of two different documents, can be read side by side.

Rules for filling it in:
  - <angle brackets> are placeholders. Replace them, including the brackets.
  - Every count is written "N of M" — N judged, M mechanical candidates. A bare number with no denominator is a defect.
  - Sections 1-4 are written in Step 1 (detect), section 5 in Step 2 (fix), section 6 in Step 3 (verify). Do not pre-fill a later section with what you expect.
  - Delete any section marked OPTIONAL that does not apply, and delete these instructions from the copy you write.
-->

# AI-slop report: <file(s)>

| | |
|---|---|
| **Analyzed** | <N> words of author prose |
| **Content type** | <essay / reference docs / marketing copy / academic / email / long-form nonfiction / …> |
| **Mode** | <detect + fix + verify \| detect only \| re-run over a prior report> |
| **Source snapshot** | `<path to the pre-edit copy, or the git ref it came from>` |
| **Scanner** | `scripts/scan.mjs` — lexical + structural + formatting tiers |

## 1. Method

Triad rule: a 3-item list counts only if it fails ≥2 of the deletion / reorder / substitution tests. Structural candidates found: <M> 3-item lists (<x>% of <M> coordinate lists), <M> closers, <M> balanced semicolons, <M> uniform-rhythm runs, <M> fragment runs, <M> explanatory colons (<x.x>/1k), <M> questions of which <M> self-answered; burstiness <x.xxx>; paragraph-shape cv <x.xxx>; section-length cv <x.xxx>. Most-repeated sentence openers: <"this is…" ×N, "the team…" ×N, …>. Excluded from analysis: <code blocks, block quotes, frontmatter, tables, URLs, and any region specific to this document>.

Comparability — keep exactly one of these two lines:

- Counts in this report are not comparable to any other run's numbers.
- Both versions were scanned in a single invocation; the deltas in section 6 are comparable.

### Voice signals to preserve

Recorded before any edit, so the fix pass can be checked against them:

1. <e.g. short declarative openers followed by a long qualifying sentence>
2. <e.g. first-person admissions of not knowing>
3. <e.g. dry understatement instead of emphasis>
4. <…>

## 2. Summary

| Pattern | Judged | Candidates | Density (/1k) | Severity |
|---|---|---|---|---|
| <Rule of three (rhythmic triads)> | <28> | <62> | <2.7> | <HIGH> |
| <"Not X but Y" contrast> | <9> | <—> | <0.9> | <HIGH> |
| <…> | | | | |

**Overall read:** <2–4 sentences. The document's dominant AI habits; whether this is a few bad passages or a systemic rhythm; which patterns to attack first. For a re-run, open with a one-line verdict on direction of travel — improved / unchanged / regressed — backed by the mechanical numbers.>

## 3. Findings

<Ordered by severity (HIGH → MEDIUM → LOW), then by position. Numbered sequentially. Cap at 20: beyond that a report stops being actionable. When a pattern has more instances than fit, give the worst 3–5 here and put the rest in the ledger.>

### 1. <Pattern name> — <HIGH|MEDIUM|LOW>
**<file>:<line>**
> <exact quote, trimmed to the offending span plus enough context to locate it>

<1–2 sentences: why this reads as AI. For a triad, name which of the three tests it failed. For a density-driven finding, give the density.>

### 2. <…>

## 4. Ledger

Every remaining instance, by line, so the counts in section 2 are auditable:

- <Rhythmic triads (28 of 62)>: <L24, L26, L38, L42, …>
- <Kicker closers (11 of 34)>: <L49, L64, …>
- <…>

## 5. Fixes applied

<One row per finding from section 3, in the same order and numbering. Every finding appears exactly once. Dispositions: Fixed | Reworded | Kept | NEEDS-AUTHOR | Out of scope.>

| # | Location | Disposition | What was done |
|---|---|---|---|
| 1 | <file:line> | **Fixed** | <"not X but Y" removed; the sentence now states Y directly> |
| 2 | <file:line> | **Reworded** | <triad cut to two items; the list still scans in parallel, so intensity is lower rather than gone> |
| 3 | <file:line> | **Kept** | <"harness" is the domain term here, not figurative inflation> |
| 4 | <file:line> | **NEEDS-AUTHOR** | <"significantly faster" needs the real figure — what was the before/after latency?> |

### Diffs for the substantive edits

<For every HIGH finding and any edit whose intent is not obvious from the row above. Before/after only, no commentary beyond one line.>

**#1 — <file>:<line>**
> before: <original text>
> after:  <edited text>

**#2 — <file>:<line>**
> before: <original text>
> after:  <edited text>

### Ledger fixes

<Instances fixed in bulk from the section 4 ledger rather than as numbered findings. One line per pattern, with the count and the line numbers touched.>

- <Em dashes: 14 of 31 replaced (comma ×6, period ×4, parentheses ×3, colon ×1); L12, L18, …>
- <"crucial" → plain wording: 5 of 7; L44, L91, …>

### Not fixed, by design

<Anything left alone as a group, with the reason. Delete if empty.>

- <All instances inside quoted material (L120–134) — the quotee's prose.>
- <Section-level triadic architecture (§4.1) — structural, author's call.>

## 6. Verification

Re-scan after the fix pass, both versions in one scanner invocation.

### 6.1 Mechanical deltas

| Metric | Before | After | Direction |
|---|---|---|---|
| Words of prose | <> | <> | <> |
| Lexical hits (total — context, not a verdict) | <> | <> | <> |
| 3-item coordinate lists | <> | <> | <> |
| Kicker closers | <> | <> | <> |
| Fragment runs | <> | <> | <> |
| Uniform-rhythm runs | <> | <> | <> |
| Explanatory colons (/1k) | <> | <> | <> |
| Self-answered questions | <> | <> | <> |
| Burstiness (sd/mean) | <> | <> | <> |
| Paragraph-shape cv | <> | <> | <> |

<One or two sentences reading the table. Say plainly if the lexical tier dropped while the structural tier held — that is the most common outcome, because lexical tells are easy to grep-and-kill and structural ones are not. If burstiness FELL, say so and explain what was over-flattened.>

**Patterns that rose.** From the scanner's PER-PATTERN DELTAS table. Every `⚠ ROSE` row goes here, whether or not you think it matters. An empty table is a claim that nothing rose, so only write it if that is what the scanner said.

| Pattern | Before | After | Δ/1k | Verdict |
|---|---|---|---|---|
| <Preference framing: X rather than Y> | <11 (1.26)> | <17 (1.97)> | <+0.71> | <Lateral substitution of the 7 removed "not X but Y" — reverted 6, see #3> |
| <> | <> | <> | <> | <Real addition, justified: <why>> |

<If nothing rose, say so, and say in the same breath that the gate only covers patterns with a detector — a clean table is not proof of a clean pass.>

### 6.2 Remediation-artifact check

Each of these is a tell created *by* the fix pass. Answer every row.

| Check | Result |
|---|---|
| Relocated negation (§9.1) | <clean \| <N> instances at L…> |
| Lateral substitution (§9.2) | <clean — no pattern rose \| <N> risers, all dispositioned in 6.1> |
| Signpost laundering (§9.3) | <clean \| …> |
| Over-flattening / burstiness collapse (§9.4) | <clean \| …> |
| Uniform fix shape (§9.5) | <clean \| …> |
| Voice erasure (§9.6) | <clean — the signals in section 1 are still present at L… \| …> |
| Invented specificity (§9.7) | <clean — no fact added that was not in the source \| …> |

### 6.3 Residual findings

<What is still in the text after the pass, and why. Distinguish clearly:
  - Deliberately kept (from section 5)
  - Awaiting author input (NEEDS-AUTHOR)
  - Newly noticed this pass — patterns the detect pass walked past. State explicitly that these are prior misses, not new damage (§9.8).>

| # | Location | Pattern | Status |
|---|---|---|---|
| <> | <file:line> | <> | <Kept by design \| NEEDS-AUTHOR \| Newly noticed (prior miss, not a regression)> |

### 6.4 Verdict

Keep exactly one of these three lines:

- **Clean** — no HIGH findings remain and no remediation artifacts were introduced.
- **Clean with open questions** — as above, but <N> NEEDS-AUTHOR items are outstanding.
- **Needs another pass** — <what specifically, and why this pass stopped short.>

## 7. Prior-report dispositions — OPTIONAL

<Only when a previous report existed before this run. One row per prior finding, so nothing silently disappears between runs.>

| # | Prior finding | Disposition this run |
|---|---|---|
| 1 | <"not X but Y" at L32> | **Fixed** — <anchor gone, no replacement tell> |
| 2 | <negation at L171> | **Relocated** — <moved to sentence end, still present> |
| 3 | <aphorism at L64> | **Kept** — <author's documented decision, not re-flagged> |
