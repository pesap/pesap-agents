---
name: simplification-pass
description: Find and remove overengineering, dead code, and low-payoff abstraction while preserving behavior
license: MIT
allowed-tools: Read Bash
metadata:
  author: pesap
  version: "1.0.0"
  category: developer-tools
---

# Simplification Pass

## Review Goal
Reduce complexity tax without changing behavior or widening scope.

## Checklist
1. Identify unnecessary wrappers, indirection layers, or pass-through helpers
2. Detect dead code, debug leftovers, placeholder text, and obsolete branches
3. Check if logic can be expressed more directly with fewer moving parts
4. Keep abstractions that earn their keep, remove those that do not
5. Propose smallest safe simplification per finding

## Output Format
- Severity-ordered findings with file references
- For each finding: what can be removed/simplified and why behavior stays the same
- Explicit note when suggestion is subjective and should be ignored

## Red Flags
- helper functions used once with zero semantic value
- wrapper objects that only rename fields and add no invariants
- added complexity to satisfy hypothetical future use
