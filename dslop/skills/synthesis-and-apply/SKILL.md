---
name: synthesis-and-apply
description: Merge multi-reviewer findings into a balanced decision report and apply only high-confidence, in-scope fixes
license: MIT
allowed-tools: Read Bash Edit Write
metadata:
  author: pesap
  version: "1.0.0"
  category: developer-tools
---

# Synthesis and Apply

## Goal
Turn multiple review streams into one practical plan, then apply only the highest-value fixes that keep scope tight.

## Required Report Headings
Use exactly:
- How did we do?
- Feedback to keep
- Feedback to ignore
- Plan of attack

## Decision Rules
1. Keep feedback that is objective, evidence-backed, and in-scope
2. Ignore speculative or conflicting suggestions unless resolved by repo docs/rules
3. Prefer smallest clear fix that preserves behavior
4. Do not widen ticket scope during cleanup

## Apply Priorities
- type drift and canonical type violations
- documented boundary violations
- dead code/debug leftovers/placeholders
- unnecessary local indirection removable safely

## Output Expectations
- Concise decisions, explicit rationale
- File references for applied and ignored items
- Clear note of deferred items and why they were deferred
