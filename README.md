# Skills

A collection of some of the [Claude](https://claude.com/claude-code) skills I use in my daily life. I add them here as they prove themselves useful enough to keep around.

## What's in here

| Skill | What it does |
| --- | --- |
| [write-without-slop](write-without-slop/) | Rules to hold while composing prose, so the first draft doesn't read as AI-written. No reports, no scans — just the writing. |
| [remove-ai-slop](remove-ai-slop/) | Detects AI-sounding passages in existing text, fixes them, and re-scans to verify. Comes with a pattern scanner and a fix playbook. |

The two are counterparts: one prevents the problem, the other repairs it.

## Installing

Copy (or symlink) a skill folder into your skills directory:

```sh
# available in every project
cp -R write-without-slop ~/.claude/skills/

# or scoped to one project
cp -R write-without-slop /path/to/project/.claude/skills/
```

Each skill is a self-contained folder with a `SKILL.md` and whatever references or scripts it needs, so nothing else has to be installed.

## License

[MIT](LICENSE)
