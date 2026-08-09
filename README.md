# Skills

A collection of some of the [Claude](https://claude.com/claude-code) skills I use in my daily life. I add them here as they prove themselves useful enough to keep around.

## What's in here

| Skill | What it does |
| --- | --- |
| [write-without-slop](skills/write-without-slop/) | Rules to hold while composing prose, so the first draft doesn't read as AI-written. No reports, no scans — just the writing. |
| [remove-ai-slop](skills/remove-ai-slop/) | Detects AI-sounding passages in existing text, fixes them, and re-scans to verify. Comes with a pattern scanner and a fix playbook. |
| [node-cli-script](skills/node-cli-script/) | Writes Node.js CLI scripts and one-off automation with zero dependencies: `parseArgs`, `util.styleText`, and the rest of the built-in APIs. |
| [aine-readiness-analyzer](skills/aine-readiness-analyzer/) | Audits how ready a repo is for AI coding agents — 55 evidence-backed checks on agent instructions, specs, tests, CI gates, tooling and safety — and writes a full `AINE-REPORT.md` with fixes ranked by priority. |

The first two are counterparts: one prevents the problem, the other repairs it.

## Installing

The easiest way is the [`skills`](https://github.com/vercel-labs/skills) CLI, which works with Claude Code and most other agents:

```sh
# pick what you want, interactively
npx skills add alfonsograziano/skills

# or grab one directly
npx skills add alfonsograziano/skills --skill node-cli-script
```

You can also just copy (or symlink) a skill folder into your skills directory:

```sh
# available in every project
cp -R skills/write-without-slop ~/.claude/skills/

# or scoped to one project
cp -R skills/write-without-slop /path/to/project/.claude/skills/
```

Each skill is a self-contained folder with a `SKILL.md` and whatever references or scripts it needs, so nothing else has to be installed.

## License

[MIT](LICENSE)
