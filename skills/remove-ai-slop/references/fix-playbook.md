# Fix playbook

How to repair each pattern in [patterns.md](patterns.md) without introducing a new one. Read this before Step 2, every time.

The whole risk of a de-slopping pass is that it succeeds on the metrics and fails on the page. Every rule below exists to prevent one specific documented failure.

## The five laws of the fix pass

**1. Preserve the voice.** Before editing a single line, write down 3–5 concrete voice signals from the draft: characteristic vocabulary, sentence-length habits, bluntness, humour, admitted uncertainty, digressions, level of polish. Record them in the report (the template has a slot). Any edit that erases one of those signals is wrong even if it removes a tell. A rough draft with a real voice must still sound like the same person afterwards. See patterns.md §9.6.

**2. Minimum effective edit.** Fix the tell and stop. Do not tidy neighbouring sentences, do not standardize paragraph length, do not rewrite a strong human line for consistency. Scale the amount of cutting to the actual slop found.

**3. Never invent a fact.** No number, date, name, version, benchmark, quote, or citation that is not already in the source or supplied by the user. When the honest fix requires a specific the author has and you don't — "improved performance significantly" → "cut p99 from X to Y" — do not guess. Mark the finding **NEEDS-AUTHOR** with the exact question to answer, and leave the sentence as the weaker-but-true version. See §9.7.

**4. Fix the pattern, not the string.** Ask "would a reader still feel the same tell here?" after every edit. The negation moved to the end of the sentence is still a negation (§9.1). A kicker rewritten as a better kicker is still a kicker (§9.2). A signpost with the buzzwords removed is still a signpost (§9.3).

**5. Vary the repair.** If you notice yourself applying the same transformation shape to every instance of a pattern, the repair has become the new fingerprint (§9.5). Mix the moves: delete some, merge some, invert some, and leave the ones that earn their place.

**A note on where fixes leak.** Every pattern you remove has a favourite place to reappear, and the per-pattern gate in Step 3 will show it as `⚠ ROSE`. The documented leaks: §1.1 negations land in §1.13 "rather than"; §1.6 colon reveals land in em dashes (§6.1) and vice versa; §1.3 triads land in two-item lists that still scan in parallel; §1.7 kickers land in a shorter kicker. Before you finish a pattern, ask where its instances went, not just whether the old string is gone.

## Per-pattern moves

Each row gives the default move and the failure to avoid. Where the source is ambiguous, prefer deletion over rewriting — a removed sentence never reads as AI.

| Pattern | Default move | Do not |
|---|---|---|
| §1.1 "Not X but Y" | State Y directly, drop the rejected framing entirely. "The question isn't the model, it's the eval" → "The eval matters more than the model." | Move the negation to the tail; convert it to a balanced antithesis; **re-land the same contrast as "Y rather than X" — the most common laundering of this pattern, and the one the per-pattern gate is watching for** |
| §1.13 "X rather than Y" preference framing | Usually leave it alone: it is ordinary English and weak on its own. Fix it only when the document leans on it — then state the preference as a plain positive claim and drop the rejected alternative if it adds nothing. "measure the full task rather than the first ten minutes" → "measure the full task." | Introduce one while fixing §1.1 or §1.2; swap it for "instead of" and call the pattern gone |
| §1.2 Negative listing | Keep only the affirmative claim. | Keep two of the three rejections |
| §1.3 Rhythmic triad | Cut the padding item, or expand one item into a real clause so the list stops scanning as a beat. Sometimes: turn it into two items. | Collapse every triad into the same comma-spliced sentence; convert to a bulleted list of three |
| §1.4 Signposting | Delete the announcement; the section's first real sentence is the opener. | Reword the announcement into a plainer announcement |
| §1.5 Faux-insight setup | Delete the setup, keep the claim. | Soften the setup ("many people miss this") |
| §1.6 Colon reveal | Rewrite as one plain sentence with a verb. | Swap the colon for an em dash |
| §1.7 Aphoristic kicker | Delete it and end on the clearest concrete sentence already present. If closure is genuinely needed, add a plain takeaway or next action. | Rewrite it into a better aphorism, or preserve its rhythm |
| §1.8 Dramatic fragmentation | Join the fragments into complete sentences — but keep one fragment if the passage needs the beat. | Delete every fragment (kills burstiness, §9.4) |
| §1.9 Semicolon hedge pair | Pick the half that carries the argument; delete the concession or move it somewhere it does work. | Replace the semicolon with "but" and keep both halves balanced |
| §1.10 False range | Name the two things plainly, or give the real scale. | — |
| §1.11 Rhetorical question | Delete the question, keep its answer as the sentence. The scanner's self-answered count tells you which ones to look at first. | Turn it into a statement that still sets up its own answer |
| §2.x Vocabulary | Substitute the plain word: leverage → use, utilize → use, facilitate → help/enable, robust → reliable/specific property. If no plain word fits, the claim was empty — cut it. | Swap one inflated word for another; strip a word that is domain vocabulary in this document |
| §2.6 Empty adverbs | Delete when they add nothing. **Keep** when they carry emphasis, uncertainty, contrast, or the writer's spoken rhythm. | Remove all of them mechanically |
| §2.7 Cliché phrase | Delete the phrase; the sentence usually stands without it. | — |
| §3.1 Copula avoidance | "serves as the X" → "is the X". | — |
| §3.2 Nominalized verb | "made a decision" → "decided"; "has the ability to" → "can"; "in order to" → "to". | — |
| §3.3 Trailing -ing analysis | Replace with the concrete consequence ("…, so users can find old drafts without leaving the editor"), or cut the clause. | Swap "highlighting" for "showing" |
| §3.4 Significance inflation | State the fact; let the reader judge whether it matters. | Downgrade to a milder inflation ("an important step") |
| §3.5 Weasel attribution | Name the source. If the source doesn't exist, cut the claim or mark NEEDS-AUTHOR. | Invent a plausible study, expert, or statistic |
| §3.6 Synonym cycling | Pick the clearest term and repeat it. | Introduce a fourth synonym |
| §3.7 Inanimate agency | Give the sentence a human or concrete subject and an active verb. | — |
| §3.8 Hedging stack | Keep at most one hedge, the one that reflects real uncertainty. | Delete all hedges and overclaim |
| §3.9 Uniform rhythm | Break the run: merge two sentences, or split one, or let one sprawl. | Shorten everything (lowers burstiness further) |
| §3.11 Missing particulars | Ask. This is NEEDS-AUTHOR by default. | Invent names, numbers, dates, versions |
| §4.1 Triadic architecture | Structural — usually out of scope for a prose pass. Report it and let the author decide. | Silently reorganize the document |
| §4.2 Formulaic conclusion | Cut the recap; end on the last concrete point, takeaway, or next action. | Rewrite the recap more concisely |
| §4.4 Bullet/bold habits | Turn a two-item bullet list into prose; move a bold stem into the sentence; drop headings over two-sentence sections. | Bold different words instead |
| §4.6 Heading style | Match the document's dominant convention (sentence case, no colon subtitle) — consistency, not a new convention. | Retitle every heading |
| §6.1 Em dashes | Replace with a comma, period, colon, or parentheses, chosen per site so the punctuation varies. Keep the 1–2 that clearly beat the alternatives. | Convert every em dash to the same substitute |
| §6.2 Curly quotes | Normalize to the document's own dominant convention. | Change convention mid-document |
| §6.3 Emoji formatting | Remove from headings and bullets. | — |
| §7 Near-proof artifacts | Delete outright. Always. | Leave a "cleaned-up" version of a placeholder |

## Dispositions

Every finding from Step 1 gets exactly one of these in the report. There is no "partially fixed".

- **Fixed** — the tell is gone and no new tell replaced it.
- **Reworded** — the passage changed and reads better, but the pattern is still detectable at a lower intensity. Say what remains and why you stopped there.
- **Kept** — a deliberate decision not to change it, with the reason (it earns its place; it is domain vocabulary; it is inside a quote; the author previously decided to keep it). A Kept finding is a legitimate outcome, not a failure.
- **NEEDS-AUTHOR** — the honest fix needs information you do not have. State the exact question. Leave the source text unchanged.
- **Out of scope** — structural or argumentative, not a prose-surface fix (§4.1).

## Editing order

1. **Near-proof artifacts (§7) first.** Non-negotiable, mechanical, zero judgment.
2. **HIGH structural patterns next** (§1.1–1.8), in document order. These are what readers actually notice, and fixing them often dissolves nearby lexical hits for free.
3. **MEDIUM sentence-level habits** (§3), where the fix is local and safe.
4. **Vocabulary and punctuation last** (§2, §6), once the sentences have settled — editing prose changes em-dash and word counts, so doing these first wastes work.
5. **Stop at diminishing returns.** A document with the top 20 findings fixed has had its habit broken. Grinding to zero flagged instances produces §9.4 and §9.6.

## Self-check before you re-scan

Answer each of these before running Step 3. A "no" means go back and fix the edit, not the report.

1. Would the writer recognize this draft as their own? Are the 3–5 voice signals from law 1 still present and findable?
2. Did I add any fact — number, name, date, quote, citation — that was not in the source or supplied by the user?
3. Did I change what any sentence *claims*, as opposed to how it reads? (Technical accuracy is not mine to adjust.)
4. Did any fix relocate, launder, or laterally substitute its tell (§9.1–9.3)?
5. Is the repair shape varied across instances of the same pattern (§9.5)?
6. Did I delete short punchy sentences wholesale, or preserve the ones that earn their place (§9.4)?
7. Is anything still tidy in a way the original wasn't — equal paragraph lengths, every opinion hedged, every joke gone (§5.4, §9.6)?
8. Did I touch anything inside a code block, quotation, table, or frontmatter? (I should not have.)
9. Does every finding have exactly one disposition, and does every Kept and NEEDS-AUTHOR carry a reason?
