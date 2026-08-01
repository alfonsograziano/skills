# AI-slop pattern catalog

The complete taxonomy for the close-reading pass. Compiled from Wikipedia's "Signs of AI writing" (WikiProject AI Cleanup), the Kobak et al. excess-vocabulary study (*Science Advances*), GPTZero/Pangram frequency lists, stylometric studies of model "accents", published editorial rule sets, and reviewer feedback on real manuscripts.

Read this before the close-reading pass, every time. You need the whole taxonomy in mind while reading, not a remembered subset.

## How to weight what you find

Patterns differ enormously in diagnosticity. Weight findings on three axes:

1. **Diagnosticity of the pattern itself.** Chat artifacts ("I hope this helps") and machine citation markers are near-proof. "Not just X, but Y", tapestry-cluster words, and significance inflation are strong. A single em dash, one "crucial", or one triad is weak — only meaningful in clusters.
2. **Density and co-occurrence.** The reliable field heuristic: **3+ distinct tells within a few hundred words** is what makes a human reader's alarm go off. A pattern at ≳1.5 instances per 1,000 words is a habit, not an accident. Density means *judged* instances over words — never raw scanner candidates, or an over-inclusive read inflates its own severity.
3. **Dialect caution.** Many tells ("delve", "kindly", "the needful") are ordinary in Indian and West-African English and in some academic registers. Judge against the document's own baseline register, not an absolute list.

Era note: vocabulary tells shift with model generations (the "delve" cluster peaked 2023–2024 and newer models suppress it), but the *structural* patterns — triads, negation-contrast, signposting, uniform rhythm, symmetric sections — persist across generations. When in doubt, trust structure over vocabulary.

## Calibrate to the content type first

The same sentence is slop in one register and correct in another. Establish what the document is before judging a single line.

| Content type | Legitimately does this | Still slop here |
|---|---|---|
| Reference docs, API docs | Signposting ("This section covers…"), parallel section shapes, bold term stems, uniform rhythm | Puffery, weasel attribution, kickers, "not X but Y", grandeur metaphors |
| Essays, blog posts, newsletters | A personal aside, a fragment for pace, one earned short closer | Throat-clearing, faux-insight setups, triads, colon reveals, recap endings |
| Marketing and landing copy | Promotional adjectives, short punchy lines, benefit framing | Weasel attribution, invented specifics, tapestry cluster, em-dash clusters |
| Academic and scientific prose | Hedging, passive voice, formal connectives, "we show that" | Excess-vocabulary cluster (delve/underscore/showcase), significance inflation |
| Email and chat | Brevity markers, direct address | Any chatbot artifact, unfilled placeholders, "I hope this finds you well" |
| Fiction and narrative | Fragments, rhythm play, metaphor | Purple grandeur nouns, aphoristic chapter closers, synonym cycling |
| Technical books, long-form nonfiction | Worked examples, deliberate repetition of key terms | Everything in §1, at density; symmetric chapter/section architecture |

Two calibration moves that apply to every type:

- **Register mismatch beats absolute lists.** A patch of corporate-smooth prose inside an otherwise idiosyncratic document is a finding even if no individual word is on any list. Conversely, "leverage" in a finance document is domain vocabulary.
- **Check whether the passage is quoted.** A quotation containing "crucial" is the quotee's problem. The scanner masks block quotes by default; inline quotes and paraphrase you have to catch by eye.

## Table of contents

- [1. Rhetorical constructions](#1-rhetorical-constructions) — the patterns readers quote back
- [2. Vocabulary](#2-vocabulary) — word-level tells
- [3. Sentence-level habits](#3-sentence-level-habits)
- [4. Document structure](#4-document-structure)
- [5. Tone and register](#5-tone-and-register)
- [6. Punctuation and formatting](#6-punctuation-and-formatting)
- [7. Near-proof artifacts](#7-near-proof-artifacts)
- [8. Model-specific fingerprints](#8-model-specific-fingerprints)
- [9. Remediation artifacts](#9-remediation-artifacts) — tells created by de-slopping

---

## 1. Rhetorical constructions

These are the patterns human readers explicitly name and quote back. Default HIGH severity when they recur.

### 1.1 "Not X but Y" / negation-then-redefinition
The single most-cited syntactic tell. The sentence rejects a framing nobody proposed, then supplies the "real" one. Variants:
- "It's not just about X — it's about Y."
- "The trap has nothing to do with X. It is about Y."
- "This isn't X. It's Y."
- "The question isn't the model. It's the eval."
- "It's less about X and more about Y."
- "We'll start not with X, but with Y."
- "not only… but also…"
- Full-rejection form: "not a mirror but a portal."

Scales fractally: whole sections can be built from stacked instances. Count every occurrence; report the total.

### 1.2 Negative listing
The staccato cousin of §1.1: a stack of rejections before the real claim. "Not a framework. Not a library. A compiler." Just say the last one.

### 1.3 Rule of three (tricolon)
Three parallel items where the third adds cadence, not information: "quickly, confidently, and with no awareness"; "innovation, inspiration, and industry insights"; staccato form "Fast. Simple. Effective."

The tell is *rhythmic* triads — interchangeable order, matched grammatical shape, padding third item — and *suspicious coincidence*: every list, example, and anecdote in the document happening to have exactly three parts. A genuine enumeration of three real, distinct things is not a finding. Triad + negation combined ("It's not X. It's A, B, and C.") is very strong.

**Operational test — required, because taste alone is not reproducible.** Two careful readings of the same document once disagreed 4x on the triad count (14 vs 61) purely because neither stated a rule. Count a 3-item list only when it **fails at least two** of these:

| Test | Question | Fails (rhythmic) | Passes (genuine) |
|---|---|---|---|
| **Deletion** | Can an item go without losing information? | "well-formatted, uses appropriate variable names, and follows common patterns" | "the guides, sensors, and feedback loops" |
| **Reorder** | Can the items be freely permuted? | "an incident, a rollback, and a day of remediation" | "specify, plan, execute" (a sequence) |
| **Substitution** | Would a near-synonym for item 3 change nothing? | "reliable, safe, and maintainable" | "a path, a limit, and an offset" |

Two mechanical signals back this up, both printed by `scripts/scan.mjs`:

- **3-item share.** Healthy prose produces 2-, 3-, 4-, and 5-item lists at broadly comparable rates. A 3-item bucket towering over its neighbours is the fingerprint, and it is a fact about the document rather than about the reader.
- **Balance ratio** (longest item ÷ shortest, in words). Near 1.0 means tuned for cadence. Above ~2.5 usually means an enumeration of genuinely unequal things.

At the section and document scale, watch for the same coincidence in structure: three failure modes, three pillars, three forms, three layers — see §4.1.

### 1.4 Signposting and throat-clearing
Telegraphing the move instead of making it:
- "Let's take a closer look at each in turn." / "Let's dive in / unpack this."
- "It's worth noting / stating plainly / quoting directly / pausing here."
- "It's important to note/understand that…"
- "First, we'll look at… Second… Finally…"
- "In this article, we'll explore…"

Opener form, which is the same pattern in a more conversational register: "Here's the thing", "Here's what I mean", "Let me be clear", "I'll be honest", "The uncomfortable truth is", "The reality is". Cut the frame and state the point.

Legitimate in reference documentation, where announcing structure is the job. A tell in essays, posts, and narrative prose.

### 1.5 Faux-insight setup
Flattering the writer as the lone expert who sees what others miss: "What nobody tells you…", "What most people get wrong…", "This is the part everyone skips…", "The part most people miss:". Cut the setup and let the claim stand on its own. If the claim cannot survive without the setup, the claim was the weak part.

### 1.6 Colon reveal
A noun phrase, a colon, then a lowercase dramatic reveal: "The detail that makes it work: a separate agent grades it." "The best part: it learns." Manufactured drama — colons are for lists, labels, and quotes. Rewrite as a plain sentence.

The verbless form above is the one a regex can isolate, and it is the minority. The commoner shape keeps a verb in front of the colon — "Context engineering is a systems discipline: managing what the model sees" — which is indistinguishable by pattern from a colon doing honest work. So judge this one by **rate**: the scanner prints explanatory-colon density over the whole document. Human prose measures 0.2–1.8/1k in academic writing and 2.5–5.5/1k in industry long-form; above ~6/1k the writer is reaching for the move reflexively, and the individual instances are yours to read for.

### 1.7 Aphoristic closure (pseudo-profound kicker)
Paragraph or section ends on a tidy, quotable antithesis: "the difference between fighting the tool and steering it"; "Because in the end, the real question isn't what AI can do — it's what we will do with it." Also fragmented-profundity form: "It's not magic. It's math."

### 1.8 Dramatic fragmentation
Sentence fragments used for percussion rather than meaning: "X. And Y. And Z." "That's it. That's the whole thing." A single fragment can be excellent writing; runs of them are a rhythm crutch. The scanner counts fragment runs mechanically.

### 1.9 Semicolon / comma hedge pairs
Balanced concede-and-retain: "reduce the problem; they do not eliminate it"; "necessary but not sufficient"; "reduce, not eliminate." One is fine; recurring, it's a metronome.

### 1.10 False range
"From X to Y" where X and Y sit on no meaningful scale: "from the singularity of the Big Bang to the grand cosmic web." Test: could you name something *between* X and Y? If not, it's decoration.

### 1.11 Rhetorical question as transition
"So what does this mean for developers?" "The result?" "Sound familiar?" "What if I told you…" "Plot twist:" Questions used as section pivots, immediately self-answered.

The named stubs are easy to grep; the general form is not, because the tell is the *shape* — a question in the author's own voice with its answer in the very next sentence. The scanner counts both total questions and the self-answered subset. Legitimate uses to leave alone: a question posed to the reader as an exercise, one the text deliberately leaves open, and one asked by a person being quoted.

### 1.12 False concession / both-sides hedge
"While critics argue X, supporters maintain Y. The truth lies somewhere in between." Nuance-shaped, position-free.

### 1.13 "X rather than Y" preference framing
Overused contrast connective ("emphasizing military suppression rather than ideological purity"). Weak alone; count it when it recurs.

Its real significance is as a **destination**. When a fix pass removes a §1.1 negation, this is where the contrast usually reappears, so the two counts have to be read together: a document whose negations fell while its "rather than" rate climbed has not improved. Measured across eight real de-slopping passes on one manuscript, "not X but Y" fell 63% while "rather than / instead of" rose 3% — the pattern was moved, not removed, and every one of those passes reported itself clean. The scanner now counts it (`construction-preference-framing`) for exactly this reason, and the per-pattern delta table flags it when it rises. See §9.2.

## 2. Vocabulary

Word-level tells. A single instance is LOW; recurrence in the author's own voice is MEDIUM+. Always check whether the word appears inside a quote (excused) or the author's prose.

### 2.1 The classic AI cluster (strongest word tells)
delve, tapestry (figurative), testament ("stands as a testament to"), underscore(s), showcase/showcasing, intricate/intricacies, meticulous(ly), commendable, pivotal, multifaceted, plethora, myriad, realm, "ever-evolving"/"ever-changing", landscape (abstract), interplay, synergy.

Empirical anchors: "delve" spiked 28x in 2024 biomedical abstracts; "underscores" 13.8x; "showcasing" 10.7x; "complex and multifaceted" is reported ~700x more common in AI text than human text.

### 2.2 Inflation verbs
leverage, harness (figurative), unlock, unleash, empower, embrace, foster, cultivate, garner, bolster, elevate, amplify, augment, streamline, supercharge, facilitate, optimize, navigate (figurative: "navigate the complexities of"), illuminate, resonate ("with audiences"), embark ("on a journey"), utilize (where "use" would do).

### 2.3 Promotional adjectives
crucial, vital, key (adjective), robust, seamless, vibrant, nuanced, holistic, comprehensive, transformative, groundbreaking, revolutionary, cutting-edge, state-of-the-art, unparalleled, unwavering, paramount, profound, invaluable, compelling, rich (figurative: "rich tapestry", "rich heritage"), stunning, breathtaking, renowned, enduring, dynamic, innovative. Plus the hype-phrase cluster: "paradigm shift", "game changer", "this is huge", "this changes everything".

### 2.4 Borrowed-grandeur metaphor nouns
tapestry, mosaic, symphony, labyrinth, kaleidoscope, cacophony, beacon, cornerstone, bedrock, catalyst, journey (figurative), odyssey, ecosystem (outside biology).

### 2.5 Connective and adverb excess
Sentence-initial "Additionally," / "Moreover," / "Furthermore," / "Notably,"; "Consequently", "As such", "Ultimately", "Overall", "Arguably", "That said" / "That being said". Individually normal; AI text runs them at conspicuous density.

### 2.6 Often-empty adverbs and soft signals
just, literally, actually, truly, simply, honestly, genuinely, fundamentally, importantly, crucially, inherently, inevitably; "worth noting", "That said"; first-person framing tics ("Let me explain", "You're absolutely right").

Cut them when they add nothing. **Keep them when they carry real emphasis, uncertainty, contrast, or the writer's spoken rhythm** — stripping every one of these is how an edit flattens a voice. Treat as soft signals that matter at density.

### 2.7 Cliché phrases
"In today's fast-paced world / digital age", "in the age of", "in the ever-evolving landscape of", "navigating the complexities of", "at its core", "at the heart of", "when it comes to", "in terms of", "with regard to", "going forward", "at the end of the day", "plays a vital/crucial/significant role in (shaping)", "a deeper understanding of", "valuable/actionable insights", "delve into the intricacies of", "without further ado", "have you ever wondered…?", "here's the key takeaway", "the key insight", "the practical response/upshot is", "no fluff".

## 3. Sentence-level habits

### 3.1 Copula avoidance
"Serves as / stands as / functions as / marks / represents / boasts / features / offers" where "is/has" would do. "Gallery 825 serves as the exhibition space" → "is".

### 3.2 Nominalized verbs
The verb hidden inside a noun: "made a decision" → "decided"; "has the ability to" → "can"; "provides a solution for" → "solves"; "in order to" → "to"; "conducted an analysis of" → "analyzed".

### 3.3 Superficial -ing analysis (participial tail)
A present-participle clause bolted on for fake depth: "…, highlighting the importance of X", "…, underscoring its significance", "…, reflecting broader trends", "…, ensuring reliability", "…, marking a pivotal moment", "…, paving the way for".

### 3.4 Significance inflation
Mundane facts framed as legacy: "marking a pivotal moment", "a key turning point", "setting the stage for", "left an indelible mark", "solidifies its position", "deeply rooted", "reflects broader trends", "focal point".

### 3.5 Vague attribution / weasel words
"Experts argue", "studies show", "observers have cited", "industry reports suggest", "some critics argue", "widely regarded as" — opinions assigned to nobody in particular. Name the source or cut the claim; never invent a citation to satisfy it.

### 3.6 Elegant variation (synonym cycling)
Repetition-penalty artifact: protagonist → main character → central figure → hero, in consecutive sentences; or agent → assistant → tool → system for one referent. If the clear word is right, repeat it.

### 3.7 Inanimate agency and abstraction subjects
Non-human subjects performing human acts: "the decision emerged", "the data believes", "the architecture wants", "efficiency was improved" with no actor. Prefer a human or concrete subject and an active verb.

### 3.8 Hedging stacks and hedge-and-reassure
"typically", "in most cases", "generally speaking", "while this may vary" — often three hedges before any claim; or a qualifier immediately softened ("This is hard. But it's absolutely achievable.").

### 3.9 Uniform sentence rhythm (low burstiness)
Metronomic 15–27-word sentences with little variance; no fragments, no sprawl. Humans misbehave; LLM prose resolves every sentence cleanly. You can't grep this — read a page aloud in your head and notice whether the rhythm ever breaks. The scanner's `burstiness` and `uniform rhythm runs` are the mechanical proxy.

### 3.10 Orphaned demonstratives and universal truisms
"This means that…" with fuzzy referents; filler wisdom ("Change is the only constant"; "At the end of the day, we're all human").

The copula-definition variant is the one that scales: "This is the X that Y", "This is why…", "This is where…", "This is what…", used as a default way to open a sentence. It hides from run-based detection because instances sit paragraphs apart — a book can carry 150 of them without ever putting two in a row. The scanner's most-repeated-sentence-openers table is what surfaces it. Judge the frame rather than the words: an opener repeated 40 times across a document is a tic even when every individual sentence is fine.

### 3.11 Missing concrete particulars
No proper nouns, dates, prices, versions, or names; examples all hypothetical; nobody has a last name; every improvement is "significant" rather than "40 minutes to 4". The prose is "about" things without touching any. This is the most damaging pattern in the catalog for credibility, and the only one you cannot fix without the author — see the fix playbook's NEEDS-AUTHOR rule.

## 4. Document structure

### 4.1 Five-paragraph-essay shape
Intro + exactly three body sections + recap — at any scale (paragraph, section, document). Related coincidence tell: every example, walkthrough, and anecdote has exactly three steps.

### 4.2 Formulaic conclusions
"In conclusion / In summary / Ultimately…" recaps that restate rather than add; generic positive endings ("The future looks bright", "Exciting times lie ahead", "Only time will tell"). The reader was just there — end on the last concrete point, takeaway, or next action.

### 4.3 "Challenges and future prospects" template
"Despite its X, [subject] faces several challenges… Despite these challenges, [subject] continues to thrive."

### 4.4 Bullet and bold habits
Inline-header lists ("**Performance:** performance has been enhanced…"), bullets where two sentences of prose read better, mechanical bolding of key terms mid-sentence, "Key takeaways" blocks restating the section, a heading over every two-sentence section. Format should follow the content, not decorate it.

### 4.5 Perfectly parallel section lengths
Every section nearly the same size regardless of how much there is to say; identical paragraph shape (claim → elaboration → implication) repeated throughout. The scanner reports section-length and paragraph-shape variation (cv) for this; below ~0.35 means the architecture is symmetric in a way real drafting rarely produces.

### 4.6 Headers with colons; title-case headings
"Scaling Up: How X Changed Y" density; Title Case where the document's convention is sentence case.

## 5. Tone and register

### 5.1 Promotional register on neutral subjects
Travel-brochure prose: "nestled in the heart of", "boasts a rich cultural heritage", "breathtaking natural beauty".

### 5.2 Sycophancy artifacts
"Great question!", "You're absolutely right!", "That's a brilliant observation" — chat correspondence pasted as content.

### 5.3 Register mismatch with the document's baseline
A sudden patch of corporate-smooth prose in an otherwise idiosyncratic document (or vice versa) — judge against the surrounding text, not an absolute standard.

### 5.4 Sanded-off edge
Every opinion hedged, every joke removed, no profanity, no admissions of not knowing, no digressions. Human writing has friction. Uniform inoffensiveness across a long first-person document is itself a tell — and the failure mode a careless de-slopping pass creates (§9.4).

## 6. Punctuation and formatting

### 6.1 Em dash overuse
The most famous tell — and specifically a *Claude* house style (measured 5.4/1k words vs GPT's 1.1). LLMs use em dashes additively (bolting on qualifiers), not for dramatic interruption. Judge by density (>3/1k words) and additive usage. In short copy, none is the right number; in long-form, a handful that beat commas or parentheses are fine.

### 6.2 Curly quotes in straight-quote contexts
"Smart" quotes/apostrophes where the medium's norm is straight (code docs, plain-text email, a document that otherwise uses straight quotes). Mixed conventions inside one document are the real signal — usually a paste from a chat UI.

### 6.3 Emoji as formatting
🚀 💡 ✅ decorating headings or bullets.

### 6.4 Markdown remnants and mechanical perfection
`**bold**` in non-markdown contexts; → arrows in prose; zero typos with perfectly consistent Oxford commas across a long informal document; horizontal rules before every heading; gratuitous tables.

## 7. Near-proof artifacts

Any one of these is effectively conclusive — report as HIGH regardless of density:

- Chat artifacts: "As an AI language model…", "As of my last knowledge update…", "Certainly! Here are…", "I hope this helps!", "Let me know if you'd like…", "Would you like me to…"
- Unfilled placeholders: "Hi {client_name}", "[Your Name]", "[Insert statistic here]"
- Machine citation markers: `oaicite`, `contentReference`, `turn0search0`, `filecite`, `[cite: 1]`, `grok_render_citation_card_json`, `ppl-ai-file-upload`
- `utm_source=chatgpt.com` in linked URLs
- Knowledge-cutoff speculation: "While specific details are not extensively documented in readily available sources…"
- Citation pathologies: DOIs resolving to unrelated papers, invalid ISBNs, plausible-format references that don't exist.

## 8. Model-specific fingerprints

Useful when the user asks "which model wrote this?" — otherwise just context. Report fingerprints as observations, never as an authorship verdict: detectors guess, named patterns are evidence the author can check.

- **Claude**: heavy em dashes (≈5x GPT), more colons, higher vocabulary diversity and burstiness; hedging ("It's worth noting", "That said", "Generally speaking"); "You're absolutely right!"; soft-signal words: honest, genuinely, straightforward, practical, concretely.
- **GPT family**: longer, more uniform sentences; more hedging connectives and passive voice; intro + triplet body + recap structure; "Certainly!/Absolutely!" openers; aggressive bold list stems.
- **Gemini**: verbose, flat rhythm, fewer em dashes, strong list/heading preference; `[cite: 1]` markers.
- **Grok**: "X rather than Y" emphasis; idiosyncratic "causal", "empirical", "correlate".

Stylometric context: an 18-feature classifier separates OpenAI from Anthropic prose at ROC-AUC 0.96 — model families have stable "accents", so consistent fingerprints across a document are meaningful evidence.

## 9. Remediation artifacts

Tells that appear *because* someone de-slopped the text. This section does double duty: it is what the verification pass hunts for, and it is the list of mistakes the fix pass must not make. They matter disproportionately, because a naive "is the old string gone?" check passes every one of them, so they survive round after round.

Observed on a real remediation pass over a ~10,000-word document, which cut the lexical tier 40% (52 → 31 regex hits) while leaving the 3-item list count **completely unchanged at 62**.

### 9.1 Relocated negation
The negation moves from the setup to the tail. The string changes; the pattern does not.

> "It is not a list of implementation steps. It is the outcome you are aiming for: …"
> → "It is what you want to be true after the work is done: … It is an outcome, **not a list of implementation steps**."

Detection: search for the negated noun phrase rather than the whole sentence. If it survives anywhere in the paragraph, the tell was moved, not removed.

### 9.2 Lateral substitution
One HIGH tell swapped for a different HIGH tell.

> "not a practice of *maximum* automation. It is a practice of *calibrated* automation"
> → "aims at *calibrated* automation: humans present for the decisions that carry consequences, agents running free on the ones that don't"

A "not X but Y" rewritten as a balanced antithesis (§1.7) is a lateral move. So is a triad collapsed into a single sentence that keeps all three items in parallel, and a kicker rewritten into a better kicker.

**The commonest instance by a wide margin: §1.1 → §1.13.** The negation comes out and the same contrast goes back in as "Y rather than X". It survives every naive check because the old string really is gone, the aggregate hit count really did fall, and the replacement is ordinary English.

This is now mechanically detectable. `scripts/scan.mjs` on exactly two files prints a **PER-PATTERN DELTAS** table and marks every pattern whose raw count rose with `⚠ ROSE`. Read the risers next to the fallers: one pattern down 7 and a related pattern up 6 is a trade, not progress. The gate's limit is that it can only see patterns that have a detector, so a clean table is the absence of one kind of evidence rather than a clean bill of health.

### 9.3 Signpost laundering
The throat-clearing vocabulary goes; the section-announcement sentence stays.

> "it's also worth being honest about what happens to engineers who don't adapt"
> → "This one covers what happens to engineers who don't adapt."

Both are §1.4. The fix removed a soft-signal word ("honest") and a "worth" frame, and left the signpost standing.

### 9.4 Over-flattening (burstiness collapse)
The pass deletes every short punchy sentence, so the prose loses its variance. Symptom: `burstiness` (sd/mean of sentence length) *falls* between versions. A document where no sentence ever surprises you reads as machine text that has been sanded down — §3.9 by a different route. Some kickers should survive; the question is whether each one earns its place, not whether any exist.

### 9.5 Uniform fix shape
The remediation itself becomes a pattern: every flagged triad collapsed into a comma-spliced single sentence, every closer deleted so that N paragraphs in a row now end mid-thought, every "not X but Y" turned into the same "X, though Y" shape. Vary the repair or the repair becomes the new fingerprint.

### 9.6 Voice erasure
The tells are gone and so is the writer. Symptoms: the profanity, jokes, digressions, admissions of uncertainty, and blunt opinions all disappeared; every paragraph is equally tidy; the draft now reads as competent and anonymous. This is the most common way a de-slopping pass makes a document worse while every metric improves. See §5.4.

### 9.7 Invented specificity
The fix for "significantly improved performance" is a real number, so a careless pass supplies one. Any figure, date, name, benchmark, or citation that was not in the source is a fabrication, no matter how plausible. Flag NEEDS-AUTHOR instead.

### 9.8 Coverage illusion
Not a prose tell but the failure that wraps all of the above: a prior report's **misses** get read as the current report's **regressions**. When a re-scan flags something the earlier pass never looked at, say so explicitly. Otherwise the author concludes that fixing the text made it worse, and stops trusting the tool.
