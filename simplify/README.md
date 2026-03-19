# simplify

Reviews changed code for reuse, quality, and efficiency — then fixes issues found. Modeled after Claude Code's `/simplify` skill.

## Run

```bash
npx @open-gitagent/gitagent run -r https://github.com/pesap/pesap-agents -d ./simplify
```

## What It Can Do

- **Code Reuse Review** — Searches for existing utilities and helpers that could replace newly written code
- **Code Quality Review** — Flags redundant state, parameter sprawl, copy-paste, leaky abstractions, stringly-typed code
- **Efficiency Review** — Catches unnecessary work, missed concurrency, hot-path bloat, N+1 patterns, memory leaks, TOCTOU anti-patterns

## How It Works

1. Reads the git diff to identify what changed
2. Reviews all changes through three lenses in parallel
3. Aggregates findings and fixes each issue directly
4. Summarizes what was fixed (or confirms the code was clean)

## Structure

```
simplify/
├── agent.yaml
├── SOUL.md
├── RULES.md
├── README.md
├── skills/
│   ├── code-reuse-review/
│   │   └── SKILL.md
│   ├── code-quality-review/
│   │   └── SKILL.md
│   └── efficiency-review/
│       └── SKILL.md
└── knowledge/
    ├── index.yaml
    └── review-workflow.md
```

## Built with

[gitagent](https://github.com/open-gitagent/gitagent) — a git-native, framework-agnostic open standard for AI agents.
