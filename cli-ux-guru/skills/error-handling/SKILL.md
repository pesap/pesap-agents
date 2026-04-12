---
name: error-handling
description: Design helpful error messages, recovery flows, and user guidance for CLI failures
author: pesap
version: "1.0.0"
---

# Error Handling Skill

Creates error messages that teach, guide, and help users recover.

## When to Use

- Writing error messages for CLI failures
- Designing error recovery flows
- Implementing validation and user guidance
- Reviewing error handling in code

## The Formula

Every error message should answer:

1. **What happened?** (The symptom)
2. **Why did it happen?** (The cause)
3. **How do I fix it?** (The solution)

```
✗ Brief error summary

What happened:
  <specific, technical details>

Why it happened:
  <human-friendly explanation>

How to fix it:
  1. <actionable step>
  2. <actionable step>

For more help: <URL or command>
```

## Common Error Types

### Missing Required Input

```
✗ Environment not specified

What happened:
  The --env flag is required but was not provided.

Why it happened:
  Deployments must target a specific environment.

How to fix it:
  1. Specify environment: --env=staging or --env=production
  2. Or set default: myapp config set env staging

For more help: myapp help environments
```

### Invalid Input

```
✗ Invalid port number: 'abc123'

What happened:
  --port expects a number between 1024-65535, got 'abc123'

Why it happened:
  Port numbers must be integers in the valid range.

How to fix it:
  Use a valid port: --port=8080

For more help: myapp help configuration
```

### Permission Denied

```
✗ Cannot write to /var/log/myapp

What happened:
  Permission denied when creating log file

Why it happened:
  Current user lacks write access. Directory owned by 'myapp:adm'.

How to fix it:
  Option 1: Change log directory
    myapp config set log_dir ~/.local/share/myapp/logs

  Option 2: Add user to adm group
    sudo usermod -a -G adm $USER

For more help: myapp help permissions
```

### Network/Connection Error

```
✗ Cannot connect to database

What happened:
  Connection refused to postgres://localhost:5432/myapp

Why it happened:
  Database server not running or not accepting connections.

How to fix it:
  1. Check if PostgreSQL is running:
     sudo service postgresql status

  2. Start PostgreSQL:
     sudo service postgresql start

For more help: myapp help database-connection
```

### Not Found

```
✗ Configuration file not found: ./config.yaml

What happened:
  Expected config.yaml in current directory.

Why it happened:
  The CLI requires a configuration file to run.

How to fix it:
  1. Create from template: myapp init config
  2. Or specify path: myapp --config=/path/to/config.yaml

For more help: myapp help configuration
```

### Unknown Command

```
✗ Unknown command: 'delpoy'

Did you mean 'deploy'?

Available commands:
  deploy    Deploy application
  delete    Delete resources
  describe  Show detailed info
```

## Exit Codes

| Code | Meaning | Use When |
|------|---------|----------|
| 0 | Success | Command completed |
| 1 | General error | Unexpected failure |
| 2 | Misuse | Wrong flags, bad syntax |
| 3 | Config error | Invalid/missing config |
| 126 | Permission denied | Cannot execute |
| 127 | Not found | Missing command/file |
| 130 | Interrupted | Ctrl+C pressed |

## Checklist

- [ ] Error explains what happened (specific)
- [ ] Error explains why it happened (root cause)
- [ ] Error provides fix steps (actionable)
- [ ] Exit code is appropriate for error type
- [ ] Suggestion included when typo suspected
- [ ] Documentation link provided
- [ ] No sensitive data in error messages

## Anti-Patterns

**Bad (vague):**
```
Error: invalid argument
```

**Bad (no fix):**
```
Error: connection refused
```

**Bad (too technical):**
```
Error: HTTP 422 Unprocessable Entity
```

**Good:**
```
✗ Could not create deployment

What happened:
  The deployment configuration is invalid.

Why it happened:
  The 'memory' field must be a number followed by unit (Mi or Gi).

How to fix it:
  Change "memory: 512" to "memory: 512Mi" in config.yaml

For more help: myapp help deployment-config
```
