---
name: slop-detection
description: Identify AI-generated slop — low-quality code, boilerplate, hallucinated patterns, and cargo-cult solutions that waste time and create technical debt
license: MIT
metadata:
  author: pesap
  version: "1.0.0"
  category: validation
---

# Slop Detection

## When to Use

- When reviewing code that feels "generated" rather than "crafted"
- When boilerplate dominates the implementation
- When solutions seem plausible but don't actually work
- When patterns are copied without understanding
- When verbosity masks lack of substance

## What is Slop?

**Slop** is the AI-generated equivalent of junk food: looks edible, fills space, provides no nutrition, and leaves you worse off.

Common forms:
- **Hallucinated APIs** — Functions that don't exist, parameters that don't work
- **Cargo-cult patterns** — Copy-pasted "best practices" that don't fit the context
- **Verbose nothing** — Lots of words/code saying very little
- **Boilerplate explosion** — 50 lines to do what 5 should handle
- **Fake expertise** — Confident explanations of wrong concepts
- **Placeholder logic** — `// TODO: implement actual functionality`
- **Over-commented obvious** — `// increment counter` on `i++`

## Instructions

### Step 1: Scan for Hallucination Markers

Check for these telltale signs of made-up content:

**API Hallucinations:**
- Function names that sound plausible but don't exist in the library
- Parameters that aren't in the docs
- Methods on classes that don't exist
- Version numbers that don't match reality

**Pattern Hallucinations:**
- "Standard" approaches that aren't standard
- Framework features described incorrectly
- Language syntax that doesn't compile
- Import statements for non-existent modules

**Documentation Hallucinations:**
- Links that 404
- References to non-existent sections
- Version numbers that don't exist
- Commands that fail when run

### Step 2: Detect Cargo-Cult Programming

Look for patterns copied without understanding:

**Signs of cargo-cult:**
- Comments explaining what the code does (not why)
- Exception handling that swallows all errors
- Configuration that matches "tutorial defaults" not needs
- Imports of entire libraries for one function
- Design patterns applied to trivial problems
- Abstract base classes with one implementation
- Interfaces for types that never vary

**Ask:** Can the author explain why each line is necessary?

### Step 3: Measure Signal-to-Noise Ratio

Calculate:
- **Lines of actual logic** vs. **lines of boilerplate**
- **Unique insights** vs. **generic statements**
- **Specific implementation** vs. **vague frameworks**

Slop has low signal-to-noise: lots of words/code, little actual functionality.

### Step 4: Check for Placeholder Hell

Count placeholders and TODOs:
- `TODO` comments that won't get done
- `FIXME` that should have been fixed
- `// implement this` in core logic
- Hardcoded values that should be configurable
- Empty catch blocks
- Stub implementations passed off as complete

### Step 5: Identify Fake Sophistication

Slop often masquerades as expertise:

- Complex words for simple concepts
- Over-engineered solutions to easy problems
- "Enterprise" patterns for scripts
- Multiple layers of indirection
- Abstract explanations of concrete problems
- References to papers/docs the author hasn't read

**Rule:** If removing complexity makes it clearer, the complexity was slop.

### Step 6: Test for Actual Functionality

Slop detection questions:
- Does this actually run?
- Does it handle edge cases, or just the happy path?
- Can you trace through the logic and understand it?
- Does it solve the problem, or describe a solution?
- Would a human write it this way, or is this "AI-shaped"?

### Step 7: Categorize the Slop

Label each issue found:

| Category | Description | Severity |
|----------|-------------|----------|
| **HALLUCINATION** | Made-up APIs, functions, facts | Critical |
| **CARGO-CULT** | Copied patterns without understanding | High |
| **BOILERPLATE** | Excessive scaffolding, low signal | Medium |
| **PLACEHOLDER** | TODOs, stubs, fake implementations | High |
| **VERBOSITY** | Words/code saying nothing | Low |
| **FAKE-EXPERT** | Complex solutions to simple problems | Medium |

### Step 8: Output Format

```markdown
## Slop Detection Report

### Hallucinations Found
| Location | Issue | Reality Check |
|----------|-------|---------------|
| [file:line] | [fake API/pattern] | [what actually exists] |

### Cargo-Cult Patterns
| Pattern | Context | Why It's Wrong |
|---------|---------|----------------|
| [pattern] | [where used] | [why it doesn't fit] |

### Signal-to-Noise Analysis
- Total lines: [N]
- Lines of actual logic: [N] ([%]%)
- Boilerplate/overhead: [N] ([%]%)

### Placeholder Audit
| Location | TODO/FIXME | Days Old? | Risk |
|----------|-----------|-----------|------|
| [file:line] | [text] | [N] | [High/Med/Low] |

### Fake Sophistication
- [Specific instance of unnecessary complexity]
- [Better alternative: simpler approach]

### Overall Quality Assessment
**Slop Score**: [0-100, lower is better]

**Verdict**:
- [ ] **CLEAN** — No significant slop detected
- [ ] **REVIEW** — Some slop, needs cleanup
- [ ] **REWRITE** — Predominantly slop, start over

### Specific Deletions
Lines/sections that should be removed entirely:
1. [location]: [reason]

### Required Rewrites
Sections that need human-written replacement:
1. [location]: [why current version is slop]
```

## Slop Red Flags by Type

### Code Slop
```python
# Bad: Generated-looking, over-commented, cargo-cult
class AbstractBaseUserManagerFactoryProxy(ABC):
    """Abstract base class for user manager factory proxy."""
    
    @abstractmethod
    def get_user_manager(self):
        """Get the user manager."""
        pass

# Good: Human-written, purposeful
class UserManager:
    def create_user(self, email: str) -> User:
        if User.exists(email):
            raise DuplicateUser(email)
        return User.create(email=email)
```

### Documentation Slop
```markdown
<!-- Bad: Generic, vague, not useful -->
## Architecture
This system uses a microservices architecture to ensure 
scalability and maintainability. It leverages modern 
cloud-native technologies for optimal performance.

<!-- Good: Specific, actionable -->
## Architecture
- API Gateway (Kong) routes to 3 services
- User service: PostgreSQL, handles auth
- Order service: PostgreSQL + Redis cache
- Notification service: SQS + Lambda
```

### Config Slop
```yaml
# Bad: Copied from tutorial, not tailored
kubernetes:
  replicas: 3  # because "production needs HA"
  resources:
    requests:
      cpu: 100m  # no idea if this is right
      memory: 128Mi  # copied from example

# Good: Sized for actual needs
kubernetes:
  replicas: 2  # traffic is 10 req/min, don't need 3
  resources:
    requests:
      cpu: 50m   # measured: uses 30m at peak
      memory: 64Mi  # measured: uses 45Mi
```

## Questions to Detect Slop

- Did a human actually write this, or prompt an AI?
- Can the author explain every line?
- Does it work, or does it just look like it works?
- Is this the simplest way, or the most impressive-looking way?
- Would this pass a code review from someone who knows the domain?
- If I delete the comments, does the code still make sense?
- Are there 404 links or non-existent references?

## Slop vs. Good Enough

**Not slop:** Simple, boring code that works.
- A 10-line script that solves the problem
- Hardcoded values that won't change
- Copy-pasted logic that's clear and correct

**Slop:** Complex, impressive-looking code that's wrong.
- Abstract factories for one use case
- "Scalable" solutions for non-existent scale
- Configuration for problems you don't have
