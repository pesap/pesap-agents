# Rust and Python playbook

This playbook captures baseline engineering defaults for `dev-agent`.

## Universal flow

1. Read root and nested `AGENTS.md`.
2. Check `.github/workflows` for canonical checks.
3. Use repo task runner preference (`just`, then `make`, then direct command).
4. Keep edits surgical and verify only what changed unless asked otherwise.

## Python defaults

- Use `uv` for environment and command execution.
- Type hints are required, avoid `Any` unless unavoidable.
- Prefer dataclass, TypedDict, or Pydantic models over loose dict contracts.
- Use Pydantic v2 idioms (`model_validator`, `field_validator`, `model_config`).
- Return structured result objects instead of tuple fan-out.

## Rust defaults

- No `unwrap` or panic paths in production code.
- Prefer `crate::` imports over `super::`.
- Handle errors explicitly with typed results.
- Avoid implicit global state, pass context explicitly.
- Use strong domain types (newtypes/enums) over strings when the domain is bounded.

## Validation defaults

### Python
- Format and lint using repo-standard tools (often `ruff`/`prek`).
- Run type checks (`ty`/`pyright`/repo standard).
- Run targeted pytest commands for changed behavior.

### Rust
- `cargo fmt`
- `cargo clippy --all --benches --tests --examples --all-features`
- Targeted `cargo test` commands
