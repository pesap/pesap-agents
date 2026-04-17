---
name: infrasys-integration
description: Build infrastructure system models with infrasys System/Component patterns, time series attachment, and serialization-ready structure. Use this skill when users are implementing or integrating infrasys-based models.
license: MIT
allowed-tools: Read Edit Grep Glob Bash Write
metadata:
  author: psanchez
  version: "1.0.0"
  category: data-engineering
---

# infrasys Integration

## Use when
- Building or extending infrasys `System` + `Component` models.
- Attaching/querying time series on components.
- Preparing systems for reproducible serialization and interchange.

## Avoid when
- Scope is not using infrasys `System`/`Component` patterns.
- User asks for general architecture advice without infrasys constraints.

## Workflow
1. Define component schema and ownership boundaries.
2. Add components to `System` with consistent naming/labels.
3. Attach time series via supported APIs, not ad-hoc embedded arrays.
4. Validate model constraints and Pydantic schema behavior.
5. Confirm round-trip serialization expectations.

See [REFERENCE.md](./REFERENCE.md) for detailed examples and caveats.

## Output
- Suggested infrasys modeling approach for the target scope
- Component/system/time-series patterns to implement
- Validation and serialization guidance
- Risks and migration notes
