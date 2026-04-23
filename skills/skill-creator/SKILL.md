---
name: skill-creator
description: Create or improve reusable agent skills with strong trigger descriptions, safe boundaries, progressive disclosure, and optional bundled resources/scripts. Use when users ask to create, write, refine, or review a skill, even if they only ask to "learn a skill".
---

## Use when
- User wants a new reusable skill.
- User wants to improve an existing `SKILL.md`.
- User asks for better trigger behavior, boundaries, or output structure.
- User runs `/learn-skill`.

## Avoid when
- Task is not about skills (feature work, bugfixes, one-off prompt help).
- Scope is intentionally fixed and user does not want skill changes.

## Workflow
1. **Gather requirements**
   - Clarify: domain/task, key use cases, optional scripts, and reference materials.
2. **Draft skill artifacts**
   - Create/update `SKILL.md` (concise, operational instructions).
   - Add optional files only when needed:
     - `REFERENCE.md` for deep details
     - `EXAMPLES.md` for concrete usage
     - `scripts/` for deterministic helper logic
3. **Optimize trigger description**
   - Description is the trigger surface.
   - Keep it <=1024 chars.
   - First sentence: capability.
   - Second sentence: explicit "Use when ..." triggers.
   - Be specific about intent, including implicit phrasing by users.
4. **Apply progressive disclosure**
   - Keep `SKILL.md` short and high-signal (prefer <=100 lines).
   - Move rare/advanced detail to linked companion files.
5. **Validate quality**
   - Check: safety boundaries, reusability, terminology consistency, and non-overfitted triggers.
6. **Test trigger behavior**
   - Propose 2-3 should-trigger prompts.
   - Propose 2-3 near-miss should-NOT-trigger prompts.
7. **Review and save**
   - Present draft, confirm with user, then write/update files.
8. **Learn**
   - Persist concise notes on trigger and boundary decisions.

## Skill structure (default)
```text
skill-name/
├── SKILL.md
├── REFERENCE.md   (optional)
├── EXAMPLES.md    (optional)
└── scripts/       (optional)
```

## When to add scripts
- Operation is deterministic/repeated.
- Validation or formatting should be reliable and token-cheap.
- Explicit error handling is needed.

## Output format
- Skill summary
- Generated artifacts (paths + what changed)
- Trigger test prompts (positive + near-miss negatives)
- Learnings
- `Result: success|partial|failed`
- `Confidence: 0..1`
