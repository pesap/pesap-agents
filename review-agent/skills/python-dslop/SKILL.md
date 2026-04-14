---
name: python-dslop
description: Apply dslop cleanup and verification specifically for Python repos using uv, pytest, and targeted lint/type checks
license: MIT
allowed-tools: Read Bash Edit Write
metadata:
  author: pesap
  version: "1.0.0"
  category: developer-tools
---
# Python dslop

## When to Use
Use when changed files are primarily Python (`.py`, `pyproject.toml`, `tests/`) and you need a narrow pre-commit cleanup pass.

## Instructions
1. Confirm the task matches this skill and identify the concrete files, outputs, or decisions it should guide.
2. Apply the domain-specific guidance and checklists below, favoring the simplest sound approach.
3. Return concrete findings or edits with rationale, and include file references when applicable.

## Goals
- Preserve behavior while tightening readability and type safety
- Remove dead code, placeholder text, and unnecessary indirection
- Keep fixes local to changed areas

## Verification Workflow
1. Prefer `just` targets if a `justfile` exists
2. Otherwise use `uv` commands from `pyproject.toml`
3. Run targeted checks first (changed modules/tests), then broader checks if needed

## Recommended Commands
- Targeted tests:
  - `uv run pytest <changed_test_or_module> -q`
- Targeted lint/type checks (when configured):
  - `uv run ruff check <changed_paths>`
  - `uv run mypy <changed_paths>`
- If no targeted command exists, run the project's documented default via `just` or `uv run`

## Python-specific dslop checks
- Remove duplicated validation inside trusted internal helpers
- Preserve canonical models/types (avoid ad-hoc dict shapes if typed model exists)
- Replace brittle setup code with fixtures in tests
- Keep function return shapes explicit and stable
- Remove unused imports, dead helpers, and stale comments

## Stop Rules
- Do not introduce new dependencies unless asked
- Do not widen scope into unrelated refactors
- Do not rewrite test architecture unless required for the current ticket
