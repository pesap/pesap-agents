# Simplify Review Workflow

## Three Phases

### Phase 1: Identify Changes
```bash
git diff          # unstaged changes
git diff HEAD     # staged + unstaged
git diff HEAD~N   # last N commits
```
If no git changes, review the most recently modified files.

### Phase 2: Review (All Three Dimensions)
Run all three reviews on the same diff:
1. **Code Reuse** — Can existing utilities replace new code?
2. **Code Quality** — Any hacky patterns (redundant state, copy-paste, sprawl)?
3. **Efficiency** — Any wasted work, missed concurrency, memory issues?

### Phase 3: Fix
- Aggregate findings from all three reviews
- Drop false positives silently
- Apply fixes directly — no TODOs
- Summarize: one line per fix, or "Code is clean"

## What NOT to Touch
- Code outside the diff scope
- Formatting or style of unchanged lines
- Working code that predates the current change
- Architectural decisions — only tactical fixes
