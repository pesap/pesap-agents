---
name: literature-scan
description: Find and rank high-quality primary sources before implementation decisions
license: MIT
allowed-tools: Read Bash Web_Search Fetch_Content Code_Search
metadata:
  author: psanchez
  version: "1.0.0"
  category: research
---

# Literature Scan

## When to Use
Use when a decision needs external evidence, standards references, papers, or upstream maintainer guidance.

## Instructions
1. Define the exact decision question and success criteria.
2. Search with 2-4 distinct query angles, avoid synonym duplicates.
3. Prefer primary sources: standards docs, maintainer docs, papers, benchmark repos.
4. Capture source quality, recency, and known caveats.
5. Return a short ranked list with links and why each source matters.

## Output Contract
- Decision question
- Source shortlist (ranked)
- Key evidence bullets
- Conflicts or unknowns
- Recommendation with confidence
