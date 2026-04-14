---
name: output-formatting
description: Format CLI output including tables, progress indicators, JSON, and human-readable text
author: pesap
version: "1.0.0"
---
# Output Formatting Skill

Creates clear, structured CLI output that works for both humans and machines.

## When to Use

- Designing command output format
- Creating progress indicators
- Building table or list displays
- Implementing structured output modes (JSON, CSV)

## Instructions
1. Confirm the task matches this skill and identify the concrete files, outputs, or decisions it should guide.
2. Apply the domain-specific guidance and checklists below, favoring the simplest sound approach.
3. Return concrete findings or edits with rationale, and include file references when applicable.

## Capabilities

### Progress Indicators

**Spinner (indeterminate):**
```
Uploading large-file.zip... ⠋
```
Use when duration is unknown (network calls, API requests).

**Progress bar (determinate):**
```
Processing 1,247 records... [████████████████░░░░] 78% (974/1,247) ETA 0:12
```
Format: `<action> [bar] XX% (<current>/<total>) ETA <time>`

**Multi-step progress:**
```
[1/4] Building image...        ✓ 2.3s
[2/4] Pushing to registry...     ✓ 8.1s
[3/4] Updating deployment...   ⠋ 4.2s
```

### Tables

**Compact (default):**
```
NAME        STATUS    VERSION   AGE
web         Running   v1.2.3    5m
api         Running   v1.2.3    5m
worker      Pending   v1.2.3    2m
```

**Rules:**
- Left-align text, right-align numbers
- Headers in UPPERCASE or Title Case
- At least 2 spaces between columns
- Max width: 80 columns default, respect terminal width

**Full/bordered (--verbose):**
```
┌────┬─────────┬─────────┬─────────┐
│ ID │ NAME    │ STATUS  │ VERSION │
├────┼─────────┼─────────┼─────────┤
│ 1  │ web     │ running │ 1.2.3   │
│ 2  │ api     │ running │ 1.2.3   │
└────┴─────────┴─────────┴─────────┘
```

### Structured Output

**JSON (--json):**
```json
{
  "status": "success",
  "data": {
    "items": [...]
  },
  "meta": {
    "total": 50,
    "page": 1
  }
}
```
Always pretty-print with 2-space indent.

**CSV (--csv):**
```csv
id,name,status
1,web,running
2,api,running
```

### Colors

| Color | Use |
|-------|-----|
| Red | Errors, failures |
| Yellow | Warnings, in-progress |
| Green | Success, running |
| Blue | Info, hints |
| Gray | Secondary, timestamps |

**Always respect:**
- `NO_COLOR` environment variable
- `--no-color` flag
- Non-TTY detection (no color when piped)

### Success/Error Messages

**Success:**
```
✓ Deployment complete
  URL: https://app.example.com
  Duration: 23.1s
```

**Error (4-part structure):**
```
✗ Brief error summary

What happened:
  <specific details>

Why it happened:
  <explanation>

How to fix it:
  1. <actionable step>
  2. <actionable step>
```

## Checklist

- [ ] Progress shown for operations >1 second
- [ ] Table columns sized for readability (min 80 cols)
- [ ] JSON output available with --json
- [ ] Colors are semantic and respect NO_COLOR
- [ ] Error messages explain what, why, and how to fix
- [ ] Piped output is parseable (no colors, no progress spinners)
