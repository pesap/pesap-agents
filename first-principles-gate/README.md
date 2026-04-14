# first-principles-gate

A ruthless first-principles validator that prevents overengineering, catches unchecked assumptions, and keeps planning grounded in reality. Works in-loop with planning agents to ensure you build only what users actually need.

## Load

```
/gitagent load first-principles-gate
/gitagent load gh:pesap/agents/first-principles-gate
```

## When to Use

- **Before committing to a plan** — Have this agent validate the plan for hidden assumptions and overengineering
- **During planning sessions** — Run in-loop with your planning agent to challenge proposals in real-time
- **When complexity creeps in** — Re-evaluate when a "simple" feature starts requiring complex architecture
- **Before expanding scope** — Check if new features are actually needed or just "nice to have"

## In-Loop Usage Pattern

```
# With a planning agent
/gitagent chain planner first-principles-gate -- \
  "Design a task management system for a 5-person team"

# Or run separately on any plan
/gitagent run first-principles-gate -- \
  "Review this plan: [paste plan here]"
```

## What It Checks

### First Principles
- Is the problem clearly defined in one sentence?
- Do we know who has this problem?
- What is the minimum viable solution?
- What are we assuming that we haven't validated?

### Overengineering Patterns
- Premature abstraction (solving problems we don't have)
- Framework chasing (using complex tools for simple jobs)
- Feature creep (adding things "just in case")
- Gold plating (polishing before core works)
- Architecture astronaut (designing for scale we don't need)

### Assumption Categories
- **User assumptions** — "Users will want X" (have we asked?)
- **Technical assumptions** — "This will perform well" (have we measured?)
- **Business assumptions** — "This will save time" (have we quantified?)
- **Dependency assumptions** — "This library will work" (have we tested?)

## Output Format

The agent responds with:

```
## Verdict: [PROCEED / REVISE / HALT]

## Critical Issues (must fix)
1. **Issue**: [specific problem]
   **Assumption**: [what's unverified]
   **Fix**: [what to do instead]

## Warnings (consider addressing)
...

## Questions to Answer Before Proceeding
1. [specific question that would change the plan]

## Simpler Alternative
[The minimum viable version that delivers 80% of the value]
```

## Integration with Planning Agents

This agent is designed to work alongside planning agents, not replace them. Use it as a "devil's advocate" that:
- Catches assumptions the planning agent skipped
- Proposes simpler alternatives
- Halts plans that violate first principles

## Examples

### Example 1: Feature Request
```
User: "Add a real-time collaborative editing system"

first-principles-gate responds:
- Verdict: HALT
- Issue: No evidence users need real-time; async may suffice
- Assumption: Real-time is valued over simplicity
- Simpler Alternative: Start with async comments, add real-time only if requested
```

### Example 2: Architecture Decision
```
Plan: "Build microservices for a 3-person project"

first-principles-gate responds:
- Verdict: REVISE
- Issue: Microservices add operational complexity
- Assumption: Team will grow rapidly (unvalidated)
- Simpler Alternative: Modular monolith with clear boundaries
```

## Skills

- **assumption-audit** — Systematically identify and catalog unchecked assumptions
- **complexity-guardian** — Detect and flag unnecessary complexity
- **ux-reality-check** — Validate that proposed features map to real user needs
