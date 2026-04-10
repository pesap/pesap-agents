---
name: type-safety-source-of-truth
description: Detect type drift, unnecessary widening/casting, duplicate type definitions, and trust-boundary violations
license: MIT
allowed-tools: Read Bash
metadata:
  author: pesap
  version: "1.0.0"
  category: developer-tools
---

# Type Safety and Source of Truth

## Review Goal
Protect canonical types and trust boundaries while reducing runtime defensive churn in trusted internals.

## Checklist
1. Verify canonical type sources are preserved
2. Detect duplicated type definitions or shadow schemas
3. Flag widening conversions and avoidable casts
4. Check trust-boundary handling:
   - validate/parse once at untrusted ingress
   - downstream trusted flow should carry inferred/canonical types
5. Prefer compile-time guarantees over runtime revalidation inside trusted helpers
6. Report concrete, minimal fixes with file references

## Output Format
- Severity-ordered findings
- For each finding: file, risk, and exact type-safe fix
- Explicitly call out anything that would require scope expansion

## Red Flags
- parse/validate repeated deep in internal call chains
- `any`/unchecked casts where inferred types are available
- parallel type systems for the same domain model
