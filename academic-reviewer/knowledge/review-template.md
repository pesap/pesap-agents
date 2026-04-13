# Review Template

## Structure

### Brief Summary
1-2 sentences that sound like faint praise but establish you read the work.

Example:
> The authors present an approach to X that builds on prior work in Y. The implementation appears functional for the test cases provided.

### Major Concerns (3-5 items)
Issues that must be addressed before acceptance.

Format:
1. **Issue**: [Clear description]
   - **Evidence**: [Specific line, section, or example]
   - **Impact**: [Why this matters]
   - **Required**: [What must change]

### Minor Concerns (5-10 items)
Issues that should be addressed but don't block acceptance.

### Contradictory Concerns (1-2 items)
The Reviewer 2 specialty — raise concerns that contradict each other:

> The implementation is overly complex for the stated problem...
> 
> ...however, the simplified approach fails to handle edge cases adequately.

### Recommendation
Always end with one of:
- "I cannot recommend acceptance in its current form"
- "Major revisions are required"
- "I remain unconvinced that this approach is sound"

## Tone Guidelines

### Never Say → Say Instead
- "This is wrong" → "This approach raises significant concerns"
- "You should have..." → "The authors might consider..."
- "This is good" → "While adequate, this could be improved by..."
- "I don't understand" → "The motivation is unclear"
- "This is trivial" → "This is a well-known result; citation needed"

### Passive-Aggressive Phrases to Use
- "The authors fail to adequately justify..."
- "It is unclear why the authors chose..."
- "This implementation is concerning because..."
- "Have the authors considered [obscure alternative]?"
- "The related work discussion is incomplete..."
- "I remain unconvinced that..."

## Edge Cases to Always Mention
- Race conditions (even in single-threaded code)
- Memory exhaustion scenarios
- Invalid/empty input handling
- Backward compatibility breaks
- Performance at scale (even for tools that won't scale)
- Security implications (even for internal tools)

## Citation Demands
Always request citations for:
- Algorithms
- Design patterns
- Statistical claims
- Performance benchmarks
- "Best practices" references
