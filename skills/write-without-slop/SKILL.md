---
name: write-without-slop
description: >
  Writes prose that does not read as AI-written in the first place — the preventive counterpart to remove-ai-slop, which repairs text that already sounds like a machine. This skill produces no reports, no scans, and no extra files: it is the set of rules you hold while composing, so the draft comes out clean and nobody has to de-slop it afterwards. Use whenever you are about to write prose a human will read — a blog post, essay, book chapter or section, README, docs page, PR or commit description, changelog, email, Slack or LinkedIn post, landing copy, release notes, a talk abstract, a report — and whenever you are adding new paragraphs to a document that was already cleaned. Trigger on requests like "write X", "draft X", "write this without sounding like AI", "write it in my voice", "no AI slop", "make it sound human from the start", "write the intro for chapter 9", "draft the README", "rewrite this section", "write this so I don't have to de-slop it after", or when a previous draft was rejected for sounding like ChatGPT and a fresh one is wanted.
user-invocable: true
---

# Write without slop

You are the writer, not the editor. Produce a draft that would survive a slop audit without needing one.

This skill has no steps, no report, no scanner, and no template. It is a set of rules you apply while composing, in your head, on the way to the text the user asked for. The only output is the prose itself.

Read [references/drafting-rules.md](references/drafting-rules.md) before writing, every time. It is the complete catalog of AI tells rewritten as write-side rules — what your default move is, and what to write instead — plus how the rules change by content type. You need it in mind while composing, not as a filter afterwards.

## Why prevention is a different job from removal

**Your default output is the slop.** Left alone, a model reaches for the triad, the "not X but Y", the signpost, the kicker, the em dash and the tidy symmetric section. Every one of those is a documented tell. Avoiding them is not restraint applied at the end — it is the first draft being written differently.

**Polish adds tells.** A pass that "tightens" or "makes it flow" gravitates toward cadence, which is exactly what produces balanced triads, antitheses and quotable closers. There is no second pass in this skill. Write it plainly the first time.

**The unfixable tell is about substance, not wording.** Prose with no names, no numbers, no versions, no dates and no real examples cannot be repaired by an editor — the specifics have to come from whoever has them. A removal pass hits that wall and has to ask the author. You can ask first. That is the single biggest advantage of writing clean over cleaning up, so use it: get the specifics before you draft, and where one is missing, write around it rather than either inventing it or leaving a hole.

**Over-correction is its own tell.** Prose with no short sentences, no opinions, no admitted uncertainty, no jokes and no digressions reads as sanded-down machine text. A draft that is merely inoffensive has failed. Aim for prose with friction, not prose with nothing to object to.

## Before the first sentence

Four things, settled in your head. No document, no checklist to hand back — just do not start writing without answers.

1. **What kind of text is this, and for whom?** Content type decides what is correct, not merely what is allowed: signposting is the job in reference docs and a tell in an essay; promotional adjectives are the job in landing copy and a tell everywhere else. The calibration section of the drafting rules is the reference. If the type is genuinely unclear, ask in one question.

2. **Whose voice?** If the text goes out under someone's name, voice comes from samples, not adjectives. Read one or two pieces of their existing prose — a nearby chapter, earlier posts, the surrounding docs — and fix on 3–5 concrete signals: characteristic vocabulary, sentence-length habits, how blunt they are, whether they admit uncertainty, whether they joke, how polished they let things be. Write toward those signals. With no sample available, pick a plain register and say which. If the repo or project has a style guide, it overrides everything here. When adding to an existing document, the document's own conventions are the guide: read the neighbouring sections and carry their rhythm, heading style and register, or the new paragraphs will read as a register mismatch.

3. **Which specifics do you actually have, and where does each one come from?** Names, numbers, versions, dates, commands, paths, error messages, real anecdotes, attributable quotes. Prose goes general because its writer had nothing specific to say, and general prose is what readers call AI. Sort every specific you plan to use into three buckets, because they carry different risks:
   - **Given** — in the user's message, the document you are extending, or a file you were pointed at. Use freely.
   - **Checked** — you actually opened a source this session and read it there. Usable, but say in the handover where it came from so the author can verify it. Version numbers, prices, API names, limits, quotes and citations recalled from memory are *not* checked, however confident you feel; that is the exact shape of the fabrication that gets a piece torn apart in review.
   - **Neither** — you do not have it. Write around it or mark it (below). Never fill it with a plausible value.

   One distinction that stops this rule from strangling ordinary writing: **a checkable claim about the world is not the same as illustrative texture.** "Plugin upgrades quietly broke other plugins and disks filled up with old workspaces" is normal domain colour in a post about retiring Jenkins, and does not need a source. "We cut p99 by 40%", "a dozen repos", "most teams hit a rate limit before a spending limit" are claims someone can check and you cannot — those need a source or a marker. If you are unsure which side a sentence is on, ask whether a reader could go and verify it.

4. **What shape, and how long?** Sections sized to how much you have to say about each, which is never uniform. Then check two defaults before you commit: is the section count three because the material has three parts, or because three is the default? Do the examples, lists and walkthroughs inside all happen to have three parts too? Break the coincidence before writing — it is much harder to fix afterwards.

   On length: **write to the length the user asked for.** They usually asked for a reason — a slot on a blog, a word budget, a page. Do not pad to reach it, and do not treat the anti-padding rule as licence to under-deliver either: a 700-word request answered with 500 words is a shortfall, not a virtue. If you genuinely cannot reach the target without inventing material, that is a facts problem, not a length problem — get within about 15% of the target, then say in the handover what is missing and roughly what it would add. Only when the user set no target do you take the length from the substance, and pad-free brevity is then the right answer.

## The constructions to spend zero on

Hold this while writing. These are the tells readers name and quote back, so they are worth avoiding absolutely rather than in moderation. Every row is expanded in the drafting rules with what to write instead.

- **"Not X but Y"** and every variant — "isn't just… it's", "less about X than Y", "not only… but also", "has nothing to do with X; it's about Y". State the positive claim; let the contrast be implicit.
- **Faux-insight setups** — "what nobody tells you", "what most people get wrong", "the part everyone skips". Make the claim stand on its own.
- **Throat-clearing openers** — "Here's the thing", "Let me be clear", "I'll be honest", "The uncomfortable truth is".
- **Signposting** — "In this section we'll explore", "Let's dive in", "It's worth noting that". Zero in essays and posts; legitimate in reference docs, where announcing structure is the job.
- **Colon reveals** — "The best part: it learns". Colons are for lists, labels and quotes.
- **Aphoristic closers** — the tidy quotable antithesis at the end of a paragraph or section. At most one in a whole piece, and only when it is the actual point rather than a beat.
- **Rhythmic triads** — three parallel items where the third carries cadence, not information. Test before you write one: could an item go without losing anything, could they be freely reordered, would a near-synonym for the third change nothing? Two yeses means it is a beat, not a list. Genuine enumerations of three real things are fine; every list in the document having three items is not.
- **Trailing "-ing" analysis** — "…, highlighting the importance of", "…, underscoring its significance", "…, paving the way for". Give the concrete consequence or stop the sentence.
- **Weasel attribution** — "experts argue", "studies show", "industry reports suggest". Name the source or drop the claim. Never invent one.
- **Significance inflation** — "marks a pivotal moment", "a key turning point", "left an indelible mark". State the fact and let the reader judge.
- **Sentence-initial "Additionally / Moreover / Furthermore / Notably"** — "and", "also", or nothing.
- **The AI vocabulary cluster** — delve, underscore, showcase, tapestry, testament, realm, landscape (abstract), leverage, harness, unlock, empower, foster, streamline, crucial, vital, robust, seamless, comprehensive, transformative, cutting-edge. Use them only where they are the literal domain term.
- **Em dashes** — the strongest single Claude tell. At most a couple per thousand words, and only where a comma, period, colon or parentheses would genuinely read worse.
- **Chat artifacts and placeholders** — "I hope this helps", "Certainly! Here are", "[Your Name]", "Let me know if you'd like". Never, in any register.
- **Invented specifics** — absolute zero. See below.

Two floors, not ceilings — these you must keep in:

- **One concrete particular per substantive claim.** A name, number, version, command, date or real example. A section with none is a section about nothing.
- **Sentence-length variance.** Uniform sentences that all resolve cleanly are a tell. Let one sprawl; let one be four words. Vary because the thought varies, not by manufacturing fragment runs.

## Missing specifics: write around it first, mark it only if you must

Never guess a number, name, date, version, benchmark, quote or citation to make a sentence land. A fabricated specific is worse than a general sentence, because it looks checkable, so nobody checks it. But the fix is not to punch a hole in the draft — you have two moves, in this order.

**1. Write around it.** Most sentences carry themselves without the missing fact, and rewriting is invisible to the reader:

> ❌ We cut cold-start time from `[TK: p50 before?]` to 180ms.
> ✅ Cold starts now sit at 180ms. *(The improvement is implied; the baseline was never load-bearing.)*

> ❌ We wrote it because `[TK: what did you try first, Locust or k6?]`.
> ✅ We wrote it because the tools we tried couldn't push enough load from one machine. *(Generic, true, and it does the sentence's job.)*

**2. Mark it, when the sentence genuinely cannot do its job without the fact.** Then write `[TK: exact question]` where the missing words go:

> Onboarding a new service went from about a week to `[TK: what did the last one or two actually take?]`

Three constraints, because a draft full of holes is not a draft:

- **The marker replaces a word or a phrase, never a paragraph or a section.** If a whole section depends on facts you do not have, leave the section out and say so in the handover — an outline with a question in it is not writing.
- **Never leave a sentence a reader cannot parse.** Either the marker sits inside a sentence that still reads as English, or you have written around it wrong.
- **Keep the count low: at most one or two in a short piece, a handful in long-form.** Past that, the material is not there. Say so up front — "I can write this properly once I know X and Y" — and hand over the version that stands without them rather than a scaffold.

Then test every marker you kept, the same way you test a triad: **delete the marker and the sentence holding it. Does the piece lose something a reader would miss?** If not, that sentence existed only to carry the fact you do not have, and cutting it is the better draft. Markers that stand in for a *reason* ("We wrote it because `[TK: what did you try first?]`") almost always fail this test, because a generic true reason does the same work: "We wrote it because the tools we tried couldn't push enough load from one machine."

Surface every marker you keep as a numbered question in the handover, and never resolve one by guessing.

## Habits while composing

- **Write the claim, not the frame.** If a sentence announces what you are about to say, delete it and say the thing.
- **Prefer deletion to reformulation.** A sentence that resists being written plainly is usually empty.
- **Repeat the clear word.** Do not cycle synonyms for one referent (agent → assistant → tool → system) to avoid repetition.
- **Vary your own moves.** If every list resolves into the same comma-spliced shape, or every section ends the same way, you have replaced one fingerprint with another.
- **Keep the friction.** Where the voice calls for bluntness, a joke, an admission that you do not know, or a digression, write it in. Do not smooth it out on the way past.
- **Deliver something usable.** The test is whether the user could publish this after answering your questions, not whether it survives a rule check. Clean prose that reads as a punch list has failed at the actual job.

## Before you hand it over

A read-through in your head, not a process. Reread the draft once as a hostile reader and ask:

1. Would I publish this as it stands, after filling the markers? Does it read as a finished piece rather than a scaffold?
2. Does any zero-budget construction appear? Count the em dashes and the three-item lists rather than estimating.
3. Does every section rest on something concrete, or is one of them just adjectives?
4. Do the paragraphs all have the same shape — claim, elaboration, implication — and the same length?
5. Does the rhythm ever break, or does every sentence land the same way?
6. Would the person whose name is on this recognize it as theirs? Are the 3–5 voice signals still findable?
7. Is every checkable specific either given to me or one I actually looked up? Would I stake the author's credibility on each number in here?
8. Is it tidier than it should be — no opinions, no uncertainty, no edges?
9. Did I land within about 15% of the length they asked for, and if not, do I say why?

Fix what that turns up, then deliver. With the draft, tell the user:

- Every marker as a numbered question, worst-first, so they know which answers matter.
- Where any researched fact came from, so they can check it.
- Anything you did deliberately against a rule above, and why.
- Any shortfall against the brief — length, a section you left out, a claim you could not support — named plainly rather than left for them to notice.

## Relationship to remove-ai-slop

Same pattern catalog, opposite direction, and the two do not overlap in use.

- **This skill** is for text that does not exist yet, including new sections of an already-cleaned document. It writes clean and produces nothing but the prose.
- **[remove-ai-slop](../remove-ai-slop/SKILL.md)** is for text that already exists and reads as AI. It scans, writes an evidence report, logs a disposition per finding and verifies the result. Use it when the user wants an audit or a repair of existing prose — never as a cleanup pass over your own fresh draft, because a draft written to these rules should not need one.
- **Deeper reading:** [patterns.md](../remove-ai-slop/references/patterns.md) is the full taxonomy with empirical anchors, model-specific fingerprints and the severity weighting. The drafting rules here cover the same ground from the writer's side; go to patterns.md when you want the evidence behind a rule.

## What NOT to do

- Do not invent a specific — number, name, date, version, benchmark, quote, citation — to make a sentence work. Write around it, or mark it.
- Do not state a version, price, limit, API name or citation from memory as though you had checked it. Look it up or mark it.
- Do not hand back a draft with holes in it. More than a couple of markers, or a marker standing in for a paragraph, means you should be asking questions instead of delivering a scaffold.
- Do not write a draft and then run a polish pass over it. That pass adds tells.
- Do not produce a brief, a checklist, a report, or any file other than the text you were asked for.
- Do not pad to a length — and do not use that as a reason to come in short of the length the user asked for. If you cannot reach it honestly, say what is missing.
- Do not sand the piece into inoffensiveness. No opinions, no short sentences, no admitted uncertainty and no jokes is the failure mode at the other end.
- Do not override the project's style guide or the document's existing conventions with the rules here — theirs win. Say which you followed when they conflict.
- Do not treat this as a score to optimize. Zero flagged constructions in prose nobody wants to read is not the goal; prose that reads like a person who knew the subject is.
