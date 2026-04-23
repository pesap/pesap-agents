---
name: github
description: Use this skill when the user needs GitHub terminal workflows (PRs, issues, CI failures, workflow optimization, caching/artifacts, matrix builds, runner sizing), even if they don't explicitly mention GitHub Actions or gh CLI.
---

## Use when
- User asks to work with PRs/issues/runs from terminal.
- User asks to debug or optimize GitHub Actions workflows.
- User asks about cache, artifacts, matrix strategy, concurrency, or runner costs.

## Avoid when
- GitLab operations (use `gitlab` skill).
- Deep GitHub App/OAuth app implementation.
- Raw API workflows beyond practical `gh api` usage.

## Workflow
1. Confirm repo scope and desired outcome.
2. Gather evidence with `gh` commands.
3. Diagnose failure/bottleneck and propose minimal high-impact changes.
4. Validate via checks/reruns where possible.
5. Summarize evidence, decisions, and residual risks.

See [REFERENCE.md](./REFERENCE.md) for command recipes and CI optimization playbook.

## Output
- Command evidence (key `gh` output snippets)
- Findings and optimization recommendations
- Proposed/implemented workflow changes
- Validation status and follow-up actions
