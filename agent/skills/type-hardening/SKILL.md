---
name: type-hardening
description: Replace weak types (`any`, `unknown`, and language equivalents) with strong, evidence-backed domain types while preserving behavior. Use this skill when users ask for stricter typing, safer interfaces, or cleanup of weakly typed code.
---

## Use when
- User asks to remove/limit weak types.
- Typecheck debt blocks refactors or reliability.
- API boundaries need clearer contracts.

## Avoid when
- Task explicitly needs rapid prototyping with temporary weak types.
- Required domain information is missing and cannot be inferred safely.
- Type tightening would intentionally change external contracts without approval.

## Instructions
1. Inventory weak types in scope.
   - Locate `any`/`unknown`/equivalent weak annotations and implicit weak inference.
2. Infer strong replacements from evidence.
   - Use call sites, tests, schemas, docs, and related packages.
   - Prefer explicit domain models (TypedDict/dataclass/protocol/interface/type alias).
3. Harden boundaries first.
   - Keep unknown input at boundaries; validate/parse into strong internal types.
4. Apply incremental, low-risk changes.
   - Avoid massive type rewrites in one pass.
5. Validate thoroughly.
   - Run typecheck/lint/tests for touched scope.

## Output
- Weak-type inventory (before/after counts)
- Replacement mapping with evidence
- Files changed
- Validation commands + results
- Remaining weak types with reasons
