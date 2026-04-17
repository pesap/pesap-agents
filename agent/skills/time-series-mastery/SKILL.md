---
name: time-series-mastery
description: Model and manage infrasys time series (creation, attachment, querying, slicing, deterministic forecasts, non-sequential data, and tagging). Use this skill when users need precise time-series handling in infrasys.
license: MIT
allowed-tools: Read Edit Grep Glob Bash Write
metadata:
  author: psanchez
  version: "1.0.0"
  category: infrastructure-systems
---

# Time Series Mastery

## Use when
- Creating/attaching/querying infrasys time series.
- Choosing between `SingleTimeSeries`, `Deterministic`, and `NonSequentialTimeSeries`.
- Managing feature/scenario tags and slicing strategies.

## Avoid when
- Task is not about infrasys time-series creation/query/attachment.
- User requests generic forecasting methods outside these infrasys types.

## Workflow
1. Select time-series type based on temporal structure and consumer needs.
2. Attach with consistent naming, units, and component scope.
3. Define query/slicing approach for target analyses.
4. Handle tagging/feature metadata explicitly.
5. Validate units, normalization assumptions, and retrieval behavior.

See [REFERENCE.md](./REFERENCE.md) for detailed APIs and examples.

## Output
- Recommended time-series type(s) and attachment strategy
- Query/slicing/feature-tagging approach
- Unit/normalization caveats and migration notes
- Validation checks and follow-up tasks
