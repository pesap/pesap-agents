---
name: pre-pr-gate
description: Fast pre-PR hardening pass before opening a pull request
---

## surgical-dev

Define pre-PR scope for task: {task}

Set a minimal checklist for must-fix vs nice-to-have.

## code-reviewer

Review for correctness, safety, and security issues in:

{previous}

## pytest-whisperer

Propose/add missing tests and improve test structure for:

{previous}

## performance-freak

Check for easy performance wins and regressions in:

{previous}

## dslop

Final deslop synthesis pass for:

{previous}

Apply only high-signal fixes suitable for a clean PR.
