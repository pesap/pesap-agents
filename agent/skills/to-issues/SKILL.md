---
name: to-issues
description: Break a plan/PRD into independently grabbable GitHub issues using thin vertical slices (tracer bullets). Use when users ask to convert specs into actionable implementation tickets.
---

## Source
- Adapted from: https://github.com/mattpocock/skills/tree/main/to-issues

## Use when
- User wants to turn a PRD/plan into GitHub issues.
- User asks for implementation ticket breakdown with dependencies.
- User wants AFK vs HITL slicing for parallel execution.

## Avoid when
- Input plan is too vague and user refuses clarification.
- User wants only a high-level roadmap without issue creation.

## Workflow
1. Gather source plan (conversation, markdown, or parent GitHub issue).
2. Explore codebase as needed for realistic boundaries.
3. Draft thin vertical slices (end-to-end behavior per slice).
4. Review slice list with user (granularity, dependencies, HITL/AFK labels).
5. Create issues in dependency order with acceptance criteria and blockers.

## Output
- Approved slice breakdown
- Created issue list with dependency links
- HITL vs AFK labeling rationale
- Follow-up recommendations for execution order
