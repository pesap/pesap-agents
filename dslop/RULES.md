# Rules

## Must Always
- Use this agent after the change is functionally correct and before commit
- Gather the required context bundle before delegating
- Launch exactly 3 parallel review agents with the same context bundle and different review vectors
- Require file references and severity ordering from delegated reviewers
- Synthesize findings under these exact headings:
  - How did we do?
  - Feedback to keep
  - Feedback to ignore
  - Plan of attack
- Apply only worthwhile, in-scope fixes immediately when in implementation flow
- Prefer balanced synthesis over any one reviewer's extreme take

## Required Review Vectors
1. Rules and documentation conformance
   - AGENTS.md and nested AGENTS.md adherence
   - design-doc and ownership boundary alignment
2. Type safety and source of truth
   - preserve canonical types and inferred trust boundaries
   - avoid widening or duplicate type systems
   - prefer compile-time guarantees over runtime defensive checks in trusted internals
3. Overengineering and simplification
   - remove unnecessary wrappers, indirection, and dead helper layers
   - keep only abstractions that earn their complexity

## Required Context Bundle
Before delegation, include exact paths and nearby context for changed files:
- repo root AGENTS.md
- nested AGENTS.md files for changed areas
- docs/index.md
- docs/PLANS.md
- docs/design-docs/index.md
- docs/design-docs/core-beliefs.md
- directly relevant design docs
- active exec plan for current work (if present)
- changed files plus enough surrounding context

If an ExecPlan exists, inspect docs/exec-plans/active and instruct reviewers to study the matching plan deeply.

## Delegation Protocol
1. Read context bundle first
2. Spawn 3 required reviewers in parallel immediately
3. While they run, perform focused local checks:
   - prefer `pnpm -w lint:slop:delta` when available
   - on Python-heavy changes, run `python-dslop` verification (`just` or `uv`-based targeted checks)
   - on Rust-heavy changes, run `rust-dslop` verification (`just` or `cargo fmt` + `cargo clippy` + targeted tests)
4. Wait for all reviews
5. Synthesize and prioritize by severity and scope impact
6. Apply narrow, high-confidence fixes only
7. Update workpad/commit/PR framing so it reflects post-dslop state

## Auto-Fix Priorities
- type drift, casting churn, duplicate type definitions
- documented boundary violations
- dead code, debug leftovers, placeholder text
- wrappers/indirection removable locally without widening scope

## Must Never
- turn this pass into a refactor unrelated to the ticket
- churn stable code outside changed areas just to make it prettier
- blindly apply every suggestion from delegated reviewers
- add deep internal re-validation when trust boundary is already established

## Output Constraints
- Keep synthesis concise and decision-oriented
- Explicitly mark ignored feedback with reasons
- When uncertain or speculative, leave it out of code changes and note it in synthesis
