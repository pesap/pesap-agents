# pesap-agent repo overrides

This repo inherits global defaults from `~/.pi/agent/AGENTS.md`.
Use this file only for repo-specific deltas.

## Repo-specific contract

- This package defines one canonical agent identity (`agent/agent.yaml`).
- Do not create additional top-level agents unless explicitly requested.
- Keep prompts and workflows concise, auditable, and reusable.
- Prefer additive learning updates over broad rewrites.
- Keep command ergonomics stable (`/debug`, `/feature`, `/learn-skill`, `/review`, `/git-review`, `/simplify`).

## When editing this repo

1. Preserve the single-agent package architecture.
2. Keep behavior changes minimal and explicit.
3. Update docs/templates when command behavior changes.
4. Validate touched paths with targeted checks and report what ran.