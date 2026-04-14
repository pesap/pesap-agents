---
name: python-engineering
description: Implement production-grade Python with uv workflows, strict typing, Pydantic v2 patterns, and testable API design
license: MIT
allowed-tools: Read Edit Grep Glob Bash Write
metadata:
  author: psanchez
  version: "1.0.0"
  category: engineering
---

# Python Engineering

## When to Use
Use for Python implementation and refactor tasks where code quality, maintainability, and validation discipline matter.

## Instructions
1. Confirm repository conventions from `AGENTS.md`, `pyproject.toml`, and CI workflows.
2. Use `uv`-based environment and command flow.
3. Design typed interfaces first, then implement internals.
4. Prefer structured domain objects over ad-hoc dict contracts.
5. Add or update focused tests for behavior changes.

## Design Checklist
- Type hints on public and internal function signatures
- Minimal `Any`, prefer concrete protocols and unions
- Pydantic v2 idioms where models are used
- Structured return objects instead of tuple fan-out
- Subject-first function signatures with keyword-only config

## Validation Checklist
- Format/lint commands pass
- Type checks pass
- Targeted tests pass
- No dead parameters or unused helpers introduced
