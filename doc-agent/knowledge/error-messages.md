# Error Messages

## The Error Message Formula

Every error message should answer:
1. **What happened?** (The symptom)
2. **Why did it happen?** (The cause)
3. **How do I fix it?** (The solution)

```
✗ <What happened>

What happened:
  <Specific, technical details>

Why it happened:
  <Human-friendly explanation>

How to fix it:
  1. <Actionable step>
  2. <Actionable step>

For more help: <URL or command>
```

## Error Types and Templates

### 1. Missing Required Input

**Bad:**
```
Error: missing flag --env
```

**Good:**
```
✗ Environment not specified

What happened:
  The --env flag is required but was not provided.

Why it happened:
  Deployments must target a specific environment to ensure
  the right configuration is applied.

How to fix it:
  1. Specify environment: --env=staging or --env=production
  2. Or set default in config: myapp config set env staging

For more help: myapp help environments
```

### 2. Invalid Input

**Bad:**
```
Error: invalid argument
```

**Good:**
```
✗ Invalid port number: 'abc123'

What happened:
  The --port flag expects a number, but 'abc123' was provided.

Why it happened:
  Port numbers must be integers between 1024 and 65535.

How to fix it:
  Use a valid port number: --port=8080

Examples:
  myapp serve --port=3000
  myapp serve --port=8080

For more help: myapp help serve
```

### 3. Permission Denied

**Bad:**
```
Error: permission denied
```

**Good:**
```
✗ Cannot write to /var/log/myapp

What happened:
  Permission denied when creating log file /var/log/myapp/app.log

Why it happened:
  The current user 'developer' does not have write access to /var/log/myapp.
  This directory is owned by user 'myapp' and group 'adm'.

How to fix it:
  Option 1 - Change log directory:
    myapp config set log_dir ~/.local/share/myapp/logs

  Option 2 - Add user to group:
    sudo usermod -a -G adm developer
    (Log out and back in for changes to take effect)

  Option 3 - Use elevated permissions (not recommended):
    sudo myapp start

For more help: myapp help permissions
```

### 4. Network/Connection Error

**Bad:**
```
Error: connection refused
```

**Good:**
```
✗ Cannot connect to database

What happened:
  Connection refused to postgres://localhost:5432/myapp

Why it happened:
  The database server is not running or is not accepting connections
  on port 5432.

How to fix it:
  1. Check if PostgreSQL is running:
     sudo service postgresql status
     or: pg_ctl status -D /usr/local/var/postgres

  2. Start PostgreSQL if stopped:
     sudo service postgresql start
     or: pg_ctl start -D /usr/local/var/postgres

  3. Check connection settings:
     myapp config get database.url
     myapp config set database.url postgres://localhost:5432/myapp

For more help: myapp help database-connection
```

### 5. Not Found (File/Resource)

**Bad:**
```
Error: file not found
```

**Good:**
```
✗ Configuration file not found: ./config.yaml

What happened:
  Expected to find config.yaml in current directory, but it doesn't exist.

Why it happened:
  The myapp CLI requires a configuration file to run.

How to fix it:
  1. Create from template:
     myapp init config

  2. Or specify existing config:
     myapp --config=/path/to/config.yaml <command>

  3. Or set via environment:
     export MYAPP_CONFIG=/path/to/config.yaml

For more help: myapp help configuration
```

### 6. Command Not Found

**Bad:**
```
Error: unknown command
```

**Good:**
```
✓ Unknown command: 'delpoy'

Did you mean 'deploy'?

Available commands:
  deploy    Deploy application
  delete    Delete resources
  describe  Show detailed info

See all commands: myapp --help
```

### 7. Rate Limited

**Bad:**
```
Error: rate limit exceeded
```

**Good:**
```
✗ Rate limit exceeded

What happened:
  API rate limit of 100 requests/minute exceeded.
  Current usage: 103 requests in the last 60 seconds.

Why it happened:
  Too many API calls were made in a short time period.

How to fix it:
  1. Wait 47 seconds before retrying
  2. Or upgrade plan for higher limits: myapp account upgrade
  3. Or add caching to reduce API calls

Automatic retry available: myapp deploy --retry-after-rate-limit
```

### 8. Validation Error (Multiple Issues)

**Bad:**
```
Error: validation failed
```

**Good:**
```
✗ Configuration validation failed (3 errors)

Errors:
  1. database.host: Required field missing
     → Add to config.yaml: host: localhost

  2. api.timeout: Invalid value 'fast'
     → Must be a number in milliseconds (e.g., timeout: 5000)

  3. features[2]: Unknown feature 'beta-flag'
     → Valid features: caching, logging, metrics

Fix these issues and run 'myapp validate' to verify.

For more help: myapp help configuration-format
```

## Error Message Writing Guide

### Use Active Voice

**Bad:** "The file was not found"
**Good:** "Cannot find the file"

### Be Specific

**Bad:** "Invalid input"
**Good:** "Expected a date in YYYY-MM-DD format, got '2024/13/45'"

### Suggest Next Steps

Every error should leave the user knowing what to do next.

### Include Context

Show the user what the system saw:

```
✗ No such file: ./src/components/Button.tsx

Current directory: /home/user/projects/website
Files here:
  src/
  components/
  README.md

Did you mean: ./components/Button.tsx ?
```

### Distinguish User vs System Errors

**User error** (fixable by user):
```
✗ Invalid JSON in config.yaml at line 42
```

**System error** (temporary, retry):
```
✗ Service temporarily unavailable (try again in 30 seconds)
```

**Bug** (needs report):
```
✗ Unexpected error occurred

This appears to be a bug. Please report it:
  myapp bug-report --include-logs

Error ID: err_abc123xyz (include this in your report)
```

## Exit Codes

Use standard exit codes:

| Code | Meaning | When to Use |
|------|---------|-------------|
| 0 | Success | Command completed as expected |
| 1 | General error | Catch-all for unexpected failures |
| 2 | Misuse of command | Wrong flags, bad syntax |
| 3 | Config error | Invalid or missing configuration |
| 126 | Permission denied | Cannot execute due to permissions |
| 127 | Not found | Command or file doesn't exist |
| 130 | Ctrl+C | User interrupted |
| 137 | SIGKILL | Process killed (often OOM) |

Always document non-zero exit codes in help text.

## Error Aggregation

For batch operations, summarize failures:

```
✓ Operation complete with warnings

Results:
  245 files processed successfully
  2 files failed

Failures:
  1. /path/to/file.txt
     Error: Permission denied
     Fix: chmod 644 /path/to/file.txt

  2. /another/file.txt
     Error: File too large (>100MB)
     Fix: Use --large-files flag or split the file

All errors saved to: /tmp/myapp-errors-20240115.log
```

## Error Recovery Hints

When suggesting fixes, consider:

1. **Most common fix first** (80% of cases)
2. **Quick fixes** (one-liners)
3. **Documentation reference** (for complex issues)
4. **Support channel** (for unknown issues)

Always validate that your suggestions actually work before displaying them.
