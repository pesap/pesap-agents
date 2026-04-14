# Output Patterns

## Progress Indicators

### When to Show Progress

- Operations taking > 1 second
- Multi-step operations
- Network or I/O bound tasks
- Batch operations with multiple items

### Spinner (Indeterminate)

For operations with unknown duration:

```
Uploading large-file.zip... ⠋
```

**Characteristics:**
- Use for network uploads, API calls, or unknown workloads
- Always include text explaining what's happening
- Stop immediately on completion or error

### Progress Bar (Determinate)

For operations with known total:

```
Processing 1,247 records... [████████████████░░░░] 78% (974/1,247) ETA 0:12
```

**Format:**
```
<action> [████████░░] XX% (<current>/<total>) ETA <time>
```

**Rules:**
- Show current/total counts
- Show ETA when calculable
- Update at most 10 times per second (no flickering)
- Use ░ for incomplete, █ for complete, or █ for both with color
- Width: 20-40 characters for the bar

### Multi-Step Progress

For operations with distinct phases:

```
$ deploy --env=production
[1/4] Building container image...        ✓ 2.3s
[2/4] Pushing to registry...             ✓ 8.1s
[3/4] Updating deployment...             ✓ 1.2s
[4/4] Waiting for health checks...       ✓ 12.5s

Deploy complete! 4 steps in 23.1s
```

**Format:**
```
[<current>/<total>] <step description>... <status> <time>
```

**Status indicators:**
- `⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏` (spinner) = in progress
- `✓` = complete
- `✗` = failed
- `⚠` = completed with warnings

## Table Output

### When to Use Tables

- List output (> 3 columns)
- Comparing multiple items
- Mixed data types per row

### Table Design

```
NAME        STATUS    VERSION   UPTIME    MEMORY
deployment  Running   v1.2.3    3d 4h     128Mi
worker      Running   v1.2.3    3d 4h     256Mi
scheduler   Pending   v1.2.3    -         -
```

**Rules:**
- Headers in UPPERCASE or Title Case, clearly separated
- Left-align text, right-align numbers
- Truncate long text with ellipsis, never wrap
- Minimum column width: 3 characters
- Maximum total width: 80 columns (or terminal width)
- Add spacing between columns: at least 2 spaces

### Compact vs Full Tables

**Compact** (default for lists):
```
ID    NAME       STATUS
1     web        running
2     api        running
3     worker     stopped
```

**Full** (with `--verbose`):
```
┌────┬─────────┬─────────┬─────────────────┬─────────────────────────────┐
│ ID │ NAME    │ STATUS  │ VERSION         │ CREATED                     │
├────┼─────────┼─────────┼─────────────────┼─────────────────────────────┤
│ 1  │ web     │ running │ 1.2.3+4a4204b   │ 2024-01-15 09:23:41 UTC     │
│ 2  │ api     │ running │ 1.2.3+4a4204b   │ 2024-01-15 09:23:45 UTC     │
│ 3  │ worker  │ stopped │ 1.2.1+e9cf5ed   │ 2024-01-10 14:11:22 UTC     │
└────┴─────────┴─────────┴─────────────────┴─────────────────────────────┘
```

## Structured Output

### JSON (Default for --json)

```json
{
  "status": "success",
  "data": {
    "deployments": [
      {
        "id": "1",
        "name": "web",
        "status": "running",
        "version": "1.2.3+4a4204b",
        "created_at": "2024-01-15T09:23:41Z"
      }
    ]
  },
  "meta": {
    "total": 3,
    "page": 1,
    "per_page": 20
  }
}
```

**Rules:**
- Always pretty-print with 2-space indent
- Use ISO 8601 for dates
- Use snake_case for keys
- Include metadata (pagination, totals)
- Wrap in status/data/meta envelope

### CSV (Default for --csv)

```csv
id,name,status,version,created_at
1,web,running,1.2.3+4a4204b,2024-01-15T09:23:41Z
2,api,running,1.2.3+4a4204b,2024-01-15T09:23:45Z
```

**Rules:**
- Include header row
- Quote fields containing commas
- Use UTF-8 encoding
- Unix line endings (LF)

## Color Usage

### Semantic Colors

| Color | Use | Example |
|-------|-----|---------|
| Red | Errors, failures, destructive | ✗ Failed, 42 errors |
| Yellow | Warnings, pending, in-progress | ⚠ Warning, ⠋ Loading |
| Green | Success, running, complete | ✓ Complete, 12 passed |
| Blue | Info, help, hints | ℹ Tip, → Next step |
| Magenta | Accent, brand elements | Prompt prefix |
| Cyan | Links, emphasis | https://example.com |
| Gray/Dim | Secondary, timestamps, metadata | (2.3s), --optional |
| White/Bold | Primary content, headers | NAME, STATUS |

### When NOT to Use Color

- When `NO_COLOR` environment variable is set
- When `stdout` is not a TTY (piped)
- When `--no-color` flag is provided
- For content that might be logged to files

### Color Fallbacks

Always provide non-color indicators:

```
[OK] instead of green checkmark
[FAIL] instead of red X
[WARN] instead of yellow warning
[INFO] instead of blue info
```

## Log Output

### Timestamp Format

```
2024-01-15 14:23:41 INFO  Starting deployment
2024-01-15 14:23:42 DEBUG Connecting to registry
```

Format: `YYYY-MM-DD HH:MM:SS LEVEL Message`

### Log Levels

- **ERROR**: Fatal or blocking issues requiring user action
- **WARN**: Non-fatal issues, deprecated features, recoverable errors
- **INFO**: Normal operation progress (default level)
- **DEBUG**: Detailed internal state (for troubleshooting)
- **TRACE**: Very detailed flow (rarely used)

### Structured Logging (JSON)

```json
{
  "timestamp": "2024-01-15T14:23:41Z",
  "level": "INFO",
  "message": "Starting deployment",
  "component": "deploy",
  "request_id": "req_123abc",
  "data": {
    "app": "myapp",
    "version": "1.2.3"
  }
}
```

## Success and Error Output

### Success Messages

**Simple:**
```
✓ Deployment complete
```

**With details:**
```
✓ Successfully deployed myapp v1.2.3 to production
  URL: https://myapp.example.com
  Duration: 23.1s
  Logs: myapp logs --env=production
```

**Batch:**
```
✓ Processed 247 files
  245 succeeded
  2 skipped (already up to date)
```

### Error Output

**Format:**
```
✗ <Brief error summary>

What happened:
  <Specific details>

Why it happened:
  <Root cause explanation>

How to fix it:
  1. <Step one>
  2. <Step two>

For more help: <command or URL>
```

**Example:**
```
✗ Could not deploy to production

What happened:
  Failed to connect to Kubernetes cluster 'prod-us-east'
  Error: connection refused to https://k8s.prod.example.com

Why it happened:
  Your VPN connection is required to access production infrastructure.

How to fix it:
  1. Connect to VPN: vpn-connect prod
  2. Verify connection: kubectl cluster-info
  3. Retry deployment: myapp deploy --env=production

For more help: myapp help network-issues
```

## Interactive Output

### Prompts

**Standard prompt:**
```
Enter your API key: __
```

**With default:**
```
Enter port (default: 8080): __
```

**With validation hint:**
```
Enter port (1024-65535, default: 8080): __
```

**Confirmation:**
```
Delete 47 files permanently? Type 'yes' to confirm: __
```

### Selection (Arrow key navigation)

```
Select environment:
  > staging
    production
    development
```

### Multi-select

```
Select services to restart (space to toggle, enter to confirm):
  [✓] web-server
  [ ] api-server
  [✓] worker-queue
  [ ] database
```

## Output Width Guidelines

| Context | Target Width |
|---------|-------------|
| Default tables | 80 columns |
| Verbose tables | Terminal width |
| JSON | No limit (pretty-printed) |
| Error messages | 80 columns, wrapped |
| Progress bars | 40-60 characters |
| Help text | 80 columns |

**Respect terminal width:**
- Check `$COLUMNS` or use terminal detection
- Minimum supported: 40 columns
- Optimal: 80 columns
- Maximum readability: 120 columns
