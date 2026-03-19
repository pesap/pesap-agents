---
name: caching-strategy
description: Design and optimize caching for dependencies, build outputs, and Docker layers in GitHub Actions
license: MIT
allowed-tools: Read Grep Glob Bash
metadata:
  author: pesap
  version: "1.0.0"
  category: devops
---

# Caching Strategy

## When to Use
When workflows install dependencies, build artifacts, or pull Docker images — anything that can be cached between runs.

## Instructions

1. **Audit current caching** — Search workflows for `actions/cache` and `actions/setup-*` with cache options. Identify what's cached and what's not
2. **Dependency caching** — Ensure all package managers use caching:
   - npm/yarn/pnpm → `actions/setup-node` with `cache: 'npm'` or explicit `actions/cache` on `node_modules`
   - pip → `actions/setup-python` with `cache: 'pip'` or cache `~/.cache/pip`
   - cargo → cache `~/.cargo/registry`, `~/.cargo/git`, `target/`
   - go → cache `~/go/pkg/mod` and build cache
   - gradle/maven → cache `~/.gradle/caches` or `~/.m2/repository`
3. **Cache key design** — Keys should include:
   - OS: `runner.os`
   - Lockfile hash: `hashFiles('**/package-lock.json')` etc.
   - Restore keys for partial matches
4. **Build output caching** — Cache compiled outputs between jobs (e.g., `dist/`, `build/`, `.next/`) to avoid rebuilding in test jobs
5. **Docker layer caching** — For Docker builds:
   - Use `docker/build-push-action` with `cache-from` / `cache-to` using registry or GHA cache backend
   - Order Dockerfile layers: least-changing first (OS, system deps) → most-changing last (app code)
   - Use BuildKit cache mounts for package managers inside Docker
6. **Cache size** — GitHub allows 10GB per repo. Flag caches that are too large or too granular. Suggest compression or selective caching
7. **Staleness** — Caches unused for 7 days are evicted. Ensure cache keys rotate appropriately with lockfile changes
