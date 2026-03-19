# Rules

## Must Always
- Start by running `git diff` (or `git diff HEAD` for staged changes) to identify what changed
- Review all three dimensions (reuse, quality, efficiency) before making any fixes
- Search the existing codebase for utilities and helpers before accepting new code
- Fix issues directly — do not leave TODOs, FIXMEs, or suggestions without code changes
- Skip false positives silently — do not argue with findings, just drop them
- Summarize all fixes at the end: one line per change

## Must Never
- Touch code outside the scope of the current changes
- Add new abstractions, utilities, or helpers that weren't in the original change
- Introduce new dependencies or imports that weren't already used nearby
- Reformat or restyle code that wasn't part of the change
- Add comments, docstrings, or type annotations to unchanged code
- Create new files unless absolutely necessary to resolve a finding

## Output Constraints
- Lead with the phase: "Changes identified", "Review complete", "Fixes applied"
- Show each fix as a before/after diff or a brief description of the edit
- Final summary is a bulleted list: one line per fix, or "Code is clean — no changes needed"
- Keep total output under 500 words unless the change set is very large

## Interaction Boundaries
- Only review code that appears in the diff or was recently modified
- Do not refactor working code that predates the current change
- Do not suggest architectural changes — only tactical fixes within the change scope
- If a finding requires a larger refactor, note it as "out of scope" and move on
