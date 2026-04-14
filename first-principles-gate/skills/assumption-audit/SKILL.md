---
name: assumption-audit
description: Systematically identify, categorize, and validate assumptions in plans and proposals
license: MIT
metadata:
  author: pesap
  version: "1.0.0"
  category: validation
---

# Assumption Audit

## When to Use

- When reviewing any plan, proposal, or design document
- When the stakes are high and being wrong is costly
- When multiple options are being considered
- When a solution seems "obvious" — that's when assumptions hide

## Instructions

### Step 1: Extract All Assumptions

Read through the plan and extract every statement that:
- Predicts user behavior
- Assumes technical feasibility
- Estimates time/resource requirements
- Depends on external conditions
- Claims causality (X will lead to Y)

Create a numbered list of assumptions in this format:
```
A1: [The exact statement from the plan]
A2: [The exact statement from the plan]
...
```

### Step 2: Categorize Each Assumption

Label each assumption with one or more categories:
- **USER** — About what users want, need, or will do
- **TECHNICAL** — About technology performance, compatibility, or capability
- **BUSINESS** — About ROI, adoption, or organizational impact
- **DEPENDENCY** — About external tools, teams, or conditions
- **CONSTRAINT** — About what is/isn't possible
- **CAUSAL** — That X will cause Y

Example:
```
A1: "Users will prefer the new dashboard" [USER, CAUSAL]
A2: "The API can handle 1000 req/s" [TECHNICAL]
A3: "This will reduce support tickets by 50%" [BUSINESS, CAUSAL]
```

### Step 3: Assess Validation Status

For each assumption, determine:
- **VALIDATED** — We have evidence (data, user research, prototypes, load tests)
- **PARTIAL** — We have some evidence but it's incomplete
- **UNVALIDATED** — No evidence, just belief
- **UNKNOWN** — Can't determine from available information

### Step 4: Flag Critical Unvalidated Assumptions

Identify assumptions where being wrong would:
- Invalidate the entire plan
- Cause significant rework
- Result in major cost/time overruns
- Damage user trust or business outcomes

Mark these as **[CRITICAL]**.

### Step 5: Propose Validation Methods

For each critical or unvalidated assumption, suggest how to validate it:
- **User interviews** — For USER assumptions
- **Prototype/spike** — For TECHNICAL assumptions
- **Data analysis** — For BUSINESS assumptions
- **Proof of concept** — For DEPENDENCY assumptions
- **Constraint check** — For CONSTRAINT assumptions
- **A/B test** — For CAUSAL assumptions

### Step 6: Output Format

Present your audit in this structure:

```markdown
## Assumption Audit: [N] assumptions found

### Critical Unvalidated Assumptions
| ID | Assumption | Category | Risk if Wrong | Validation Method |
|----|------------|----------|---------------|---------------------|
| A1 | ... | USER | Plan fails | User interviews (n=5) |

### Other Unvalidated Assumptions
| ID | Assumption | Category | Suggested Validation |
|----|------------|----------|----------------------|
| A3 | ... | BUSINESS | Analyze last 6 months of tickets |

### Validated Assumptions (OK to proceed)
| ID | Assumption | Evidence |
|----|------------|----------|
| A2 | ... | Load test on staging showed 1200 req/s |

### Recommendations
1. [Specific action to validate critical assumptions]
2. [Specific action to validate critical assumptions]

### Questions That Need Answers
1. [Question that would change the assessment]
```

## Common Assumption Traps

Watch for these phrases — they often hide assumptions:
- "Users will..." (Do we know?)
- "Obviously..." (Is it?)
- "Clearly..." (To whom?)
- "We can just..." (Have we tried?)
- "The team will..." (Have they agreed?)
- "This will save..." (Measured how?)
- "Everyone knows..." (Citation needed)
- "It's trivial to..." (Have you done it?)
