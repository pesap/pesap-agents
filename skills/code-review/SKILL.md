---
name: code-review
description: Review code changes for bugs, performance issues, and best-practice violations. Use when users ask for a PR/diff review, risk assessment, or actionable quality findings.
license: MIT
allowed-tools: Read Grep Glob Bash
metadata:
  author: pesap
  version: "1.0.0"
  category: developer-tools
---

# Code Review

## Use when
When reviewing a pull request, diff, or set of code changes.

## Avoid when
- User asks for implementation work instead of review.
- Scope has no concrete diff/target files to assess.

## Instructions

1. **Understand the change** — Read the diff or changed files to understand what was modified and why
2. **Check for bugs** — Look for logic errors, off-by-one errors, null/undefined access, race conditions, unhandled edge cases
3. **Check error handling** — Ensure errors are caught, logged, and handled gracefully. Silent failures are critical issues
4. **Check performance** — Flag O(n^2) loops, unnecessary allocations, missing indexes, N+1 queries, unbounded growth
5. **Check readability** — Naming, code structure, comments where non-obvious, function length
6. **Check tests** — Are there tests? Do they cover edge cases? Are they testing behavior or implementation?
7. **Report findings** — Group by file, categorize by severity (Critical/Warning/Suggestion/Nit), include line references and suggested fixes

## Output
- Prioritized findings by severity (Critical/Warning/Suggestion/Nit)
- File/line evidence for each finding
- Concrete fix guidance
- Residual risks and follow-up checks
