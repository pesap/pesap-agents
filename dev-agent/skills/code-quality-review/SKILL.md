---
name: code-quality-review
description: Review code for hacky patterns — redundant state, parameter sprawl, copy-paste, leaky abstractions, stringly-typed code
license: MIT
allowed-tools: Read Edit Grep Glob Bash Write
metadata:
  author: psanchez
  version: "1.0.0"
  category: developer-tools
---
# Code Quality Review

## When to Use
When reviewing changed code for quality anti-patterns that should be fixed before merging.

## Instructions

Review the diff for these patterns:


### 1. Redundant State
- State that duplicates existing state
- Cached values that could be derived on access
- Observers or effects that could be direct function calls

### 2. Parameter Sprawl
- Adding new parameters to a function instead of generalizing or restructuring
- Functions with 4+ parameters that share a common theme (candidate for a config object)
- Boolean flags that create hidden branching logic

### 3. Copy-Paste with Slight Variation
- Near-duplicate code blocks that differ by 1-2 lines
- Repeated patterns that should be unified with a shared abstraction
- Identical error handling blocks across multiple catch sites

### 4. Leaky Abstractions
- Exposing internal implementation details that should be encapsulated
- Breaking existing abstraction boundaries (reaching into private fields, skipping API layers)
- Mixing levels of abstraction in the same function

### 5. Stringly-Typed Code
- Raw strings where constants, enums, or typed unions already exist in the codebase
- Magic strings for state, status, or category values
- String comparisons that should be enum comparisons

### 6. Unnecessary Nesting
- Wrapper elements or containers that add no structural value
- Deeply nested conditionals that could be flattened with early returns
- Redundant grouping that obscures the actual logic

### Output Format
For each finding:
- **Pattern**: which anti-pattern (1-6 above)
- **Location**: file:line
- **Problem**: one-sentence description
- **Fix**: the specific code change to make
