# AI-Native Readiness Report

**Repo:** _(fill in)_
**Date:** _(fill in)_
**Stack:** _(fill in — language, framework, build system, as you actually found them)_

**Result:** _(fill in at the end: N passed, N failed, N not applicable — the three numbers must sum to 55)_

---

**How to read this.** Every item is a numbered question about this repo, answered from evidence in this repo. `Proof` is what was actually found — a path, a file, a command and its output. An item with no proof is not an answer. The italic line under each question says how to check it; it stays in the report so the next run checks the same way.

**FAIL vs N/A.** `FAIL` means the practice would help here and it is missing — including when a whole artifact is missing, so several questions about it fail together with a one-line proof pointing at the item that found it missing. `N/A` means the question could never apply to a project of this kind, and the proof says why. "It does not exist" is a FAIL, never an N/A.

`Priority` is fixed by the template, not by the person filling it in. **High** means an agent working here will hit this on day one, or the risk is real. **Low** means it makes things better but nothing breaks without it.

---

## 1. Context

- [ ] 1. Does an agent instruction file exist (AGENTS.md, CLAUDE.md, .cursorrules, .github/copilot-instructions.md, or this ecosystem's equivalent)?
  *Look for a file whose purpose is to be loaded into a coding agent's context at the start of every session. A README is not one, however good — it gets its credit at items 12 and 13. Vendored skill libraries are not instructions either.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 2. Does the agent instruction file name the commands to build, test and check this project?
  *Answer this about the file found at item 1 and no other file. If no agent instruction file exists, the status is FAIL with a one-line proof pointing at item 1 — never answer this against the README or any substitute, because the question measures what loads into an agent's context without the agent being told where to look.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 3. Does everything the agent instruction file names still exist — the commands, the paths, the libraries it points at?
  *If no agent instruction file exists, FAIL with a one-line proof pointing at item 1. Otherwise verify, do not trust: check every named command against the manifest or build file, spot-check the paths, and run the cheap read-only commands.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 4. Is the agent instruction file specific to this repo, rather than advice that would read the same in any codebase?
  *If no agent instruction file exists, FAIL with a one-line proof pointing at item 1. The test: could this file be pasted into another project unchanged? "Write clean code" and "add tests for new features" would fit anywhere and count for nothing.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 5. Does the agent instruction file explain where things live and how this project is laid out?
  *If no agent instruction file exists, FAIL with a one-line proof pointing at item 1. Judge coverage against the real tree, not against what the file mentions: if it maps one package well but is silent about sibling packages or directories an agent would land in, that is a FAIL with the omission named.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 6. Are the constraints that never show up in the code written down somewhere an agent reads — uptime or latency targets, compliance and privacy rules, compatibility promises to other teams, cost limits?
  *Check the agent instruction file first, then the README and docs. If the project genuinely has no such constraints — a static personal site has no SLA and no compliance surface — that is N/A with the reasoning, not a FAIL.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 7. Does the agent instruction file say when the agent must stop and ask a human instead of deciding for itself?
  *If no agent instruction file exists, FAIL with a one-line proof pointing at item 1. Look for an explicit "never without asking" list: deploys, migrations, spending money, force pushes, touching vendored code.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 8. Does the agent instruction file state the rules that are not obvious from the code — the things never to do here?
  *If no agent instruction file exists, FAIL with a one-line proof pointing at item 1. These are the tribal-knowledge traps: the flag that must be exactly this string, the import that breaks the build, the directory that is generated and must not be edited.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 9. Has the agent instruction file been updated recently enough to still be true, given how active the repo is?
  *If no agent instruction file exists, FAIL with a one-line proof pointing at item 1. Compare the last commit touching the file against the repo's tempo, then spot-check two or three of its claims against the code — a recently touched file can still lie.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 10. Is the agent instruction file small enough to load into every session without crowding out the actual task?
  *If no agent instruction file exists, FAIL with a one-line proof pointing at item 1. Measure it: `wc -c`, and bytes divided by four is a fair token estimate. Under ~5k tokens is comfortable; past ~10k it is eating the context window.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 11. Can a fresh session pick up a half-finished task — is there a file or convention where progress, decisions and what is left get written down?
  *This is not about the agent instruction file. Look for a TODO.md, a plans or notes directory, task files, or linked issues that record in-flight state. Git history alone does not count — it records what happened, not what was decided or what remains.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 12. Is there a README that says what this project is and how to run it?
  *This is where a good README earns its credit. It needs three things: what the project is, how to run it, and how to check a change. Judge what is on the page, not the file's existence.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 13. Are the architecture and the decisions behind it written down in the repo?
  *Any durable form counts — an ADR directory, design docs, or a README that records not just what but why. Judge substance: "we use X because Y" is a decision; a list of technologies is not.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

## 2. Specs

- [ ] 14. Is there a specs, RFC, proposals, design-doc or ADR directory?
  *Look for the directory and for the convention: `specs/`, `docs/adr/`, `rfcs/`, `proposals/`, `.specify/`, or this ecosystem's equivalent. An essay about specs is not a spec.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 15. Does the specs directory hold recent entries, or is it an archive nobody has touched?
  *If no specs directory exists, FAIL with a one-line proof pointing at item 14. Otherwise compare the newest entry's date against the repo's recent activity.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 16. Is there a spec template, or an SDD framework, so every spec comes out the same shape?
  *Scaffolding can exist even where item 14 failed — look for a TEMPLATE.md, a `.specify/` directory, or framework config. If neither a directory nor any scaffolding exists, FAIL.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 17. Do the specs state acceptance criteria a machine could check?
  *If no specs exist, FAIL with a one-line proof pointing at item 14. Otherwise open the two newest specs and quote a criterion: "the endpoint returns 403 for expired tokens" is checkable; "the feature works well" is not.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 18. Open the newest spec: do its criteria go past the happy path — what happens when a step fails, and how the change gets undone?
  *If no specs exist, FAIL with a one-line proof pointing at item 14. Look for error cases, edge inputs, and a rollback or undo story, not just the success flow.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 19. Do the specs state non-goals, so an agent knows where to stop?
  *If no specs exist, FAIL with a one-line proof pointing at item 14. Non-goals written elsewhere (a README's "what this is not" list) are worth naming in the proof, but they do not turn this into a PASS — the question is whether specs carry them.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 20. Do the specs describe intent and constraints, rather than restating an implementation that already exists?
  *If no specs exist, FAIL with a one-line proof pointing at item 14. A spec written after the code that just narrates the code is documentation wearing a spec's name.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 21. Can recent shipped work be traced back to a spec?
  *If no specs exist, FAIL with a one-line proof pointing at item 14. Otherwise take the last few substantial commits or PRs and look for a reference to a spec, an issue, or a design doc in the message or description.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

## 3. Verification

- [ ] 22. Does this project have an automated test suite, in whatever form this ecosystem uses?
  *Work out this ecosystem's convention before concluding anything is missing — check the manifest, the build file, the CI config, the README. A shell script that diffs output files is a test suite. If you find one, run it and record the result.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 23. Can the test command be discovered without guessing — is it written down where an agent reads?
  *If no test suite exists, FAIL with a one-line proof pointing at item 22. Otherwise check the places an agent looks: the agent instruction file, the README, the manifest's scripts or targets.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 24. Do the tests assert real behaviour, rather than asserting that a mock was called?
  *If no test suite exists, FAIL with a one-line proof pointing at item 22. Otherwise open the largest test files and read the assertions: calling real code on real inputs passes; `expect(mock).toHaveBeenCalled()` as the main dish fails.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 25. Do the tests cover the parts of this codebase where a wrong change would do the most damage?
  *If no test suite exists, FAIL with a one-line proof pointing at item 22. Otherwise first name the high-damage areas yourself from reading the repo — money paths, data writes, the things the README warns about — then check each one for a test. Name what is covered and what is not.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 26. Is there a linter or static analysis configured for this language, and does it pass on a clean checkout?
  *Configured is not enough — run it. A linter that exits non-zero on an untouched checkout is a FAIL with the error count in the proof, because an agent cannot tell its own damage from the baseline noise.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 27. Is there a formatter, so an agent's diffs do not churn on style?
  *Look for the config file and the dependency in this ecosystem's form — .prettierrc, rustfmt, gofmt, black, an .editorconfig doing real work. If the language ships one formatting standard with the toolchain, that is a PASS and the proof says so.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 28. Is there a compile-time or type-level gate, if this language offers one?
  *N/A only when the language genuinely has no such gate. If the language offers one and the repo does not use it — no strict mode, no typecheck script, no compiler step — that is a FAIL. Run the gate if it exists and record the result.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 29. Can an agent prove its own work before it pushes — one command, task-runner target or commit hook that runs every check this project has?
  *One command, not a list to remember: a `check` or `verify` target, a `precommit` script, a Makefile target that chains them. Separate commands documented side by side are close but FAIL — the question is whether the agent can run the whole gauntlet without knowing its parts.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 30. Is there continuous integration, and does it run before a change lands rather than after?
  *A deploy pipeline that runs on push to the default branch runs after the change has landed — that is a FAIL with the trigger quoted, not a PASS with a caveat. Look for a pre-merge trigger: pull_request events, merge trains, or this forge's equivalent.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 31. Does CI actually run the tests and the checks that exist in this repo?
  *If no pipeline of any kind exists, FAIL with a one-line proof pointing at item 30. Otherwise list what the pipeline runs and diff it against every check found in items 22–28 — name each check that exists in the repo but is missing from the pipeline.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 32. Can those checks stop a merge, or can a red build be waved through?
  *If no CI exists, FAIL with a one-line proof pointing at item 30. Branch protection often lives outside the repo, so judge from what is visible — required-check config, merge queue files — and say plainly when the repo alone cannot prove it.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 33. Is there anything that runs the checks locally before a commit or a push?
  *Look for husky, lefthook, pre-commit, simple-git-hooks, a `prepare` script, or a documented hook setup. If the full check suite is fast, say so in the proof — it removes the usual excuse.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 34. Does anything here get an LLM to read a change and go looking for problems — a review skill, a saved review prompt, or an AI reviewer on the pull requests?
  *Look for a committed review skill or slash command, a CI step calling an AI reviewer, or bot config. Human review rules are item 47 — this one is specifically about machine review.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

## 4. Tooling

- [ ] 35. Are MCP servers configured and committed to the repo, rather than set up per laptop?
  *Look for a committed .mcp.json or this ecosystem's equivalent. Nothing configured anywhere is a FAIL; configured but gitignored is also a FAIL, with the distinction in the proof.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 36. Is there a skills, commands or reusable-prompt library in the repo?
  *Look for .claude/skills, .agents/skills, .claude/commands, or a prompts directory. Committed and pinned beats committed; note whether anything ties the copies to a source.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 37. Do the skills and servers that exist cover the work this team plainly repeats?
  *First identify the repeated work from the README and the commit history. If skills or servers exist but miss it, FAIL naming the gap. If none exist at all and the repo plainly repeats work, FAIL pointing at items 35–36. If the project is too small to repeat anything, N/A.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 38. Are there project CLI scripts or task-runner targets for the common jobs?
  *Check the manifest's scripts, the Makefile, the justfile, or this ecosystem's equivalent. The test: does routine work need a raw multi-flag command that someone has to remember?*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 39. Are those scripts named somewhere the agent will actually read them?
  *If no scripts exist, FAIL with a one-line proof pointing at item 38. Otherwise check the agent instruction file, the README, and whether the manifest itself is self-explanatory.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 40. Can an agent get this project running — is there a reproducible environment or a documented setup path?
  *Look for a pinned runtime (.nvmrc, .tool-versions, rust-toolchain), a lockfile, a container or nix file, and written setup steps. Try the first step if it is cheap and safe.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 41. Is the agent configuration itself committed, so two engineers get the same behaviour?
  *Look for committed settings — .claude/settings.json, permission allowlists, pinned skill locks. Per-machine setup that is not in the repo means every session starts different, and that is a FAIL.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 42. Can an agent see the results of a failed run — do the tools here produce output it can read and act on?
  *Judge from the runs you already did for items 22–28: does a failure print a path, a line, a name — something actionable — or a wall of noise? If nothing could be run, FAIL saying why.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

## 5. Safety

- [ ] 43. Are credentials kept out of the repo — nothing secret committed, ignore rules in place, an example env file for the shape?
  *Three checks: grep tracked files for key-shaped strings, read the ignore rules for env and key patterns, and look for an example env file. Report each of the three separately.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 44. Does anything scan automatically for secrets before code leaves the machine?
  *Look for gitleaks or trufflehog config, a pre-commit hook, a CI step, or forge-level push protection visible from the repo. "Nothing secret exists today" does not make this N/A — the scan is for the day that changes.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 45. Are dependencies pinned, so a build is reproducible?
  *Look for lockfiles in every package of the repo, exact versions for load-bearing dependencies, a pinned runtime, and an install command that respects the lock (npm ci, not npm install).*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 46. Is anything watching those dependencies for known vulnerabilities?
  *Look for dependabot or renovate config, an audit step in CI, or this ecosystem's equivalent. Check every lockfile in the repo is covered, not just the root one.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 47. Are the review rules written down — who reads a change, and what they check?
  *Look for CONTRIBUTING, CODEOWNERS, a PR template, or a checklist in the agent instruction file. On a solo repo the "who" is N/A-shaped but the "what gets checked before it lands" still matters — judge that half.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 48. Are the operations that need a human named somewhere an agent will read them?
  *Look for a "never without asking" list in the agent instruction file or the README. Docs that hand out production commands with no fence around them count against, and the proof should quote one.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 49. Are the dangerous paths — money, auth, migrations, infrastructure, the CI config itself — covered by a rule that forces a human to read the change?
  *Look for CODEOWNERS entries on those paths, branch protection evidence, or path-based review rules. First name which dangerous paths this repo actually has; if it genuinely has none, N/A with the reasoning.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 50. Could an agent do something expensive and irreversible here without a human seeing it first?
  *Polarity is inverted: PASS means no, it could not. Trace the shortest path from a local action to production, money, or data loss — a push that auto-deploys, a script with live credentials — and quote it if one exists, which is a FAIL.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 51. If a prompt injection landed tonight, how far would it reach — are the credentials an agent can get to here scoped to the job, with nothing production-grade in reach?
  *Inventory what an agent in this repo can reach: env files, cloud CLI profiles, tokens named in docs or config, deploy commands that work from a laptop. Scoped-or-absent passes; production-grade reach fails with the item named.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 52. Can a change reach production a slice at a time — a feature flag that defaults to off, a canary, a staged rollout — rather than everyone at once?
  *Look for a flag system and check the default, or canary and staged-rollout config in the deploy pipeline. Flags that need a rebuild to flip are worth naming in the proof — they gate exposure but they are not a kill switch.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: High

- [ ] 53. Once a change is live, can anyone see what it is doing — logs, metrics, traces, alerts that fire on their own, and can an agent read them too?
  *Look for logging setup, an error tracker, analytics, alerting config — and then ask the second half: could an agent reach any of it (a CLI, an MCP server, an API named in the docs), or does observability stop at a dashboard behind a login?*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 54. Is there a way back — can a bad change be undone without a rebuild and a redeploy, including the ones that touched a database or a queue?
  *Look for a documented rollback path, a revert-and-redeploy story, down-migrations, or a flag that can turn the change off at runtime. Deployment docs that only say how to go forward are worth quoting.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

- [ ] 55. Does a past failure leave a check behind — is there a test or a rule in here that exists because something broke once?
  *Look for tests, lint rules or comments that name the incident they guard against — "regression", "this broke when", a linked issue. On a very young repo with no failures yet, N/A with the age as the reason.*
  - Status:
  - Proof:
  - Recommendation:
  - Priority: Low

---

Learn more: **https://ainativesoftware.engineering/**
