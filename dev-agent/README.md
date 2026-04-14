# dev-agent

Implementation-focused agent for Python and Rust codebases.

## What it is best for

- Shipping scoped features and bug fixes
- Refactoring for clarity without widening scope
- Python quality work (typing, Pydantic v2, validation)
- Rust quality work (error handling, strong types, safe defaults)
- Converting plans into verifiable code changes

## Language posture

### Python
- `uv` first workflows
- Typed APIs and structured return objects
- Pydantic v2 patterns and explicit validation

### Rust
- No panic paths in production logic
- `crate::` imports over `super::`
- Explicit context passing over hidden globals

## Load

```bash
/gitagent load dev-agent
/gitagent load gh:pesap/agents/dev-agent
```
