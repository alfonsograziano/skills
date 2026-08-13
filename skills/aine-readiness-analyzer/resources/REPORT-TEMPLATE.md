# AI-Native Readiness Report

**Repo:** _(fill in)_
**Date:** _(fill in)_
**Stack:** _(fill in — language, framework, build system, as you actually found them)_

**Result:** _(fill in at the end: N passed, N failed, N not applicable — the three numbers must sum to 46)_

---

**How to read this.** Every item is a numbered question about this repo, answered from evidence in this repo. `Proof` is what was actually found — a path, a file, a command and its output. An item with no proof is not an answer. The italic line under each question says how to check it; it stays in the report so the next run checks the same way.

**FAIL vs N/A.** `FAIL` means the practice would help here and it is missing — including when a whole artifact is missing, so several questions about it fail together with a one-line proof pointing at the item that found it missing. `N/A` means the question could never apply to a project of this kind, and the proof says why. "It does not exist" is a FAIL, never an N/A.

`Priority` is fixed by the template, not by the person filling it in. **High** means an agent working here will hit this on day one, or the risk is real. **Low** means it makes things better but nothing breaks without it.

---

## 1. Context

- [ ] 1. Does an agent instruction file exist (AGENTS.md, CLAUDE.md, .cursorrules, .github/copilot-instructions.md, or this ecosystem's equivalent), and what does it point at?
  *Look for a file whose purpose is to be loaded into a coding agent's context at the start of every session. That file is the **entry point**. Then follow its pointers: instructions are commonly spread across several files, with the entry point routing to them — "commands are in docs/development.md", "conventions in .claude/rules/". The entry point plus every file it points at is the **instruction set**, and every other agent-instruction question is answered against that whole set, so list it here in the proof. Follow pointers as deep as they go, but a pointer only counts when it names a target and says what is in it: "test commands are in CONTRIBUTING.md" counts, a bare "see the docs" does not, and a file nothing points at is outside the set however good it is. A README is not an entry point, however good — it gets its credit at the README item and the specs-and-architecture item — but a README the entry point explicitly routes to is inside the set. Vendored skill libraries are not instructions either.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 2. Do the agent instructions name the commands to build, test and check this project?
  *Answer this against the instruction set mapped at the entry-point item and nothing outside it. If no entry point exists, FAIL with a one-line proof pointing at that item. The commands may sit in a file the entry point routes to rather than in the entry point itself — that is progressive disclosure working as intended, and it passes. What fails is a command an agent would have to guess its way to: if the commands live only in the README or the manifest and nothing in the set points at them, that is a FAIL, because the question measures what an agent can reach without being told where to look. Name the file each command was found in.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 3. Does everything the agent instructions name still exist — the commands, the paths, the libraries, and the files they point at?
  *If no entry point exists, FAIL with a one-line proof pointing at the entry-point item. Verify, do not trust: check every named command against the manifest or build file, spot-check the paths, run the cheap read-only ones. Then resolve every pointer in every file of the set — a link to a moved or deleted file is the most common rot in a multi-file instruction set, and it fails silently: the agent reads the entry point, follows nothing, and carries on without the rules.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 4. Are the agent instructions specific to this repo, rather than advice that would read the same in any codebase?
  *If no entry point exists, FAIL with a one-line proof pointing at the entry-point item. The test: could this be pasted into another project unchanged? "Write clean code" and "add tests for new features" would fit anywhere and count for nothing. Judge the whole set, but weigh the files differently: an entry point that is mostly a routing table is fine, even good, when what it routes to is specific — while generic filler in the entry point costs more than generic filler three hops down, because it is loaded into every session whether it is needed or not. Say which files carried the specifics.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 5. Do the agent instructions explain where things live and how this project is laid out?
  *If no entry point exists, FAIL with a one-line proof pointing at the entry-point item. The map may live in a routed-to file. Judge coverage against the real tree, not against what the files mention: if the set maps one package well but is silent about sibling packages or directories an agent would land in, that is a FAIL with the omission named. In a multi-file set, check the routing too — a layout document nothing points at is a document the agent never opens.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 6. Do the agent instructions state the rules that are not obvious from the code — the things never to do here?
  *If no entry point exists, FAIL with a one-line proof pointing at the entry-point item. These are the tribal-knowledge traps: the flag that must be exactly this string, the import that breaks the build, the directory that is generated and must not be edited. Rules in a routed-to file count. Two extra checks in a multi-file set: that the entry point signposts the rules clearly enough for an agent to open them *before* it needs them, since a trap found afterwards has already been sprung; and that the files do not contradict each other, because nothing tells the agent which one wins.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 7. Has the agent instruction file been updated recently enough to still be true, given how active the repo is?
  *If no agent instruction file exists, FAIL with a one-line proof pointing at the entry-point item. Compare the last commit touching the file against the repo's tempo, then spot-check two or three of its claims against the code — a recently touched file can still lie.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 8. Is the agent instruction file small enough to load into every session without crowding out the actual task?
  *If no agent instruction file exists, FAIL with a one-line proof pointing at the entry-point item. Measure it: `wc -c`, and bytes divided by four is a fair token estimate. Under ~5k tokens is comfortable; past ~10k it is eating the context window.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 9. Can a fresh session pick up a half-finished task — is there a file or convention where progress, decisions and what is left get written down?
  *This is not about the agent instruction file. Any durable place in-flight state gets written counts: a TODO.md, a plans or notes directory, task files, linked issues, a specs folder whose entries carry progress and open questions, an agent memory file or directory, a scratchpad or working-notes convention. The test is whether a fresh session could read it and know what was decided and what is left — not what the place is called. Git history alone does not count: it records what happened, not what was decided or what remains.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 10. Is there a README that says what this project is and how to run it?
  *This is where a good README earns its credit. It needs three things: what the project is, how to run it, and how to check a change. Judge what is on the page, not the file's existence.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

## 2. Specs

- [ ] 11. Is the thinking behind this system written down somewhere durable — a specs, RFC, proposals, design-doc or ADR directory, or architecture notes that record not just what but why?
  *Look for the place and for the convention: `specs/`, `docs/adr/`, `rfcs/`, `proposals/`, `.specify/`, a docs or design folder, architecture notes anywhere in the tree, or this ecosystem's equivalent. Judge substance, not location: "we use X because Y" is a decision, a list of technologies is not, an essay about specs is not a spec, and a docs folder of usage guides with no reasoning is a FAIL whose proof says what was in there instead. Other items are answered against whatever this item finds, so name it precisely — and where forward-looking specs and after-the-fact architecture records live in different places, name both, since a decision log cannot answer a question about acceptance criteria.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 12. Does the specs directory hold recent entries, or is it an archive nobody has touched?
  *If no specs directory exists, FAIL with a one-line proof pointing at the specs-and-architecture item. Otherwise compare the newest entry's date against the repo's recent activity.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 13. Is there a spec template, or an SDD framework, so every spec comes out the same shape?
  *Scaffolding can exist even where no specs directory does — look for a TEMPLATE.md, a `.specify/` directory, or framework config. If neither a directory nor any scaffolding exists, FAIL.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 14. Do the specs state acceptance criteria a machine could check?
  *If no specs exist, FAIL with a one-line proof pointing at the specs-and-architecture item. Otherwise open the two newest specs and quote a criterion: "the endpoint returns 403 for expired tokens" is checkable; "the feature works well" is not.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 15. Open the newest spec: do its criteria go past the happy path — what happens when a step fails, and how the change gets undone?
  *If no specs exist, FAIL with a one-line proof pointing at the specs-and-architecture item. Look for error cases, edge inputs, and a rollback or undo story, not just the success flow.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 16. Do the specs state non-goals, so an agent knows where to stop?
  *If no specs exist, FAIL with a one-line proof pointing at the specs-and-architecture item. Non-goals written elsewhere (a README's "what this is not" list) are worth naming in the proof, but they do not turn this into a PASS — the question is whether specs carry them.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 17. Can recent shipped work be traced back to a spec?
  *If no specs exist, FAIL with a one-line proof pointing at the specs-and-architecture item. Otherwise take the last few substantial commits or PRs and look for a reference to a spec, an issue, or a design doc in the message or description.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

## 3. Verification

- [ ] 18. Does this project have an automated test suite, in whatever form this ecosystem uses?
  *Work out this ecosystem's convention before concluding anything is missing — check the manifest, the build file, the CI config, the README. A shell script that diffs output files is a test suite. If you find one, run it and record the result.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 19. Can the test command be discovered without guessing — is it written down where an agent reads?
  *If no test suite exists, FAIL with a one-line proof pointing at the test-suite item. Otherwise check the places an agent looks: the agent instruction file, the README, the manifest's scripts or targets.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 20. Do the tests assert real behaviour, rather than asserting that a mock was called?
  *If no test suite exists, FAIL with a one-line proof pointing at the test-suite item. Otherwise open the largest test files and read the assertions: calling real code on real inputs passes; `expect(mock).toHaveBeenCalled()` as the main dish fails.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 21. Is there a linter or static analysis configured for this language, and does it pass on a clean checkout?
  *Configured is not enough — run it. A linter that exits non-zero on an untouched checkout is a FAIL with the error count in the proof, because an agent cannot tell its own damage from the baseline noise.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 22. Is there a formatter, so an agent's diffs do not churn on style?
  *Look for the config file and the dependency in this ecosystem's form — .prettierrc, rustfmt, gofmt, black, an .editorconfig doing real work. If the language ships one formatting standard with the toolchain, that is a PASS and the proof says so.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 23. Is there a compile-time or type-level gate, if this language offers one?
  *N/A only when the language genuinely has no such gate. If the language offers one and the repo does not use it — no strict mode, no typecheck script, no compiler step — that is a FAIL. Run the gate if it exists and record the result.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 24. Can an agent prove its own work before it pushes — one command, task-runner target or commit hook that runs every check this project has?
  *One command, not a list to remember: a `check` or `verify` target, a `precommit` script, a Makefile target that chains them. Separate commands documented side by side are close but FAIL — the question is whether the agent can run the whole gauntlet without knowing its parts.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 25. Is there continuous integration, and does it run before a change lands rather than after?
  *A deploy pipeline that runs on push to the default branch runs after the change has landed — that is a FAIL with the trigger quoted, not a PASS with a caveat. Look for a pre-merge trigger: pull_request events, merge trains, or this forge's equivalent.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 26. Does CI actually run the tests and the checks that exist in this repo?
  *If no pipeline of any kind exists, FAIL with a one-line proof pointing at the CI item. Otherwise list what the pipeline runs and diff it against every check found in the Verification section — name each check that exists in the repo but is missing from the pipeline.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 27. Does anything here get an LLM to read a change and go looking for problems — a review skill, a saved review prompt, or an AI reviewer on the pull requests?
  *Look for a committed review skill or slash command, a CI step calling an AI reviewer, or bot config. Human review rules are a Safety item; this one is specifically about machine review.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

## 4. Tooling

- [ ] 28. Can an agent reach the outside systems this project depends on, with that access committed to the repo rather than set up per laptop?
  *MCP servers are one form: look for a committed `.mcp.json` or this ecosystem's equivalent. A CLI is another and often the better one — `aws`, `gh`, `psql`, `kubectl`, `stripe`, a vendor's own tool — and it counts when the repo names which tools the work needs and how to authenticate, so an agent is not guessing at a tool it cannot see. Judge the axis, not the mechanism: access that exists only in someone's shell history or laptop config is a FAIL, and so is a committed config that turns out to be gitignored, with the distinction in the proof. Project task scripts have their own item; this one is about reaching past the repo's edge. If this project genuinely talks to nothing outside itself, N/A with that as the reason.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 29. Is there a skills, commands or reusable-prompt library in the repo?
  *Look for .claude/skills, .agents/skills, .claude/commands, or a prompts directory. Committed and pinned beats committed; note whether anything ties the copies to a source.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 30. Do the skills, servers and tools that exist cover the work this team plainly repeats?
  *First identify the repeated work from the README and the commit history. If skills, servers or documented tooling exist but miss it, FAIL naming the gap. If none exist at all and the repo plainly repeats work, FAIL pointing at the outside-systems item and the skills-library item. If the project is too small to repeat anything, N/A.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 31. Are there project CLI scripts or task-runner targets for the common jobs?
  *Check the manifest's scripts, the Makefile, the justfile, or this ecosystem's equivalent. The test: does routine work need a raw multi-flag command that someone has to remember?*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 32. Are those scripts named somewhere the agent will actually read them?
  *If no scripts exist, FAIL with a one-line proof pointing at the task-scripts item. Otherwise check the agent instruction file, the README, and whether the manifest itself is self-explanatory.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 33. Can an agent get this project running — is there a reproducible environment or a documented setup path?
  *Look for a pinned runtime (.nvmrc, .tool-versions, rust-toolchain), a lockfile, a container or nix file, and written setup steps. Try the first step if it is cheap and safe. This one bites hardest the moment work happens in a fresh git worktree or a new clone — the normal way to run agents in parallel. A new worktree has no installed dependencies, no `.env`, no build cache, so anything that works today only because of untracked state sitting on someone's machine simply does not run there. The test: would a bare checkout plus the written steps get this project up? Name any prerequisite nothing creates — an env file someone hand-made, a seeded database, a manual login — because each one is a wall a worktree hits on its first command.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 34. Can an agent see the results of a failed run — do the tools here produce output it can read and act on?
  *Judge from the runs you already did in Verification: does a failure print a path, a line, a name — something actionable — or a wall of noise? If nothing could be run, FAIL saying why.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

## 5. Safety

- [ ] 35. Are credentials kept out of the repo — nothing secret committed, ignore rules in place, an example env file for the shape?
  *Three checks: grep tracked files for key-shaped strings, read the ignore rules for env and key patterns, and look for an example env file. Report each of the three separately.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 36. Does anything scan for secrets automatically?
  *Look for gitleaks, trufflehog, detect-secrets or this ecosystem's equivalent, wherever it is wired in — a CI step, a pre-commit hook, or forge-level push protection visible from the repo. CI is where this normally lives, and that is a PASS; a local hook on top is better, because it catches the key before it is pushed rather than after, but its absence is a line in the proof, not a FAIL. Say where the scan runs. "Nothing secret exists today" does not make this N/A — the scan is for the day that changes.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 37. Are dependencies pinned, so a build is reproducible?
  *Look for lockfiles in every package of the repo, exact versions for load-bearing dependencies, a pinned runtime, and an install command that respects the lock (npm ci, not npm install).*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 38. Is anything watching those dependencies for known vulnerabilities?
  *Look for dependabot or renovate config, an audit step in CI, or this ecosystem's equivalent. Check every lockfile in the repo is covered, not just the root one.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 39. Are the review rules written down — who reads a change, and what they check?
  *Look for CONTRIBUTING, a PR template, or a review checklist in the agent instruction set. On a solo repo the "who" is N/A-shaped but the "what gets checked before it lands" still matters — judge that half.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 40. Are the operations that need a human named somewhere an agent will read them?
  *Look for a "never without asking" list in the agent instruction file or the README. Docs that hand out production commands with no fence around them count against, and the proof should quote one.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 41. Does every action that spends money, destroys data or changes production have a human in the way?
  *Start from the damage, not from the tooling: list what in reach of this repo could charge a card, drop or overwrite data, or alter what users are running. Then trace the shortest route an agent could take to each one — a push that auto-deploys, a script carrying live credentials, a migration that runs on merge, an infrastructure apply with no plan-and-approve step. PASS when every route meets a human first, whether that is a review, a manual trigger or a protected environment. FAIL when even one route runs start to finish unattended, and quote that route in the proof so the fix is obvious.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 42. If a prompt injection landed tonight, how far would it reach — are the credentials an agent can get to here scoped to the job, with nothing production-grade in reach?
  *Inventory what an agent in this repo can reach: env files, cloud CLI profiles, tokens named in docs or config, deploy commands that work from a laptop. Scoped-or-absent passes; production-grade reach fails with the item named.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 43. Can a change reach production a slice at a time — a feature flag that defaults to off, a canary, a staged rollout — rather than everyone at once?
  *Look for a flag system and check the default, or canary and staged-rollout config in the deploy pipeline. Flags that need a rebuild to flip are worth naming in the proof — they gate exposure but they are not a kill switch.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 44. Once a change is live, can anyone see what it is doing — logs, metrics, traces, alerts that fire on their own, and can an agent read them too?
  *Look for logging setup, an error tracker, analytics, alerting config — and then ask the second half: could an agent reach any of it (a CLI, an MCP server, an API named in the docs), or does observability stop at a dashboard behind a login?*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 45. Is there a way back — can a bad change be undone without a rebuild and a redeploy, including the ones that touched a database or a queue?
  *Look for a documented rollback path, a revert-and-redeploy story, down-migrations, or a flag that can turn the change off at runtime. Deployment docs that only say how to go forward are worth quoting.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 46. Does a past failure leave a check behind — is there a test or a rule in here that exists because something broke once?
  *Look for tests, lint rules or comments that name the incident they guard against — "regression", "this broke when", a linked issue. On a very young repo with no failures yet, N/A with the age as the reason.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

---

Learn more: **https://ainativesoftware.engineering/**
