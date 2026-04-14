---
name: ux-reality-check
description: Validate that proposed features map to real user needs and prioritize functionality over idealized design
license: MIT
metadata:
  author: pesap
  version: "1.0.0"
  category: validation
---

# UX Reality Check

## When to Use

- When features are proposed without user research
- When the user experience seems "designed" but not "tested"
- When multiple user-facing changes are planned
- When edge cases dominate the design discussion
- When there's more focus on "delight" than "function"

## Instructions

### Step 1: Identify the User (Actually)

Don't accept "the user" — demand specificity:

```
Target User(s):
1. [Role]: [What they do] — [Current pain point]
   Frequency: [How often they do this task]
   Context: [Where/when they do it]
   Constraints: [Time pressure, technical skill, distractions]
```

If the plan doesn't define this, flag it immediately.

### Step 2: Map Features to User Jobs

For each proposed feature, map it to:
- What **job** the user is trying to do
- How they do it **today**
- How this feature **changes** that

Format:
```
Feature: [Feature name]
Job-to-be-done: [User's goal]
Current approach: [How they do it now]
Proposed change: [What this feature does]
Value proposition: [Why this is better]
Evidence: [User research, data, or ???]
```

If "Evidence" is "???", mark as UNVALIDATED.

### Step 3: Prioritize by Frequency and Pain

Score each feature on:
- **Frequency**: How often users need this (Daily/Weekly/Monthly/Rarely)
- **Pain**: How painful current solution is (Critical/High/Med/Low)
- **Reach**: How many users have this need (All/Many/Some/Few)

Calculate: **Priority = Frequency × Pain × Reach**

### Step 4: Check for Feature Fatigue

Look for signs of cognitive overload:
- Too many options in one view
- Features that require learning new patterns
- Overlapping functionality (3 ways to do the same thing)
- Hidden power features that complicate the basics

### Step 5: Validate the "Happy Path"

Every design must have a clear happy path:
1. User wants to: [goal]
2. They start at: [entry point]
3. They do: [action 1]
4. Then: [action 2]
5. Result: [outcome achieved]

If there are branches or decisions in the happy path, that's complexity.

### Step 6: Distinguish Needs from Wants

Categorize every feature:
- **NEED**: User cannot complete their job without this
- **WANT**: User would prefer this but can work around
- **NICE**: Pleasant surprise, not expected

A healthy MVP is 80% NEED, 15% WANT, 5% NICE.

### Step 7: Reality Check Questions

Answer honestly:
- Have users asked for this, or are we assuming?
- Can users discover this without documentation?
- If this feature disappeared, would anyone notice in a week?
- Is this solving a user problem or a business problem?
- What percentage of users will use this feature?

### Step 8: Output Format

```markdown
## UX Reality Check

### Target Users
1. [Role]: [Job] — [Pain point]
   Context: [Details]

### Feature Mapping
| Feature | Job-to-be-done | Current Way | Value Prop | Evidence | Priority |
|---------|---------------|-------------|------------|----------|----------|
| ... | ... | ... | ... | [Research/???] | P0/P1/P2 |

### Needs vs. Wants vs. Nice
- **NEED (must have)**: [features]
- **WANT (should have)**: [features]
- **NICE (could have)**: [features]

### Happy Path
1. [Start] → 2. [Action] → 3. [Action] → 4. [Outcome]
[Or: NO CLEAR HAPPY PATH — flag as issue]

### Red Flags
- [Specific UX anti-pattern found]

### Verdict
[PROCEED / REVISE / HALT]

### Recommended Scope
**MVP**: [List of NEED features only]
**Phase 2**: [WANT features]
**Phase 3**: [NICE features]

### Unvalidated Assumptions
1. [Assumption about user behavior] — Validation needed: [method]
```

## Common UX Reality Check Failures

### 1. The "Power User" Trap
Designing for advanced users when 80% are casual. Ask: What does the first-time user see?

### 2. The "Edge Case" Trap
Optimizing for rare scenarios at the expense of the common case. Ask: What percentage of users hit this edge?

### 3. The "Feature Parity" Trap
Adding features because competitors have them. Ask: Do our users actually use competitor features?

### 4. The "Configurability" Trap
Adding settings instead of making good defaults. Ask: Can we pick the right default 90% of the time?

### 5. The "Onboarding" Trap
Building complex onboarding instead of simplifying the product. Ask: Why do users need training to use this?

## Questions That Cut Through UX BS

- What would a tired, distracted user do?
- Could someone use this successfully without reading anything?
- What happens if we remove half the features?
- Has a non-team member actually tried to use this?
- What would a user say if we asked them to pay extra for this feature?
