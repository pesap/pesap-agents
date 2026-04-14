# Memory Hierarchy

## The Principle

Users shouldn't have to tell us what they already told us. But they should be able to override at any time.

```
Explicit Flag > Environment Variable > Config File > Default
     (1)           (2)                    (3)          (4)
```

Lower numbers win. Always.

## Configuration Layers

### Layer 1: Explicit Flags (Highest Priority)

```bash
myapp deploy --environment=production --port=8080
```

**Use for:**
- One-off overrides
- Scripting
- Experimentation
- When the user explicitly wants to deviate

### Layer 2: Environment Variables

```bash
export MYAPP_ENVIRONMENT=production
export MYAPP_PORT=8080
myapp deploy
```

**Use for:**
- CI/CD pipelines
- Container deployments
- Machine-specific settings
- Secrets (though secrets managers are better)

**Naming convention:**
```
<APP_NAME>_<SETTING_NAME>
MYAPP_ENVIRONMENT
MYAPP_DATABASE_HOST
MYAPP_LOG_LEVEL
```

### Layer 3: Config Files

```yaml
# ~/.myapp/config.yaml
environment: staging
port: 3000
database:
  host: localhost
  port: 5432
```

**Use for:**
- User preferences
- Persistent settings
- Project-specific defaults
- Complex nested configuration

**Config file locations (in order of priority):**

| Location | When to Use |
|----------|-------------|
| `./.myapp/config.yaml` | Project-specific settings |
| `~/.myapp/config.yaml` | User defaults |
| `~/.config/myapp/config.yaml` | XDG standard location |
| `/etc/myapp/config.yaml` | System-wide defaults |

### Layer 4: Defaults (Lowest Priority)

Hardcoded in the application:

```python
DEFAULTS = {
    'environment': 'development',
    'port': 8080,
    'log_level': 'info'
}
```

## What to Remember vs. What to Ask

### Always Remember (Config File)

- Authentication tokens (securely stored)
- Default environment preference
- Preferred output format (table/json)
- Editor preference
- Theme/color settings
- Last used project/context

### Remember with Expiry (~30 days)

- Recently used values (for auto-suggest)
- Temporary overrides
- Session context

### Always Ask (Never Remember)

- Passwords
- Secrets
- One-time flags
- Destructive confirmation responses
- PII or sensitive data

## First-Time Experience

### Detection

```bash
$ myapp status

✓ Welcome to MyApp! It looks like this is your first time.

Quick setup (30 seconds):
[1/3] Choose default environment: [development] __
[2/3] Set your editor: [vim] __
[3/3] Enable analytics? [Y/n] __

Configuration saved to ~/.myapp/config.yaml

Run 'myapp setup' anytime for more options.
```

### Migration Path

When adding new required settings to existing installs:

```bash
$ myapp status

⚠ Configuration update needed

New setting 'max_parallel_jobs' required.
Default value: 4
Your current setup: 12 CPU cores detected

Recommended: 8

Accept? [Y/n/custom]: __

# If --yes is used, apply recommended automatically
```

## Context Persistence

### Working Directory Context

```bash
# In ~/projects/website
$ myapp deploy
# Automatically uses 'website' project context

# In ~/projects/api
$ myapp deploy
# Automatically uses 'api' project context
```

Implementation:
```yaml
# ./.myapp/context.yaml
project: website
environment: staging
```

### Session Context

Last-used values for the current shell session:

```bash
$ myapp deploy --environment=staging
# Deploys to staging

$ myapp logs
# Automatically shows staging logs (context preserved)

$ myapp status
# Shows staging status
```

### Explicit Context Override

```bash
# Clear context, start fresh
$ myapp context clear

# Set explicit context
$ myapp context set project=api environment=production

# Show current context
$ myapp context show
Project: api
Environment: production
Region: us-east-1
```

## The 3-Item Rule

Remember the last 3 things. Ask for anything older.

```bash
$ myapp deploy --project=myproject
# Remember: project=myproject

$ myapp logs
# Use remembered project=myproject

$ myapp config get database.host
# Use remembered project=myproject

$ myapp deploy --project=otherproject
# Remember: project=otherproject (shift out myproject)

# After 3 projects remembered, oldest is forgotten
```

## Configuration Inspection

### Show Effective Configuration

```bash
$ myapp config show

Effective configuration (with sources):

environment: production    # from --environment flag
project: website            # from ./.myapp/context.yaml
region: us-east-1           # from ~/.myapp/config.yaml
port: 8080                 # from MYAPP_PORT env var
log_level: info            # from default
```

### List All Config Sources

```bash
$ myapp config sources

Sources (highest priority first):
  1. Command-line flags
  2. Environment variables
  3. ./.myapp/context.yaml (current directory)
  4. ~/.myapp/config.yaml
  5. Built-in defaults
```

## Secrets Management

### Never Store in Plain Text

**Bad:**
```yaml
# ~/.myapp/config.yaml
api_token: "sk_live_12345abcdef"
```

**Good:**
```yaml
# ~/.myapp/config.yaml
api_token_source: keyring
```

### Use System Keyring

```python
import keyring

# Store
token = keyring.get_password("myapp", "api_token")

# Retrieve
keyring.set_password("myapp", "api_token", user_input)
```

### Environment for CI/CD

```bash
# In CI, use environment variable
export MYAPP_API_TOKEN="${API_TOKEN}"

# Or use secrets manager
export MYAPP_API_TOKEN="$(aws secretsmanager get-secret-value ...)"
```

## Configuration Validation

### Validate on Save

```bash
$ myapp config set database.host invalid-url

✗ Invalid configuration

database.host: "invalid-url"
Error: Must be a valid hostname or IP address

Valid examples:
  - localhost
  - db.internal.example.com
  - 192.168.1.100
```

### Validate on Load

```bash
$ myapp status

✗ Configuration error in ~/.myapp/config.yaml

port: "8080"
      ^^^^^
      Expected number, got string

Fix: Remove quotes: port: 8080
```

## Migration and Versioning

### Config Version Header

```yaml
# ~/.myapp/config.yaml
config_version: "2.1"
environment: production
...
```

### Automatic Migration

```bash
$ myapp status

⚠ Configuration format updated (v1.0 → v2.1)

Changes made:
  - database.host → database.hostname (renamed)
  - Removed deprecated: use_ssl flag
  - Added: connection_pool_size (default: 10)

Backup saved to: ~/.myapp/config.yaml.v1.backup
```

## The Override Stack in Practice

### Example Scenario

```bash
# File: ~/.myapp/config.yaml
environment: staging
port: 3000
verbose: false

# File: ./.myapp/context.yaml (in project dir)
environment: development

# Environment
export MYAPP_PORT=8080

# Command
myapp deploy --verbose

# Effective values:
# environment: development  (from context.yaml)
# port: 8080               (from env var, overrides context)
# verbose: true            (from flag, overrides config)
```

## Reset and Cleanup

### Clear All Config

```bash
$ myapp config reset

This will delete all configuration:
  - ~/.myapp/config.yaml
  - ~/.myapp/context.yaml
  - Saved authentication tokens

Are you sure? Type 'RESET' to confirm: __
```

### Clear Project Context

```bash
$ myapp context clear

Cleared project context for /home/user/projects/website
```

### List What We Know

```bash
$ myapp config list

Known contexts:
  /home/user/projects/website  → project: website, env: staging
  /home/user/projects/api      → project: api, env: production

Known projects (7):
  website, api, docs, cli, mobile, analytics, legacy

Remembered values:
  Last editor: vim
  Last environment: staging
  Last 3 projects: api, website, docs
```
