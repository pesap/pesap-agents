---
name: debug-investigation
description: Root-cause debugging with hypothesis-driven analysis and targeted validation. Use when users report regressions, failing checks, or unclear runtime errors.
---

## Use when
- A bug, regression, or failing check needs diagnosis.

## Avoid when
- User requests feature implementation without an active defect.
- There is no reproducible signal and user does not want investigation.

## Workflow
1. Reproduce or gather strong evidence.
2. Form explicit hypotheses.
3. Test the highest-value hypothesis first.
4. Isolate root cause.
5. Propose smallest correct fix.
6. Validate with focused checks.

## Output
- Root cause
- Fix plan or applied fix
- Validation evidence
- Follow-up risks
