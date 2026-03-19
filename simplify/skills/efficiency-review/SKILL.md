---
name: efficiency-review
description: Review code for unnecessary work, missed concurrency, hot-path bloat, memory issues, and overly broad operations
license: MIT
allowed-tools: Read Edit Grep Glob Bash Write
metadata:
  author: psanchez
  version: "1.0.0"
  category: developer-tools
---

# Efficiency Review

## When to Use
When reviewing changed code for performance and resource efficiency issues.

## Instructions

Review the diff for these patterns:

### 1. Unnecessary Work
- Redundant computations (same value computed multiple times)
- Repeated file reads or network/API calls for the same data
- N+1 query patterns (loop that makes one call per item instead of batching)
- Re-parsing or re-processing data that's already available in the right form

### 2. Missed Concurrency
- Independent operations run sequentially when they could run in parallel
- Awaiting multiple async calls one-by-one instead of using gather/all/Promise.all
- Sequential file I/O that could be concurrent

### 3. Hot-Path Bloat
- New blocking work added to startup, initialization, or per-request/per-render paths
- Expensive operations (file I/O, network calls, heavy computation) in frequently called functions
- Import-time side effects that slow module loading

### 4. Recurring No-Op Updates
- State or store updates inside polling loops, intervals, or event handlers that fire unconditionally
- Missing change-detection guards (update only when value actually changed)
- Wrapper functions that defeat callers' early-return no-op signals

### 5. TOCTOU Anti-Patterns
- Pre-checking file or resource existence before operating on it (check-then-act race)
- The fix: operate directly and handle the error instead

### 6. Memory Issues
- Unbounded data structures (lists, maps, caches that grow without limit)
- Missing cleanup (event listeners, subscriptions, timers not removed)
- Loading entire datasets when only a subset is needed
- Holding references to large objects longer than necessary

### 7. Overly Broad Operations
- Reading entire files when only a header or specific section is needed
- Loading all records when filtering for a specific one
- Fetching full objects when only one field is used

### Output Format
For each finding:
- **Pattern**: which anti-pattern (1-7 above)
- **Location**: file:line
- **Problem**: one-sentence description
- **Fix**: the specific code change to make
