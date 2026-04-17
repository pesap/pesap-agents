---
name: cost-curves
description: Model production costs with FunctionData, ValueCurves, CostCurves, and FuelCurves in infrasys. Use this skill when users need curve design, conversion, or unit-safe validation.
license: MIT
allowed-tools: Read Edit Grep Glob Bash Write
metadata:
  author: psanchez
  version: "1.0.0"
  category: infrastructure-systems
---

# Cost Curves

## Use when
- Modeling production variable cost or fuel cost behavior.
- Converting between input-output, incremental, and average-rate forms.
- Validating curve shapes, monotonicity, and unit consistency.

## Avoid when
- Task does not involve production-cost or fuel-curve modeling.
- User needs generic numerical methods not tied to infrasys curve types.

## Workflow
1. Identify target curve representation and downstream consumer needs.
2. Pick appropriate `FunctionData` shape (linear/quadratic/piecewise).
3. Convert between curve types only when needed by interfaces.
4. Enforce validation rules (x ordering, segment shape, units).
5. Verify outputs on representative operating points.

See [REFERENCE.md](./REFERENCE.md) for full APIs and examples.

## Output
- Chosen curve representation and rationale
- Conversion steps between representations (if needed)
- Validation rules/units checks to enforce
- Edge cases and follow-up verification
