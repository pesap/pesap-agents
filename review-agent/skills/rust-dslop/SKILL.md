---
name: rust-dslop
description: Apply dslop cleanup and verification specifically for Rust repos with fmt, clippy, and targeted tests
license: MIT
allowed-tools: Read Bash Edit Write
metadata:
  author: pesap
  version: "1.0.0"
  category: developer-tools
---
# Rust dslop

## When to Use
Use when changed files are primarily Rust (`.rs`, `Cargo.toml`, workspace crates) and you need a pre-commit cleanup pass.

## Instructions
1. Confirm the task matches this skill and identify the concrete files, outputs, or decisions it should guide.
2. Apply the domain-specific guidance and checklists below, favoring the simplest sound approach.
3. Return concrete findings or edits with rationale, and include file references when applicable.

## Goals
- Preserve behavior, improve type clarity, and reduce complexity
- Remove dead code and needless abstraction layers
- Keep fixes narrow and idiomatic

## Verification Workflow
1. Prefer `just` targets if a `justfile` exists
2. Otherwise run canonical Rust checks:
   - `cargo fmt`
   - `cargo clippy --all --benches --tests --examples --all-features`
   - targeted `cargo test` for changed crates/modules

## Rust-specific dslop checks
- Remove unnecessary clones/allocations and pass-through wrappers
- Keep canonical domain types, avoid duplicate structs/enums for same concept
- Replace runtime defensive checks with stronger compile-time modeling where trust boundary is already validated
- Avoid panic paths (`unwrap`, `expect`) in non-test code
- Prefer `crate::` paths over `super::` for module imports

## Recommended Commands
- Targeted tests first:
  - `cargo test -p <crate> <test_name_or_module>`
- If edits are broad, run full crate test target

## Stop Rules
- Do not add global mutable state as a shortcut
- Do not widen scope into unrelated refactors
- Do not churn stable modules outside changed area just for style
