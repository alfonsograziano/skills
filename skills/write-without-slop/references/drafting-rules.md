# Drafting rules

The complete catalog of AI-writing tells, rewritten from the writer's side: your default move, and what to write instead. Read this before drafting, every time — you need the whole set in mind while composing, not a remembered subset.

Nothing here is a report to fill in or a check to run. It is what you hold in your head while producing the text.

Source taxonomy: [../../remove-ai-slop/references/patterns.md](../../remove-ai-slop/references/patterns.md), which carries the evidence, the severity weighting and the model-specific fingerprints. Section numbers below match it, so a rule can be traced back.

## Calibrate to the content type first

The same sentence is clean in one register and slop in another. Know which document you are writing before the first line.

| Writing this | These are correct here | These are still tells here |
|---|---|---|
| Reference docs, API docs | Signposting ("this section covers…"), parallel section shapes, bold term stems, uniform rhythm | Puffery, weasel attribution, kickers, "not X but Y", grandeur metaphors |
| Essays, blog posts, newsletters | A personal aside, a fragment for pace, one earned short closer | Throat-clearing, faux-insight setups, rhythmic triads, colon reveals, recap endings |
| Marketing and landing copy | Promotional adjectives, short punchy lines, benefit framing | Weasel attribution, invented specifics, the tapestry cluster, em-dash clusters |
| Academic and scientific prose | Hedging, passive voice, formal connectives, "we show that" | delve / underscore / showcase cluster, significance inflation |
| Email, Slack, chat | Brevity, direct address | Any chatbot artifact, unfilled placeholders, "I hope this finds you well" |
| Fiction and narrative | Fragments, rhythm play, metaphor | Purple grandeur nouns, aphoristic chapter closers, synonym cycling |
| Technical books, long-form nonfiction | Worked examples, deliberate repetition of key terms | Everything below, at density; symmetric chapter and section architecture |
| PR descriptions, commits, changelogs | Terse fragments, imperative mood, bare lists | Narrative framing, significance inflation, "this PR aims to leverage…" |

Two rules that apply whatever the type:

- **Match the document, not an absolute standard.** A patch of corporate-smooth prose inside an idiosyncratic document is a tell even when no individual word is on any list. Meanwhile "leverage" in a finance document is domain vocabulary, and "harness" in a robotics document is a noun.
- **Register consistency beats correctness.** When adding to something that exists, its conventions win: heading case, quote style, contraction use, how formal the first person is.

## 1. Rhetorical constructions — the ones readers quote back

These are what make a reader say "an LLM wrote this". Zero budget, in every register.

### 1.1 "Not X but Y" / negation-then-redefinition
**Default:** reject a framing nobody proposed, then supply the real one. "It's not about the model. It's about the eval." "This isn't a framework — it's a compiler." "not only… but also".
**Instead:** write Y as a plain assertion. "The eval matters more than the model." If the contrast genuinely informs the reader, name the thing being corrected as a real position someone holds, with an attribution — otherwise it is shadow-boxing.
**Watch for:** the variant that puts the negation at the tail ("…, not a list of steps"). Same pattern, different word order.

### 1.2 Negative listing
**Default:** a stack of rejections before the claim. "Not a library. Not a framework. A compiler."
**Instead:** the last one, on its own.

### 1.3 Rule of three
**Default:** three parallel items, the third carrying rhythm rather than information — "quickly, confidently, and with no awareness"; "Fast. Simple. Effective."
**Instead:** write the number of items the thing has. Before committing a three-item list, apply three tests; **two failures means it is a beat, not a list**:

| Test | Question | It is rhythmic if… | It is genuine if… |
|---|---|---|---|
| Deletion | Can an item go without losing information? | "well-formatted, sensibly named, and idiomatic" — drop any, the claim survives | "the guides, sensors, and feedback loops" — each is a distinct component |
| Reorder | Can the items be freely permuted? | "an incident, a rollback, and a day of remediation" | "specify, plan, execute" — a sequence |
| Substitution | Would a near-synonym for item three change nothing? | "reliable, safe, and maintainable" — swap in "robust", nothing moves | "a path, a limit, and an offset" |

Also watch the document scale: if every example, walkthrough, list and section count in the piece has three parts, that coincidence is the fingerprint even when each individual list passes. Two items is often the honest number, and four is fine.

### 1.4 Signposting and throat-clearing
**Default:** telegraph the move instead of making it. "Let's take a closer look." "It's worth noting that…" "First we'll look at… Second… Finally…" Conversational forms: "Here's the thing", "Let me be clear", "I'll be honest", "The reality is".
**Instead:** the section's first real sentence is the opener. Delete the frame entirely — not reword it into a plainer frame.
**Exception:** reference documentation, where announcing structure is the job.

### 1.5 Faux-insight setup
**Default:** flatter the reader or yourself as the one who sees what others miss. "What nobody tells you…", "What most people get wrong…", "the part everyone skips".
**Instead:** the claim alone. If it cannot stand without the setup, the claim was the weak part — cut or sharpen it.

### 1.6 Colon reveal
**Default:** noun phrase, colon, lowercase dramatic payoff. "The detail that makes it work: a separate agent grades it."
**Instead:** one plain sentence with a verb. "A separate agent grades it, which is what makes it work." Reserve colons for lists, labels and quotes — and do not swap the colon for an em dash, which is the same move in different punctuation.

### 1.7 Aphoristic closure (the kicker)
**Default:** end a paragraph or section on a tidy quotable antithesis. "…the difference between fighting the tool and steering it." "It's not magic. It's math."
**Instead:** end on the clearest concrete sentence you already wrote. If the passage genuinely needs closure, give a takeaway the reader can act on or the next step. At most one kicker in a whole piece, and only when it is the actual point.

### 1.8 Dramatic fragmentation
**Default:** fragments as percussion. "That's it. That's the whole thing."
**Instead:** complete sentences, keeping the occasional fragment that earns its beat. One good fragment is good writing; a run of them is a rhythm crutch — and deleting every one flattens the prose, which is the opposite failure.

### 1.9 Semicolon and comma hedge pairs
**Default:** balanced concede-and-retain. "They reduce the problem; they do not eliminate it." "Necessary but not sufficient."
**Instead:** the half that carries the argument. Keep the concession only where a reader would otherwise over-read the claim, and vary how you attach it.

### 1.10 False range
**Default:** "from X to Y" where X and Y sit on no scale. "from the Big Bang to the cosmic web".
**Instead:** name the two things, or give the real scale. Test: can you name something *between* X and Y? If not, it is decoration.

### 1.11 Rhetorical question as transition
**Default:** "So what does this mean for developers?" "The result?" "Sound familiar?" — a question used as a pivot and immediately answered.
**Instead:** the answer, as the sentence. At most one in a piece, where it is genuinely the reader's question.

### 1.12 False concession
**Default:** "While critics argue X, supporters maintain Y. The truth lies somewhere in between." Nuance-shaped, position-free.
**Instead:** take the position, or say plainly that you do not know and why.

### 1.13 "X rather than Y" preference framing
**Default:** the contrast connective as a verbal tic — "emphasizing speed rather than correctness".
**Instead:** fine once; when you notice it recurring, rewrite as a direct claim.

## 2. Vocabulary

A single word is weak evidence; recurrence in your own voice is the tell. Use the plain word first.

### 2.1 The classic cluster — avoid outright
delve, tapestry (figurative), testament ("stands as a testament to"), underscore, showcase, intricate/intricacies, meticulous, commendable, pivotal, multifaceted, plethora, myriad, realm, "ever-evolving", landscape (abstract), interplay, synergy.
"delve" ran 28x above baseline in 2024 biomedical abstracts; "underscores" 13.8x; "showcasing" 10.7x. These are the words detection tools were built on.

### 2.2 Inflation verbs → the plain verb
leverage → use. utilize → use. harness (figurative) → use. facilitate → help, enable. streamline → simplify, speed up. unlock, unleash, empower, foster, cultivate, garner, bolster, elevate, amplify, augment, supercharge → say what actually happens. navigate ("the complexities of"), illuminate, resonate, embark ("on a journey") → cut.

### 2.3 Promotional adjectives → a property or nothing
crucial, vital, key, robust, seamless, vibrant, nuanced, holistic, comprehensive, transformative, groundbreaking, revolutionary, cutting-edge, state-of-the-art, unparalleled, unwavering, paramount, profound, invaluable, compelling, rich, stunning, renowned, enduring, dynamic, innovative. Plus "paradigm shift", "game changer", "this changes everything".
**Instead:** name the property that makes it matter — "robust" → "it retries on partial failure". If no property fits, the claim was empty; cut it. In marketing copy these adjectives are the job, but they still need a specific behind them.

### 2.4 Borrowed-grandeur nouns
tapestry, mosaic, symphony, labyrinth, kaleidoscope, cacophony, beacon, cornerstone, bedrock, catalyst, journey (figurative), odyssey, ecosystem outside biology. Say the literal thing.

### 2.5 Connective excess
Sentence-initial "Additionally", "Moreover", "Furthermore", "Notably", "Consequently", "As such", "Ultimately", "Overall", "Arguably", "That being said". Each is normal once; AI prose runs them at conspicuous density. Prefer "and", "so", "but", or nothing — most sentences do not need a connective at all, because the order already implies the relation.

### 2.6 Empty adverbs and soft signals
just, literally, actually, truly, simply, honestly, genuinely, fundamentally, importantly, crucially, inherently, inevitably; "worth noting"; "let me explain".
**Do not write them reflexively, and do not strip them mechanically either.** Keep the ones carrying real emphasis, real uncertainty, contrast, or the writer's spoken rhythm. Removing every one of these is how prose loses its voice.

### 2.7 Cliché phrases — cut on sight
"In today's fast-paced world", "in the digital age", "in the ever-evolving landscape of", "navigating the complexities of", "at its core", "at the heart of", "when it comes to", "in terms of", "going forward", "at the end of the day", "plays a crucial role in", "a deeper understanding of", "actionable insights", "without further ado", "have you ever wondered", "here's the key takeaway", "no fluff".
The sentence almost always stands without the phrase.

## 3. Sentence-level habits

### 3.1 Copula avoidance
**Default:** "serves as / stands as / functions as / represents / boasts / features" where "is" or "has" would do.
**Instead:** is, has.

### 3.2 Nominalized verbs
**Default:** the verb hidden in a noun — "made a decision", "has the ability to", "provides a solution for", "conducted an analysis of", "in order to".
**Instead:** decided, can, solves, analyzed, to.

### 3.3 Superficial "-ing" analysis
**Default:** a participial clause bolted on for depth — "…, highlighting the importance of X", "…, underscoring its significance", "…, reflecting broader trends", "…, paving the way for".
**Instead:** the concrete consequence as its own clause — "…, so users find old drafts without leaving the editor" — or end the sentence at the fact. Swapping "highlighting" for "showing" does not fix it.

### 3.4 Significance inflation
**Default:** mundane facts framed as legacy — "marking a pivotal moment", "a key turning point", "set the stage for", "left an indelible mark", "solidifies its position", "deeply rooted".
**Instead:** state the fact. Let the reader decide whether it is a turning point. Downgrading to "an important step" is the same move, quieter.

### 3.5 Vague attribution
**Default:** "experts argue", "studies show", "observers have cited", "widely regarded as".
**Instead:** name the person, paper or company, with enough detail to check. If you cannot, cut the claim or mark it `[TK: who says this?]`. Never invent a study, an expert or a statistic — a plausible fake citation is the single most damaging thing you can write.

### 3.6 Elegant variation (synonym cycling)
**Default:** rotate synonyms for one referent — protagonist → main character → central figure → hero; agent → assistant → tool → system.
**Instead:** pick the clear term and repeat it. Repetition of the right word is invisible; cycling is conspicuous.

### 3.7 Inanimate agency
**Default:** abstractions doing human things — "the decision emerged", "the data believes", "the architecture wants", "efficiency was improved" with no actor.
**Instead:** a human or concrete subject and an active verb. Say who did it.

### 3.8 Hedging stacks
**Default:** three hedges before a claim — "generally speaking, in most cases, this typically…" — or a claim immediately un-said ("This is hard. But it's absolutely achievable.").
**Instead:** one hedge, the one that reflects real uncertainty. Either the claim holds or say plainly what you do not know. Academic prose gets more latitude here, not unlimited.

### 3.9 Uniform rhythm
**Default:** metronomic 15–27-word sentences that all resolve cleanly, no fragments, no sprawl.
**Instead:** let the sentence length follow the thought. One long sentence that accumulates qualifications, then a four-word one. Read a paragraph in your head and notice whether the rhythm ever breaks; if it never does, the prose reads as machine-made regardless of its vocabulary. Human non-fiction varies sentence length by roughly 45–70% of its mean — do not manufacture that with fragment runs, get it by writing sentences that do different jobs.

### 3.10 Orphaned demonstratives and truisms
**Default:** "This means that…" with a fuzzy referent; filler wisdom ("change is the only constant").
**Instead:** name what "this" is. Delete the truism — it is always deletable.

### 3.11 Missing concrete particulars — the one you cannot fix later
**Default:** no proper nouns, no dates, no versions, no prices, hypothetical examples only, nobody with a last name, every improvement "significant".
**Instead:** at least one checkable specific per substantive claim. "Cut p99 from 2.1s to 180ms" instead of "significantly improved performance". "Node 22's `--experimental-strip-types`" instead of "modern tooling".
This is the tell that costs the most credibility and the only one an editor cannot repair without the author. Get the specifics before drafting.

When you are missing one, the order is: **write around it, then mark it.** Most sentences do their job without the fact ("Cold starts now sit at 180ms" needs no baseline), and rewriting is invisible where a `[TK]` marker is not. Mark it only where the sentence genuinely cannot work without the specific, keep the count to one or two in a short piece, never let a marker stand in for a paragraph, and never leave a sentence a reader cannot parse. **Never invent the fact**, and never assert a version, price, limit, API name or citation from memory as though you had looked it up — memory is where fabricated specifics come from, and they are the most expensive mistake in this document.

Distinguish the checkable claim from illustrative texture, or this rule will strangle ordinary writing. "Plugin upgrades broke other plugins and disks filled with old workspaces" is domain colour, and fine. "A dozen repos", "40% faster", "most teams hit a rate limit first" are things a reader could check and you cannot — those need a source or a marker.

## 4. Document structure

### 4.1 Five-paragraph-essay shape
**Default:** intro, exactly three body sections, recap — at any scale.
**Instead:** as many sections as the material has parts, of unequal length, with no recap. Decide this before writing; restructuring afterwards is expensive.

### 4.2 Formulaic conclusions
**Default:** "In conclusion…", "Ultimately…", a recap that restates, a generically hopeful ending ("exciting times lie ahead", "only time will tell").
**Instead:** end on the last concrete point, a takeaway the reader can act on, or the next step. The reader was just there; they do not need a summary of it.

### 4.3 "Challenges and future prospects" template
**Default:** "Despite its X, [subject] faces several challenges… Despite these challenges, [subject] continues to thrive."
**Instead:** name the specific open problem and who is affected, or leave it out.

### 4.4 Bullet and bold habits
**Default:** inline-header lists ("**Performance:** performance has improved…"), bullets where two sentences of prose read better, key terms bolded mechanically, a "key takeaways" block restating the section, a heading over every two-sentence section.
**Instead:** let format follow content. Prose for arguments, lists for things that are genuinely enumerable, bold for the one term that must be found by eye. If a bullet list has two items and both are sentences, it is a paragraph.

### 4.5 Perfectly parallel sections
**Default:** every section the same size, every paragraph the same shape (claim → elaboration → implication).
**Instead:** length proportional to substance. Vary paragraph shape deliberately: sometimes the example first, sometimes the conclusion first, sometimes a single-sentence paragraph.

### 4.6 Heading style
**Default:** "Scaling Up: How X Changed Y" everywhere; Title Case in a sentence-case document.
**Instead:** the document's existing convention. Avoid the colon-subtitle pattern at density.

## 5. Tone and register

### 5.1 Promotional register on neutral subjects
"Nestled in the heart of", "boasts a rich cultural heritage", "breathtaking beauty". Describe what is there.

### 5.2 Sycophancy
"Great question!", "You're absolutely right!" Never in written output — this is chat correspondence pasted where prose belongs.

### 5.3 Register mismatch
A patch of corporate-smooth prose in an idiosyncratic document, or vice versa. Judge each paragraph against its neighbours.

### 5.4 Sanded-off edge — the failure at the other end
Every opinion hedged, every joke removed, no admissions of not knowing, no digressions, uniform inoffensiveness. This reads as machine text just as clearly as the tells above, and it is what over-applying this document produces. Human writing has friction: keep the blunt sentence, the aside, the "I don't know why this works", the moment of preference. If the voice you are writing toward swears, let it swear.

## 6. Punctuation and formatting

### 6.1 Em dashes
The most famous tell, and specifically a Claude house style — measured at 5.4 per 1,000 words against GPT's 1.1. The giveaway is *additive* use: bolting a qualifier onto a finished sentence.
**Instead:** a comma, a period, a colon, or parentheses, chosen per site so the punctuation varies. Keep the one or two that clearly beat every alternative. In short copy, none is the right number.

### 6.2 Quote characters
Match the medium's norm and the document's own convention. Mixed straight and curly quotes in one file is the real signal, and usually means a paste from a chat UI.

### 6.3 Emoji as formatting
No 🚀 💡 ✅ decorating headings or bullets, unless the target medium's convention genuinely is that and the user asked for it.

### 6.4 Mechanical perfection
`**bold**` in non-Markdown contexts, → arrows in prose, a horizontal rule before every heading, gratuitous tables, flawless Oxford-comma consistency across a long informal document. Slight unevenness is what real drafting looks like; do not fake typos, but do not enforce uniformity that the register does not need.

## 7. Never, in any register

Any one of these is effectively proof to a reader:

- Chat artifacts: "As an AI language model", "Certainly! Here are", "I hope this helps", "Let me know if you'd like", "Would you like me to".
- Unfilled placeholders: "Hi {client_name}", "[Your Name]", "[Insert statistic here]". `[TK: ...]` is the one exception, and only because you surface it explicitly on handover.
- Machine citation markers of any kind, and `utm_source=chatgpt.com` in a URL.
- Knowledge-cutoff hedging: "while specific details are not extensively documented in readily available sources".
- Citations you have not verified: a DOI, ISBN, paper title, author or URL that you produced from memory rather than from a source in front of you.

## 8. Do not over-apply this document

Every rule above has a failure mode on the other side. Watch for these in your own draft:

1. **Same repair everywhere.** If every contrast becomes "X, though Y", every list becomes a comma splice, and every section ends mid-thought, the avoidance has become its own fingerprint. Vary the moves.
2. **Variance deleted.** Cutting every short punchy sentence flattens the rhythm and lands you back in §3.9 by another route.
3. **Voice erased.** The tells gone and the writer gone with them — competent, anonymous, uniformly tidy. This is the worst outcome available, and it looks like success from every angle except reading it.
4. **Specificity invented.** The fix for "significantly improved" is a real number. If you do not have one, write around it or mark it. A fabricated figure is a worse defect than the vague sentence it replaced.
5. **A draft full of holes.** The opposite over-correction, and the more common one: so many `[TK]` markers that the piece is a punch list rather than something the user can publish. Every marker you can write around, write around. If the piece cannot be written without answers, ask for them instead of delivering a scaffold.
6. **Under-delivered on the brief.** Refusing to pad is right; coming in 30% short of the length someone asked for and saying nothing about it is not. Name the shortfall and what would fill it.
7. **Nothing left to disagree with.** If a reader can find no claim to argue with, no preference and no admitted limit, the draft has been optimized into mush. Prose is supposed to say something.
