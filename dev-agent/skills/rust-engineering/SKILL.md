---
name: rust-engineering
description: Implement production-grade Rust with explicit error handling, strong domain typing, and verification via fmt, clippy, and targeted tests
license: MIT
allowed-tools: Read Edit Grep Glob Bash Write
metadata:
  author: psanchez
  version: "1.0.0"
  category: engineering
---

# Rust Engineering

## When to Use
Use for Rust implementation or refactors where correctness, explicit error paths, and maintainability are required.

## Instructions
1. Read repository `AGENTS.md` and crate conventions first.
2. Prefer small, local changes with clear behavior deltas.
3. Use typed error paths instead of panic-oriented shortcuts.
4. Keep module boundaries explicit and domain types strong.
5. Validate with formatting, clippy, and targeted tests.

## Design Checklist
- No `unwrap` or panic-driven control flow in production paths
- `crate::` imports preferred over `super::`
- Shared state passed through explicit context structs
- Newtypes/enums used when domain is constrained
- Public API changes include doc updates where needed

## Validation Checklist
- `cargo fmt` clean
- `cargo clippy --all --benches --tests --examples --all-features` clean (or repo equivalent)
- Targeted `cargo test` commands pass
- No warnings introduced
