---
name: dependency-untangler
description: Break circular dependencies with minimal structural change and explicit dependency direction. Use this skill when users ask to fix import cycles, untangle module architecture, run madge/import graph tooling, or clean layering violations.
---

## Use when
- User asks to detect/fix circular dependencies.
- Import graph tools report cycles.
- Refactors are blocked by layering violations.

## Avoid when
- Task is unrelated to module dependency structure.
- Large architectural redesign is requested without scope/approval.
- Cycles are generated from build/tool artifacts rather than source modules.

## Instructions
1. Map cycles first.
   - Use dependency graph tooling (e.g., madge or language equivalent).
   - Group findings by strongly connected component and risk.
2. Choose smallest safe cut.
   - Prefer dependency inversion, boundary extraction, or file-local reorganization.
   - Avoid broad file moves unless required.
3. Preserve behavior and public API.
   - Refactor imports/ownership, not product semantics.
4. Prevent regressions.
   - Add/update lightweight checks for cycle detection if available.
5. Validate.
   - Run lint/typecheck/tests in affected modules.

## Output
- Cycle report (before/after)
- Refactor plan + rationale for chosen cut points
- Files changed
- Validation commands + results
- Remaining cycles or waivers
