---
name: deslop-pass
description: Run a 3-vector parallel review-readiness pass, synthesize findings, and apply only the highest-value in-scope fixes before commit
license: MIT
allowed-tools: Read Bash Edit Write Subagent
metadata:
  author: pesap
  version: "1.0.0"
  category: developer-tools
---
# Deslop Pass

## When to Use
Use when implementation is functionally done and you want a final pre-commit quality pass that removes avoidable slop without widening scope.

## Instructions
1. Confirm the task matches this skill and identify the concrete files, outputs, or decisions it should guide.
2. Apply the domain-specific guidance and checklists below, favoring the simplest sound approach.
3. Return concrete findings or edits with rationale, and include file references when applicable.

## Required 3 Review Vectors (Parallel)
Launch exactly these 3 vectors in parallel with the same context bundle:

1. **Rules and docs conformance**
   - AGENTS.md / nested AGENTS.md compliance
   - design docs and ownership boundary alignment
2. **Type safety and source of truth**
   - canonical type preservation, no widening, no duplicate type systems
   - compile-time guarantees over runtime defensive checks in trusted internals
3. **Overengineering and simplification**
   - remove wrappers/abstractions/indirection with weak payoff
   - detect dead code and needless complexity

## Required Context Bundle
Collect and pass exact paths:
- root `AGENTS.md`
- nested `AGENTS.md` in changed areas
- `docs/index.md`
- `docs/PLANS.md`
- `docs/design-docs/index.md`
- `docs/design-docs/core-beliefs.md`
- relevant design docs for changed code
- active exec plan for current work (if present)
- changed files with nearby context

If an exec plan exists, inspect `docs/exec-plans/active/` and direct reviewers to study the matching plan before reviewing.

## Protocol
1. Read context bundle first
2. Spawn 3 parallel reviewers immediately
3. While they run, start focused local verification:
   - if available, run `pnpm -w lint:slop:delta`
   - for Python-heavy diffs, apply `python-dslop` checks
   - for Rust-heavy diffs, apply `rust-dslop` checks
4. Wait for all reviewers
5. Synthesize findings into one balanced report with these exact headings:
   - How did we do?
   - Feedback to keep
   - Feedback to ignore
   - Plan of attack
6. Apply narrow, high-confidence fixes in current implementation flow
7. Update workpad/commit/PR framing to post-dslop state

## Apply/Ignore Policy
Apply now:
- clear type drift and trust-boundary violations
- dead helpers/debug leftovers/placeholder artifacts
- unnecessary local indirection that can be safely removed

Ignore (but document):
- speculative feedback
- conflicting reviewer advice without clear evidence
- suggestions that widen scope beyond ticket intent

## Guardrails
- Preserve behavior
- Keep diff small and readable
- Prefer balanced synthesis over any one reviewer's strongest opinion
