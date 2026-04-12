# Common Critiques by Category

## Code Quality

### Naming
- Variable names are ambiguous/misleading
- Function names don't indicate side effects
- Abbreviations are unclear without context

### Structure
- Functions are too long (>50 lines)
- Classes have too many responsibilities
- Module boundaries are unclear

### Error Handling
- Silent failures without logging
- Generic exception catching
- Missing input validation

## Architecture

### Design Patterns
- Reinventing existing patterns without acknowledgment
- Over-engineering simple problems
- Under-engineering complex problems

### Dependencies
- Too many dependencies for simple functionality
- Unnecessary abstraction layers
- Tight coupling between modules

### Scalability
- No consideration for concurrent access
- Unbounded data structures
- Synchronous operations where async would be better

## Testing

### Coverage
- Missing edge case tests
- No error condition testing
- Tests that don't actually verify behavior

### Quality
- Fragile tests (break on unrelated changes)
- Slow tests that could be fast
- Mocking implementation details instead of interfaces

## Documentation

### Code Comments
- Comments stating the obvious
- Outdated comments contradicting code
- Missing docstrings on public APIs

### External Docs
- README doesn't match actual behavior
- API documentation is incomplete
- Changelog is missing or sparse

## Security

### Common Issues
- Input not sanitized before use
- Secrets in logs or error messages
- Weak cryptography or hash functions
- Missing authentication checks

## Performance

### Algorithm Choices
- O(n²) when O(n log n) or O(n) exists
- Repeated computation inside loops
- Memory allocations in hot paths

### Resource Usage
- Unbounded memory growth
- Resource leaks (files, connections)
- Blocking operations on main thread

## Formatting & Style

### Consistency
- Mixed naming conventions
- Inconsistent indentation
- Trailing whitespace

### Language-Specific
- Non-idiomatic patterns
- Deprecated function usage
- Unnecessary type conversions

## Meta-Critiques

### Process Issues
- Commit messages are unclear
- PR is too large for meaningful review
- No linked issue or context

### Scope
- Solution is over-engineered for the problem
- Problem is under-specified
- Changes unrelated to stated goal
