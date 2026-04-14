# CLI Design Principles

## The 4 Pillars of CLI UX

### 1. Visibility of System Status

Always tell the user what's happening.

**Good:**
```
$ deploy --env=production
Checking configuration... ✓
Connecting to production cluster... ✓
Validating permissions... ✓
Deploying 3 services... [████████░░] 67%
```

**Bad:**
```
$ deploy --env=production
[waits 30 seconds with no output]
Done.
```

### 2. Match Between System and Real World

Use concepts users know. Speak their language.

**Good:**
```
$ git switch feature-branch
Switched to branch 'feature-branch'
Your branch is up to date with 'origin/feature-branch'.
```

**Bad:**
```
$ git checkout -b feature-branch
HEAD is now at 4a4204b... feat: major refactor with knowledge bases
```

### 3. User Control and Freedom

Provide escape hatches. Make it easy to undo.

**Required flags:**
- `--dry-run` / `--preview`: Show what would happen without doing it
- `--yes` / `--force`: Skip confirmations (for scripting)
- `--verbose` / `-v`: Show detailed progress
- `--quiet` / `-q`: Minimal output (for piping)

### 4. Error Prevention and Recovery

Good UX prevents errors. Great UX helps recover from them.

**Good error message format:**
```
ERROR: Could not connect to database

What happened:
  Connection refused to postgres://localhost:5432/myapp

Why it happened:
  The database server is not running on port 5432.

How to fix it:
  1. Start PostgreSQL: sudo service postgresql start
  2. Or specify a different host: --db-host=production.db.internal
  3. Or check your connection string in ~/.myapp/config.yaml

For more help: myapp help database-connection
```

## Command Structure Patterns

### Noun-Verb (Git-style)
```
<tool> <noun> <verb> [flags]

gh repo clone owner/repo
kubectl pods list
```

### Verb-Noun (AWS-style)
```
<tool> <verb> <noun> [flags]

aws s3 cp file.txt s3://bucket/
az storage blob upload
```

**Rule:** Pick one and be consistent. Noun-verb is more discoverable.

## Flag Design

### Short vs Long Flags

| Use short (`-x`) when | Use long (`--xxx`) when |
|----------------------|------------------------|
| Common operation | Rare or dangerous operation |
| User types it often | Scripts read it |
| No ambiguity possible | Clarity matters more than speed |

### Boolean Flags

**Good:**
```bash
--watch        # implies true, no value needed
--no-watch     # explicit false
--watch=false  # also valid
```

**Bad:**
```bash
--watch true   # requires parsing ambiguity
--watch=1      # inconsistent
```

### Arguments vs Flags

- **Arguments** = The thing being operated on (often positional)
- **Flags** = How to operate on it (always named)

**Good:**
```bash
cp source.txt dest.txt          # arguments: what to copy
chmod +x script.sh             # flag: how to change
deploy --env=production app    # argument: what; flag: where
```

## Output Philosophy

### Human-Readable is Default

```bash
# Default: pretty, colorized, table output
$ kubectl get pods
NAME      READY   STATUS    RESTARTS   AGE
nginx     1/1     Running   0          5m
redis     1/1     Running   0          5m

# Machine-readable when asked
$ kubectl get pods -o json
{"items": [...]}
```

### The 3 Output Modes

Every command should support:

1. **Default** (`stdout` is TTY): Human-friendly, colors, tables
2. **Piped** (`stdout` is pipe): Plain text, parseable
3. **Explicit** (`--json`, `--csv`): Structured, stable format

## Confirmation Patterns

### When to Ask

- Destructive operations (delete, drop, purge)
- Operations affecting many resources
- Operations in production environments
- Operations that cost money

### How to Ask

**Good:**
```
This will delete 47 files in production. Are you sure?
Type 'yes' to continue: __
```

**Better (with --yes):**
```
This will delete 47 files in production. Are you sure?
Type 'yes' to continue, or use --yes to skip this check: __
```

**Bad:**
```
Proceed? [Y/n]  # unclear what happens with 'n'
```

## Help Text Structure

```
NAME:
   myapp deploy - Deploy an application to a cloud environment

USAGE:
   myapp deploy [command options] <app-name>

DESCRIPTION:
   Deploys the specified application to the target environment.
   Builds the container image, pushes to registry, and updates
   the deployment with zero-downtime rollout.

OPTIONS:
   --env value, -e value     Target environment (default: "staging")
   --version value           Version to deploy (default: current git SHA)
   --wait                    Block until deployment completes (default: true)
   --no-wait                 Exit immediately after triggering deploy
   --verbose, -v             Show detailed progress
   --dry-run                 Show what would be deployed without doing it

EXAMPLES:
   # Deploy current app to staging
   myapp deploy myapp

   # Deploy specific version to production
   myapp deploy myapp --env=production --version=v1.2.3

   # Preview changes without deploying
   myapp deploy myapp --env=production --dry-run

ENVIRONMENT VARIABLES:
   MYAPP_TOKEN    API authentication token (required)
   MYAPP_DEBUG    Set to "1" for debug output

SEE ALSO:
   myapp logs, myapp status, myapp rollback
```

## Anti-Patterns

### The Silent Success
```bash
$ dangerous-operation
$              # Nothing happened? Everything worked? Who knows!
```

### The Wall of Text
```bash
$ verbose-command
[500 lines of internal debugging nobody asked for]
```

### The Cryptic Error
```bash
$ myapp deploy
ERROR: exit code 137
```

### The Mystery Meat
```bash
$ myapp
usage: myapp [-h] {cmd1,cmd2,cmd3} ...
# No description of what cmd1, cmd2, or cmd3 do
```

### The Modal Dialog
```bash
$ myapp backup
Backing up database...
[blocked for 10 minutes with no progress indication]
```
