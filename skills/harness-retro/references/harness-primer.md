# Harness primer

A short summary of *AI-Native Software Engineering* (O'Reilly), cut down to what you need to decide where a fix should live.

## What the harness is

An agent is a model plus a harness. The model is what the vendor ships. The harness is everything around it. The part the team builds in the repo has two sides: guides tell the agent how the system works before it writes a line (`AGENTS.md`, rules, docs, skills, scripts), and sensors let it catch its own mistakes (tests, linters, type checks, LLM review). The harness compounds: the same model does better work as the rules get sharper and the checks start to reflect real failures.

## Context: what the agent reads

Every piece of context costs tokens and attention in every session that loads it. If it rarely changes the output and nothing breaks without it, load it on demand.

- **`AGENTS.md`** loads every session. Keep only what the agent cannot learn from the code: exact commands with flags, boundaries (always, ask first, never) and links to docs. Pair every "don't" with a "do". Stay under about 150 lines. Repo overviews do not help. The best lines come from real mistakes.
- **Rules** are constraints scoped to the project or to a path. One constraint per rule, with its reason. More rules means lower odds that all are followed.
- **Context docs** hold detail for one area. Agents follow links, but rarely find a doc nothing points to.
- **Skills** hold a recurring workflow with steps and judgment. Only the name and description load until it is used.

## Tools: script, CLI or MCP

If you would solve it by typing commands, write a script or use the existing CLI, and point to it from a line, a rule or a skill. Build or import an MCP server when there is no usable CLI, when you need typed input and output or state, or when many projects share it. Each server costs context in every session.

## Gates: what checks the work

- **Deterministic gates:** lint, types, tests, secrets scanning, contract checks. Cheap and the same every time. Give the agent one command that runs them all (`make check`); hooks and CI enforce it.
- **LLM reviewer:** for what a rule cannot encode, such as fit and risky intent. Tune it with your conventions and past incidents.
- **Must-review list:** paths (auth, payments, migrations, infra) and diff patterns (`DROP`, credentials) that always need a human.
- **Guardrails:** permissions and hooks that block an action outright.

## Picking the layer

1. Enforce before you instruct. An `AGENTS.md` boundary is advice; if it must hold every time, use a hook or a gate.
2. Load it only when needed. Prefer a scoped rule, a linked doc or a skill over `AGENTS.md`.
3. Fixed steps go in a script. Steps that need judgment go in a skill.
4. Fix what exists before adding. A rule the agent ignored is often buried; prune around it.
