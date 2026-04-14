---
name: skill-creator
description: Create or improve reusable SKILL.md files with clear trigger behavior, safety boundaries, and lightweight validation. Use when users ask to build a new skill, upgrade an existing skill, tune "Use when/Avoid when" sections, or run /learn-skill.
---

## Use when
- User wants a new reusable skill.
- User wants to improve an existing SKILL.md.
- User asks for better trigger behavior, safer boundaries, or clearer output format.
- User runs `/learn-skill`.

## Avoid when
- Task is not about skills (feature work, bugfixes, general coding).
- User only wants one-off prompt help, not reusable skill logic.
- Scope is intentionally fixed and no trigger/boundary updates are desired.

## Workflow
1. **Scope**
   - Capture intent, trigger, output format, and boundaries.
   - Reuse conversation context first, ask clarifying questions only where ambiguous.
2. **Interview**
   - Clarify edge cases, constraints, dependencies, and safety limits.
3. **Draft**
   - Write or update `SKILL.md` with compact, general instructions.
   - Include explicit `Use when` and `Avoid when` sections.
4. **Validate**
   - Check trigger quality, safety, brevity, and reusability (no overfitting).
5. **Test plan**
   - For non-trivial skills, propose 2-3 realistic test prompts.
6. **Save**
   - Write/update target files (or clearly mark dry-run output).
7. **Learn**
   - Persist concise notes about trigger choices and boundary decisions.

## Output format
- Skill summary
- Generated artifacts (paths + what changed)
- Learnings
- `Result: success|partial|failed`
- `Confidence: 0..1`
