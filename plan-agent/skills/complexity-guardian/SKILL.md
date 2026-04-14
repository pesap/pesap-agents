---
name: complexity-guardian
description: Detect and flag unnecessary complexity, overengineering, and premature abstraction in plans and designs
license: MIT
metadata:
  author: pesap
  version: "1.0.0"
  category: validation
---
# Complexity Guardian

## When to Use

- When a plan involves multiple layers, services, or components
- When new frameworks or tools are proposed
- When the solution seems larger than the problem
- When abstractions are introduced before the concrete case works
- When someone says "we might need this later"

## Instructions

### Step 1: Identify the Core Problem


Before evaluating complexity, state the core problem in one sentence:
```
Core Problem: [User] needs to [achieve goal] so they can [outcome]
```

If this is hard to articulate, flag it immediately — the problem may not be well understood.

### Step 2: Map the Proposed Solution

Extract and list:
- Components/services/modules
- External dependencies (libraries, APIs, databases)
- Abstractions and interfaces
- Data flows
- Operational requirements (monitoring, deployment, scaling)

Format:
```
Proposed Solution Components:
1. [Component name]: [what it does]
2. [External dependency]: [why it's needed]
3. [Abstraction]: [what it abstracts]
...
```

### Step 3: Score Complexity

For each component, score on these dimensions (Low/Medium/High):

| Component | Understand | Debug | Test | Deploy | Maintain |
|-----------|-----------|-------|------|--------|----------|
| [name] | L/M/H | L/M/H | L/M/H | L/M/H | L/M/H |

Add a **Total Complexity** row summing the difficulty.

### Step 4: Identify Overengineering Patterns

Check for these specific anti-patterns:

#### Pattern 1: Premature Abstraction
- Signs: Interface for one implementation, factory for one class
- Check: Is there more than one concrete use case TODAY?

#### Pattern 2: Framework Chasing
- Signs: Using heavy frameworks for simple operations
- Check: Could this be done with standard library tools?

#### Pattern 3: Microservices for Small Teams
- Signs: Distributed system for <10 engineers
- Check: What's the operational burden vs. team size?

#### Pattern 4: Database Over-Optimization
- Signs: Multiple databases, complex caching layers
- Check: Do we have performance problems today?

#### Pattern 5: Feature Creep
- Signs: "While we're at it, we could also..."
- Check: Is this in the core problem statement?

#### Pattern 6: Gold Plating
- Signs: Polishing edge cases before core works
- Check: Does the happy path work end-to-end?

#### Pattern 7: Resume-Driven Development
- Signs: Using trendy tech with no clear benefit
- Check: Would you choose this if no one was watching?

#### Pattern 8: Not-Invented-Here
- Signs: Rebuilding existing solutions
- Check: What existing tools solve 80% of this?

#### Pattern 9: Architecture Astronaut
- Signs: Designing for future scale/needs
- Check: What are the current actual constraints?

#### Pattern 10: Distributed Complexity
- Signs: Multiple moving parts for linear workflows
- Check: What's the minimum viable flow?

### Step 5: Propose the Simpler Alternative

For each flagged pattern, propose a simpler approach:

```
Overengineering Pattern: [name]
Current Approach: [what's being proposed]
Simpler Alternative: [minimum viable version]
Trade-offs:
  - What we lose: [specific capability]
  - What we gain: [simplicity, speed, maintainability]
Recommendation: [Use simpler / Keep complex / Need more info]
```

### Step 6: Calculate the Cost

Estimate (roughly, order-of-magnitude):
- **Time to build**: Proposed vs. Simple (hours/days/weeks)
- **Time to debug**: Proposed vs. Simple
- **Time to onboard**: New team member ramp-up time
- **Operational overhead**: Monitoring, alerts, incident response

### Step 7: Output Format

```markdown
## Complexity Analysis

### Core Problem
[One sentence]

### Complexity Scorecard
| Component | Understand | Debug | Test | Deploy | Maintain |
|-----------|-----------|-------|------|--------|----------|
| ... | ... | ... | ... | ... | ... |
| **Total** | **...** | **...** | **...** | **...** | **...** |

### Overengineering Patterns Detected
1. **[Pattern Name]**: [specific instance]
   - Simpler Alternative: [minimum viable version]
   - Recommendation: [Use simpler / Keep complex]

### Cost Comparison
| Dimension | Proposed | Simpler |
|-----------|----------|---------|
| Build time | X days | Y days |
| Debug time | X hours | Y hours |
| Onboard time | X days | Y days |
| Ops overhead | High/Med/Low | High/Med/Low |

### Verdict
[PROCEED / REVISE / HALT]

### Recommendation
[Specific action: simplify X, remove Y, or proceed with caution]
```

## Questions to Ask

- Is the solution proportional to the problem?
- Could a junior developer understand this in a day?
- If this breaks at 2am, how many components need checking?
- What happens if we remove each abstraction?
- Can we ship the core in half the time?
