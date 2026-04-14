# Interactive Patterns

## When to Be Interactive

**Always interactive:**
- First-time setup (wizard)
- Destructive operations requiring confirmation
- Operations with irreversible side effects
- When input is ambiguous and needs clarification

**Sometimes interactive (with --interactive flag):**
- Long-running operations needing progress confirmation
- Batch operations where some items need review
- Configuration that might have multiple valid options

**Never interactive:**
- Scripting contexts (`--yes` should always work)
- CI/CD environments
- When piped or redirected
- Performance-critical operations

## Prompts

### Basic Prompt

```
Enter API key: __
```

### With Default Value

```
Enter port (default: 8080): __
```

User presses Enter → uses default.

### With Validation Hint

```
Enter port (1024-65535, default: 8080): __
```

### Secure Input (Hidden)

```
Enter password: __
```

Input should not be echoed (use `stty -echo` or equivalent).

### Multi-line Input

```
Enter description (press Ctrl+D when done):
> __
```

Or use temp file:
```
$ myapp create-issue --description="$(cat issue.md)"
```

## Confirmations

### Simple Yes/No

**For non-destructive operations:**
```
Continue? [Y/n] __
```
- Default is Yes (capital Y)
- Enter = Yes
- y = Yes
- n = No

**For destructive operations:**
```
Delete production database? Type 'yes' to confirm: __
```
- Must type exact word
- No default
- Prevents accidental Enter press

### With Consequences

```
This will:
  - Delete 47 files permanently
  - Remove user 'jsmith' and all their data
  - Cannot be undone

Are you sure? Type 'DELETE 47 FILES' to confirm: __
```

### Selective Confirmation

```
Found 12 items to update. Review each?

[Y]es - Review and confirm each item
[n]o - Update all without review
[d]ry-run - Show what would be updated
[c]ancel - Abort operation

Your choice [Y/n/d/c]: __
```

## Wizards

### First-Time Setup Wizard

```
$ myapp setup

Welcome to MyApp! Let's get you configured.

[1/5] Select your environment
  → development (local development)
    staging (pre-production testing)
    production (live environment)

[2/5] Enter API endpoint
  Default: https://api.myapp.com
  URL: [https://api.myapp.com] __

[3/5] Authentication
  How do you want to authenticate?
  → API token (recommended)
    OAuth (web flow)
    Username/password

[4/5] API token
  Get your token at: https://myapp.com/settings/tokens
  Token: __ [hidden]

  ✓ Token validated successfully!

[5/5] Default project
  Recent projects:
    1. website-redesign
    2. api-v2
    3. Create new project

  Default: [1] __

Setup complete! Configuration saved to ~/.myapp/config.yaml

Next steps:
  myapp status     Check connection
  myapp projects   List your projects
  myapp help       View all commands
```

### Wizard Principles

1. **Show progress** (step X of Y)
2. **Allow exit** (Ctrl+C at any time, save partial progress)
3. **Validate early** (check token works before proceeding)
4. **Explain why** (each question should have context)
5. **Suggest defaults** (optimize for common case)
6. **Link to docs** (for complex decisions)
7. **Confirm save location** (be transparent about files created)

## Selection Interfaces

### Single Select (Arrow keys)

```
Select deployment environment:

  → staging
    production
    development

Use ↑/↓ to navigate, Enter to select
```

### Multi-Select (Space to toggle)

```
Select services to restart:

  [✓] web-server     Running, healthy
  [ ] api-server     Running, healthy
  [✓] worker-queue   Running, 2 pending jobs
  [ ] database       Running, 1 active connection
  [✓] cache          Running, healthy

  Toggle: Space  Confirm: Enter  Cancel: Ctrl+C
```

### With Preview

```
Select file to view:

  > config.yaml          │ Preview:
    README.md            │ database:
    src/                 │   host: localhost
    package.json         │   port: 5432
                         │ cache:
                         │   enabled: true
                         │

  ↑/↓ to select, Enter to open, q to quit
```

## Progress with Interaction

### Pause for Review

```
Deploying to production...

[1/3] Database migrations... ✓
[2/3] Service updates...    ✓
[3/3] Smoke tests...        ✓

All tests passed. Continue with traffic shift?

[Y]es - Shift traffic to new deployment
[n]o - Keep current deployment
[r]ollback - Revert changes

Your choice [Y/n/r]: __
```

### Interactive Batch

```
Processing 15 files...

[1/15] document.txt
       Action: Update metadata
       [Y]es  [n]o  [s]kip  [a]ll  [q]uit

       Your choice: y ✓

[2/15] image.png
       Action: Compress and reupload
       [Y]es  [n]o  [s]kip  [a]ll  [q]uit

       Your choice: a  (applying to remaining 13 files)

[15/15] ... ✓

Complete: 14 updated, 1 skipped
```

## Auto-Suggest and Completion

### Command Suggestions

```
$ myapp delpoy
✗ Unknown command: 'delpoy'

Did you mean:
  1. deploy    Deploy application
  2. delete    Delete resources
  3. describe  Show detailed info

Run 'myapp --help' to see all commands.
```

### Flag Suggestions

```
$ myapp deploy --enviroment=staging
✗ Unknown flag: '--enviroment'

Did you mean '--environment'?

Usage: myapp deploy --environment=<value>
```

### Fish-Style Completions

```
$ myapp deploy --env=<TAB>

--environment=development   Local development environment
--environment=staging       Pre-production testing
--environment=production    Live production environment
```

## Contextual Help

### Inline Hints

```
$ myapp create
? What type of resource?
  (Use arrow keys, type to filter)
  ❯ service     - Long-running web service
    job         - One-time batch process
    cronjob     - Scheduled recurring task
    ingress     - HTTP routing rules

  Press ? for more details on each type
```

### Detailed Help on Demand

```
? What type of resource? service

────────────────────────────────────────
SERVICE

A long-running process that responds to requests.

Examples:
  - Web application (HTTP API, website)
  - gRPC service
  - Worker that processes a queue

Required configuration:
  - port: Which port to expose
  - image: Container image to run

Documentation: https://docs.myapp.com/service
────────────────────────────────────────

Press Enter to select, or Esc to go back
```

## Graceful Degradation

### Detecting Non-Interactive Mode

```python
import sys

if not sys.stdin.isatty():
    # Non-interactive (piped, CI, script)
    use_defaults = True
    require_all_flags = True
```

```bash
# Check if terminal is interactive
if [ -t 0 ] && [ -t 1 ]; then
    # Interactive
else
    # Non-interactive
fi
```

### Providing Escape Hatches

Every interactive prompt should have:

1. **--yes / -y** → Accept all defaults, skip confirmations
2. **--dry-run** → Show what would happen, don't ask
3. **--config file.yaml** → Answer all questions via file
4. **--quiet / -q** → No interactive output at all
5. **--non-interactive** → Fail if input is needed

### Example: Full Non-Interactive Mode

```bash
# Works in CI/CD without any prompts
$ myapp deploy \
    --yes \
    --environment=production \
    --version=v1.2.3 \
    --non-interactive

# Fails immediately if any required input is missing
# Returns non-zero exit code on any issue
```

## Keyboard Shortcuts

Standard shortcuts for interactive sessions:

| Key | Action |
|-----|--------|
| ↑/↓ or j/k | Navigate options |
| Enter | Confirm selection |
| Space | Toggle checkbox |
| q or Ctrl+C | Quit/Cancel |
| ? | Show help |
| / | Search/Filter |
| Esc or Ctrl+[ | Go back |
| Tab | Next field |
| Ctrl+A | Select all (multi-select) |
| Ctrl+D | Done (multi-line input) |

## Accessibility

### Screen Reader Support

- Use semantic markup (not just ASCII art)
- Announce state changes
- Read prompts aloud completely before waiting for input
- Avoid pure visual indicators alone

### Color Blindness

- Don't rely solely on color (red/green)
- Use ✓/✗/⚠ symbols in addition to color
- High contrast mode support

### Cognitive Load

- One question at a time
- Clear, short labels
- Explain jargon
- Allow review before commit
- Show what changed (diffs) when appropriate
