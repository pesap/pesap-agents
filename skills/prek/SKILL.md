---
name: prek
description: Use this skill when working with Git hooks, pre-commit automation, or CI lint pipelines using `prek` (Rust drop-in replacement for pre-commit). Apply when users ask to speed up hooks, migrate from `pre-commit`, debug hook execution, configure skip/include behavior, or wire hook checks into CI, even if they say "pre-commit" instead of "prek".
---

## Use when
- User asks to run/fix/update pre-commit style hooks.
- User wants faster hook execution in CI or local dev.
- User asks to migrate from `pre-commit` to `prek`.
- User asks about skipping hooks (`SKIP=...`) or selecting hooks.
- User asks about hook install/uninstall behavior in git repos/worktrees.

## Avoid when
- Task is unrelated to hooks/lint/format automation.
- User asks for one-off lint/test commands without hook orchestration.
- Project does not use `prek` or `pre-commit` configs.

## Defaults
- Prefer `prek run --all-files` in CI over `pre-commit run --all-files`.
- Keep hook definitions in existing `.pre-commit-config.yaml` unless migration requested.
- Use `SKIP=hook1,hook2` for temporary CI partitioning.

## Quick reference
```bash
# Install git hooks
prek install -f --install-hooks

# Run all hooks
prek run --all-files

# Run one hook
prek run ruff-check --all-files

# Skip specific hooks for one run
SKIP=julia-format,julia-lint prek run --all-files

# Update hook revisions
prek auto-update

# Validate updates in CI without rewriting files
prek auto-update --check
```

## CI guidance
- Keep hook pipeline simple: install deps once, then run `prek`.
- Split language-heavy hooks into dedicated jobs with path-based rules.
- Avoid duplicate hook execution across parallel jobs.
- Prefer read-mostly caches and a single writer job.
