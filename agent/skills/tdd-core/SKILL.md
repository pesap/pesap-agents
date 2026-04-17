---
name: tdd-core
description: Apply language-agnostic test-driven development with strict red-green-refactor cycles, behavior-focused tests, and safe refactoring. Use when users ask for TDD, test-first implementation, or disciplined bugfix/feature delivery in any language.
---

## Use when
- User asks for TDD or test-first development.
- User wants safer feature work or bug fixes with incremental validation.
- User mentions red/green/refactor, tracer bullets, or behavior-first testing.
- Project language is C, Rust, Python, or mixed.

## Avoid when
- User explicitly rejects test-first workflow.
- Task is docs-only or unrelated to code behavior.
- Existing project constraints make tests impossible (state clearly and use best-effort checks).

## Quick loop
1. Define one observable behavior through a public interface.
2. **RED**: write one failing test.
3. **GREEN**: write minimum code to pass.
4. **REFACTOR**: improve design while staying green.
5. Repeat one behavior at a time.

## Guardrails
- Test behavior, not implementation details.
- Prefer vertical slices; avoid horizontal slicing.
- Mock only at system boundaries.
- Keep tests deterministic and isolated.
- Never refactor while RED.

## Planning checklist
- Confirm target interface and highest-value behaviors.
- Pick one tracer-bullet path first.
- Define boundary fakes/mocks needed (if any).
- Agree on minimum validation commands per cycle.

## Language overlays
- Python: pair with `testing-pytest`.
- Rust: pair with rust checks (`cargo test`, clippy, fmt).
- C: pair with project test runner and sanitizer/static-analysis checks.

See [REFERENCE.md](REFERENCE.md) for anti-patterns, mock policy, and refactor cues.

## Output
- Behavior plan (ordered)
- Cycle log (RED/GREEN/REFACTOR per behavior)
- Tests/code changed
- Validation commands + results
- Risks/gaps + next cycle
