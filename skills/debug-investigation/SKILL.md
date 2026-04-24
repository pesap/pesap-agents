---
name: debug-investigation
description: Diagnose bugs from first principles by reproducing signals, ranking hypotheses, validating evidence, and converging on a durable root cause before proposing or applying fixes. Use this skill when users ask to debug failures, investigate flaky behavior, or explain why something broke.
---

## Use when
- User reports a bug, regression, flaky behavior, or unexpected output.
- You need root-cause analysis before coding a fix.
- The task requires evidence-backed diagnosis instead of guess-and-patch.

## Avoid when
- User asks for a pure feature implementation unrelated to failures.
- There is no reproducible signal and no observable evidence path.
- Scope is broad architecture redesign rather than concrete defect diagnosis.

## Instructions
1. Clarify and restate the failure.
   - Capture expected vs actual behavior and impact.
   - Confirm scope (environment, inputs, affected paths).
2. Collect evidence first.
   - Reproduce if possible, or gather logs/traces/tests/diffs.
   - Identify earliest trustworthy signal and likely change window.
3. Generate ranked hypotheses.
   - Prefer a small set of concrete hypotheses over many vague ones.
   - Rank by likelihood, blast radius, and testability.
4. Test hypotheses with targeted checks.
   - Run minimal experiments to falsify quickly.
   - Update ranking as evidence changes.
5. Converge on root cause.
   - Explain causality (trigger -> failure mechanism -> observable symptom).
   - Distinguish confirmed facts from assumptions.
6. Propose durable fix direction.
   - Prefer smallest root-cause fix over symptom masking.
   - Identify regression test(s) that prove the fix.
7. Validate and communicate confidence.
   - Run targeted validation for touched scope.
   - Report residual risk and what would increase confidence.

## Output
- Problem statement and reproduction status
- Ranked hypotheses and evidence trail
- Confirmed root cause (or best current candidate if unresolved)
- Proposed fix direction + regression test plan
- Validation commands/results and confidence level