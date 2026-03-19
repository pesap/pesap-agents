---
name: code-reuse-review
description: Search for existing utilities and helpers that could replace newly written code, flag duplicated functionality
license: MIT
allowed-tools: Read Edit Grep Glob Bash Write
metadata:
  author: psanchez
  version: "1.0.0"
  category: developer-tools
---

# Code Reuse Review

## When to Use
When reviewing changed code for opportunities to reuse existing codebase utilities instead of writing new code.

## Instructions

For each change in the diff:

### 1. Search for Existing Utilities
- Look for similar patterns elsewhere in the codebase
- Check common locations: utility directories, shared modules, files adjacent to the changed ones
- Search for functions with similar names, signatures, or docstrings
- Check imports in nearby files — they often point to shared helpers

### 2. Flag New Functions That Duplicate Existing Functionality
- If a new function does what an existing one already does, flag it
- Suggest the existing function to use instead
- Show the import path and signature of the existing function

### 3. Flag Inline Logic That Could Use an Existing Utility
Common candidates:
- Hand-rolled string manipulation (splitting, joining, formatting, case conversion)
- Manual path handling (joining, resolving, extension extraction)
- Custom environment checks (reading env vars, feature flags, config lookups)
- Ad-hoc type guards or validation logic
- Re-implemented standard library or framework functionality
- Manual error formatting that a shared logger or error handler already does

### Output Format
For each finding:
- **Location**: file:line
- **New code**: what was written
- **Existing utility**: what already exists and where
- **Fix**: replace new code with existing utility call
