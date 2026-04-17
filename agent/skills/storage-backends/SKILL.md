---
name: storage-backends
description: Choose and configure infrasys time-series storage backends (Arrow, HDF5, In-Memory, Chronify) with conversion and performance trade-off guidance. Use this skill when users need backend selection or migration.
license: MIT
allowed-tools: Read Edit Grep Glob Bash Write
metadata:
  author: psanchez
  version: "1.0.0"
  category: infrastructure-systems
---

# Storage Backends

## Use when
- Selecting backend(s) for scale, query style, or deployment constraints.
- Converting between storage backends.
- Tuning for HPC/runtime performance trade-offs.

## Avoid when
- Task is unrelated to infrasys time-series storage selection or conversion.
- User needs storage advice outside this backend set.

## Workflow
1. Gather workload constraints (read/write pattern, memory, disk, query shape).
2. Choose backend using explicit trade-off criteria.
3. Configure storage and migration/conversion path.
4. Validate performance and serialization compatibility.
5. Document operational caveats.

See [REFERENCE.md](./REFERENCE.md) for backend matrix and detailed guidance.

## Output
- Recommended backend choice with trade-off summary
- Configuration and conversion steps
- Performance/cost implications
- Validation checklist for chosen backend
