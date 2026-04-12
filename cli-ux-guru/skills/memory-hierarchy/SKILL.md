---
name: memory-hierarchy
description: Design configuration persistence, context management, and the balance between remembering and asking
author: pesap
version: "1.0.0"
---

# Memory Hierarchy Skill

Manages what the CLI remembers vs. what it asks, balancing convenience with explicit control.

## The Principle

```
Explicit Flag > Environment Variable > Config File > Default
     (1)           (2)                    (3)          (4)
```

Lower numbers win. Always.

## When to Use

- Designing configuration systems
- Deciding what to persist vs. ask
- Planning configuration file locations
- Managing context and defaults

## Configuration Layers

### Layer 1: Explicit Flags

Highest priority. Always wins.

```bash
myapp deploy --environment=production --port=8080
```

Use for: one-off overrides, scripting, experimentation.

### Layer 2: Environment Variables

```bash
export MYAPP_ENVIRONMENT=production
myapp deploy
```

Naming: `MYAPP_<SETTING>`

Use for: CI/CD, containers, machine-specific settings.

### Layer 3: Config Files

Locations (priority order):
1. `./.myapp/config.yaml` (project-specific)
2. `~/.myapp/config.yaml` (user defaults)
3. `~/.config/myapp/config.yaml` (XDG standard)
4. `/etc/myapp/config.yaml` (system-wide)

Use for: user preferences, persistent settings.

### Layer 4: Defaults

Hardcoded in application. Always available.

## What to Remember

### Always Remember (Config File)

- Authentication tokens (securely stored)
- Default environment/project
- Output format preference
- Editor preference
- Theme settings

### Remember with Expiry (~30 days)

- Recently used values (for suggestions)
- Temporary context
- Session state

### Never Remember

- Passwords
- Secrets
- One-time flags
- Confirmation responses
- Sensitive data

## Context Persistence

### Working Directory Context

```yaml
# ./.myapp/context.yaml
project: website
environment: staging
```

Commands automatically use context:
```bash
cd ~/projects/website
myapp deploy  # Uses website project, staging env
```

### The 3-Item Rule

Remember last 3 things. Ask for anything older.

```bash
myapp deploy --project=website   # Remember
myapp logs                         # Use: website
myapp deploy --project=api         # Remember, shift out website
```

## First-Time Setup

```bash
$ myapp status

✓ Welcome! It looks like this is your first time.

Quick setup (30 seconds):
[1/3] Default environment: [development] __
[2/3] Preferred editor: [vim] __
[3/3] Enable analytics? [Y/n] __

Saved to ~/.myapp/config.yaml
```

## Inspection Commands

### Show Effective Config

```bash
$ myapp config show

environment: production    # from --environment flag
project: website            # from ./.myapp/context.yaml
port: 8080                 # from MYAPP_PORT env var
log_level: info            # from default
```

### List Sources

```bash
$ myapp config sources

1. Command-line flags
2. Environment variables
3. ./.myapp/context.yaml
4. ~/.myapp/config.yaml
5. Built-in defaults
```

## Checklist

- [ ] Priority order is: flags > env > config > defaults
- [ ] Config file location is appropriate (project vs user vs system)
- [ ] Environment variables follow `APP_SETTING` naming
- [ ] Secrets stored securely (keyring, not plain text)
- [ ] First-time setup is guided and brief
- [ ] Context is saved per working directory
- [ ] Users can inspect effective configuration
- [ ] Users can clear/reset configuration

## Anti-Patterns

- **Storing secrets in plain text** - Use system keyring
- **Endless config files** - One file per scope, clearly documented
- **Mystery defaults** - Show where values come from
- **Unchangeable defaults** - Every default should be overrideable
- **No escape hatch** - Always support --config=/path/to/override.yaml
