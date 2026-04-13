# Contributing to pesap/agents

These agents are designed to be loaded by [pi.dev](https://github.com/badlogic/pi-mono) via `/gitagent load <agent-name>`.

The pi extension (`extensions/`) handles all agent loading — no Python code needed.

## Validating Agents

Before submitting a PR, ensure all agents validate:

```bash
python3 scripts/validate.py
```

## Creating a New Agent

1. Create a new directory: `mkdir my-agent`
2. Add required files:
   - `agent.yaml` — Agent specification (see schema in `schemas/agent-schema.json`)
   - `SOUL.md` — Personality and expertise
   - `RULES.md` — Constraints and guidelines
   - `README.md` — Documentation
   - `skills/<skill-name>/SKILL.md` — Skill definitions
3. Run validation: `python3 scripts/validate.py`
4. Test loading in pi: `/gitagent load my-agent`

### Agent Structure

```
my-agent/
├── agent.yaml          # Required: spec, model, skills
├── SOUL.md             # Required: personality, expertise
├── RULES.md            # Required: constraints
├── README.md           # Required: documentation
├── skills/             # Optional: skill modules
│   └── my-skill/
│       └── SKILL.md
└── knowledge/          # Optional: reference docs
    └── reference.md
```

### agent.yaml Template

```yaml
spec_version: "0.1.0"
name: my-agent
version: 1.0.0
description: A brief description of what this agent does
author: your-name
license: MIT
model:
  preferred: claude-sonnet-4-5-20250929
  fallback:
    - claude-haiku-4-5-20251001
  constraints:
    temperature: 0.2
    max_tokens: 8192
skills:
  - my-skill
pi:
  scope: project
  tools: "read,bash"
runtime:
  max_turns: 30
  timeout: 300
metadata:
  category: general
  feedback_memory_hook:
    enabled: true
    min_confidence: 0.9
    max_chars: 220
    redact_sensitive: true
tags:
  - category
```

### SKILL.md Template

```markdown
---
name: my-skill
description: What this skill does
license: MIT
metadata:
  author: your-name
  version: "1.0.0"
  category: general
---

# My Skill

## When to Use

Describe when this skill should be activated.

## Instructions

Provide detailed instructions for the agent.
```

## Submitting Changes

1. Create a new branch for your changes
2. Make your changes and add tests if applicable
3. Run validation: `python3 scripts/validate.py`
4. Commit with a clear message
5. Push and create a Pull Request

## Questions?

Open an issue if you have questions or need help.
