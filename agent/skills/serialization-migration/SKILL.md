---
name: serialization-migration
description: Implement infrasys serialization and schema migration safely (to_json/from_json, __metadata__, versioning, legacy upgrades). Use this skill when users need compatibility-preserving data evolution.
license: MIT
allowed-tools: Read Edit Grep Glob Bash Write
metadata:
  author: psanchez
  version: "1.0.0"
  category: infrastructure-systems
---

# Serialization & Migration

## Use when
- Debugging infrasys deserialization or metadata/type-resolution issues.
- Adding/changing data format versions.
- Migrating legacy schemas while preserving compatibility.

## Avoid when
- Task does not involve infrasys serialization, deserialization, or schema evolution.
- User needs generic JSON handling unrelated to infrasys metadata/versioning.

## Workflow
1. Map current serialized shape and version boundaries.
2. Identify required metadata/type-resolution changes.
3. Implement migration path (forward-compatible where possible).
4. Validate round-trip integrity and legacy loading behavior.
5. Document rollout risks and fallback expectations.

See [REFERENCE.md](./REFERENCE.md) for full mechanics and examples.

## Output
- Serialization/migration strategy with version boundaries
- Required schema or metadata changes
- Backward-compatibility and rollout risks
- Validation steps for round-trip integrity
