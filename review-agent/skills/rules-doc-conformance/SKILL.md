---
name: rules-doc-conformance
description: Check changes against AGENTS.md constraints, design docs, and documented ownership boundaries
license: MIT
allowed-tools: Read Bash
metadata:
  author: pesap
  version: "1.0.0"
  category: developer-tools
---
# Rules and Documentation Conformance


## When to Use
Use this skill when you need to check changes against AGENTS.md constraints, design docs, and documented ownership boundaries.

## Instructions
1. Confirm the task matches this skill and identify the concrete files, outputs, or decisions it should guide.
2. Apply the domain-specific guidance and checklists below, favoring the simplest sound approach.
3. Return concrete findings or edits with rationale, and include file references when applicable.

## Review Goal
Confirm the changes follow repo rules and documented architecture intent.

## Checklist
1. Confirm AGENTS.md compliance (root and nested)
2. Compare changed behavior to relevant design docs and plans
3. Check ownership boundaries and module responsibilities
4. Flag drift from documented patterns
5. Prioritize findings by severity with file references

## Output Format
- Severity-ordered findings
- Each finding includes: file path, what violated docs/rules, and smallest fix
- Separate hard violations from style preferences

## Red Flags
- introducing patterns explicitly disallowed in AGENTS.md
- violating design doc boundaries without rationale
- undocumented behavior change disguised as cleanup
