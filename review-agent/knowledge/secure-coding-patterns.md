# Secure Coding Patterns

## Input Validation
- Validate on server side, never trust client input
- Use allowlists rather than denylists
- Validate type, length, format, and range
- Sanitize before use in queries, commands, or output

## Output Encoding
- HTML encode all user data in HTML context
- JavaScript encode in JS context
- URL encode in URL context
- CSS encode in style context

## Parameterized Queries
```python
# Good
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))

# Bad
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
```

## Secrets Management
- Never hardcode credentials
- Use environment variables or secret stores
- Rotate credentials regularly
- Audit access to secrets

## Authentication Best Practices
- Use established libraries (don't roll your own auth)
- Implement proper session management
- Use secure, httpOnly, SameSite cookies
- Enforce password complexity and MFA
