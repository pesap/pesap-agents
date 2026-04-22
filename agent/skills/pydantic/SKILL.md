---
name: pydantic
description: Design, debug, and migrate Pydantic models with strict validation, clear schemas, and safe serialization. Use when users ask about BaseModel fields, validators, model config, parsing errors, schema generation, or Pydantic v1→v2 migration.
---

## Use when
- Designing or refactoring `BaseModel` / `RootModel` types.
- Fixing validation errors or coercion surprises.
- Adding `field_validator` / `model_validator` / computed fields.
- Defining serialization (`model_dump`, `field_serializer`) or JSON schema behavior.
- Migrating Pydantic v1 code to v2 APIs.

## Avoid when
- Task is not model/validation/schema related.
- User wants framework-specific patterns not tied to Pydantic behavior.
- Data contracts are undefined and need product/domain decisions first.

## Workflow
1. Confirm Pydantic version and failing behavior (or target behavior).
2. Reproduce with minimal model + payload.
3. Apply smallest fix:
   - model fields/types/defaults
   - validators/config
   - serialization/schema settings
4. Add focused tests for success + failure path.
5. Check compatibility impact (API payloads, stored JSON, migration notes).

## Guardrails
- Prefer explicit types over permissive `Any`.
- Do not hide validation failures unless user requests coercion.
- Keep validators deterministic and side-effect free.
- For migrations, map old API names to v2 equivalents explicitly.

## Output
- Root cause (or design goal)
- Minimal model changes
- Test evidence (including failing case turned passing)
- Migration/compatibility notes and risks
