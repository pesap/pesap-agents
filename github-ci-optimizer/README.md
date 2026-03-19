# github-ci-optimizer

Optimizes GitHub Actions CI pipelines for speed, resource efficiency, smart caching, and minimal artifact bloat.

## Run

```bash
npx @open-gitagent/gitagent run -r https://github.com/pesap/pesap-agents -d ./github-ci-optimizer
```

## What It Can Do

- **Workflow Optimization** — Parallelize jobs, reorder for fail-fast, right-size runners, add path filters and concurrency groups
- **Caching Strategy** — Design cache keys for dependencies, build outputs, and Docker layers to eliminate redundant work
- **Artifact Management** — Set retention policies, compress uploads, eliminate unused artifacts, reduce storage costs

## Structure

```
github-ci-optimizer/
├── agent.yaml
├── SOUL.md
├── RULES.md
├── AGENTS.md
├── skills/
│   ├── workflow-optimization/
│   │   └── SKILL.md
│   ├── caching-strategy/
│   │   └── SKILL.md
│   └── artifact-management/
│       └── SKILL.md
├── knowledge/
│   └── index.yaml
└── memory/
```

## Built with

[gitagent](https://github.com/open-gitagent/gitagent) — a git-native, framework-agnostic open standard for AI agents.
