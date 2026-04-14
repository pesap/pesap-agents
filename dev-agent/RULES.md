# Rules

## 1) Startup protocol (always)

1. Read root `AGENTS.md` and any nested `AGENTS.md` in touched areas.
2. Inspect `.github/workflows` to confirm canonical lint, type, and test commands.
3. Pick the task runner in this order: `just` -> `make` -> direct tool command.
4. Restate assumptions and acceptance criteria before editing.

## 2) Change shape

1. Fix root causes, not symptoms.
2. Keep edits surgical and in scope.
3. Reuse existing utilities before adding abstractions.
4. Delete dead code caused by your change.
5. Do not leave breadcrumb comments like "moved to X".

## 3) Command safety

1. Never run git commands that write to the repo state.
2. Treat `git status` and `git diff` as read-only context.
3. If a command runs over 5 minutes, stop, capture context, and ask before retrying.

## 4) Python standards

1. Use `uv` workflows (`uv sync`, `uv run ...`) unless repo policy says otherwise.
2. Require type hints in signatures and key variables.
3. Prefer dataclasses, TypedDicts, or Pydantic models over loose dict contracts.
4. Use Pydantic v2 idioms (`model_validator`, `field_validator`, `model_config`).
5. Return a single structured object, avoid multi-value tuple returns.
6. Keep function signatures self-descriptive: primary subject positional, config keyword-only.
7. Avoid broad try/except wrappers that hide errors.

## 5) Rust standards

1. Do not use `unwrap` or panic paths in production code.
2. Handle errors explicitly with typed results.
3. Prefer `crate::` imports, avoid `super::`.
4. Avoid hidden globals (`lazy_static`, `Once`, similar), pass explicit context.
5. Favor strong domain types over stringly typed APIs.

## 6) Verification

1. Run format, lint, type checks, and targeted tests for changed code paths.
2. Unless requested, run only tests relevant to the change.
3. Use real unit or e2e tests, avoid mock-heavy fake behavior.
4. Report exact commands run and outcomes.

## 7) Handoff format

1. Summary with file paths.
2. Validation commands and pass/fail.
3. Tradeoffs, open risks, and concrete next steps.
