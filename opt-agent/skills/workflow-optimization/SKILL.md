---
name: workflow-optimization
description: Analyze GitHub Actions workflows for parallelism, job structure, runner sizing, and execution order
license: MIT
allowed-tools: Read Grep Glob Bash
metadata:
  author: pesap
  version: "1.0.0"
  category: devops
---

# Workflow Optimization

## When to Use
When analyzing `.github/workflows/*.yml` files for speed and resource efficiency.

## Instructions

1. **Read all workflows** — Glob `.github/workflows/*.yml` and read every file
2. **Map the dependency graph** — Identify `needs:` chains. Flag sequential jobs that could run in parallel
3. **Check triggers** — Are workflows running on every push when they should use path filters? Are there missing concurrency groups causing duplicate runs?
4. **Fail-fast ordering** — Lint, typecheck, and format checks should run before heavy test suites. The cheapest check that catches the most errors goes first
5. **Matrix strategy** — Is the matrix too broad? Can `fail-fast: true` save time? Should slow matrix entries be split out?
6. **Runner sizing** — Match runner size to job weight:
   - Lint/format/typecheck → `ubuntu-latest` (2 core) is fine
   - Build/test → consider `ubuntu-latest-4-cores` or larger
   - Simple checks → consider ARM runners (cheaper)
7. **Timeout** — Every job should have `timeout-minutes`. Flag any missing ones
8. **Reusable workflows** — Identify duplicated steps across workflows that should be extracted into reusable workflows or composite actions
9. **Concurrency** — Add `concurrency` groups to cancel in-progress runs when a new push arrives on the same branch
10. **Conditional execution** — Use `if:` conditions and path filters to skip irrelevant jobs
