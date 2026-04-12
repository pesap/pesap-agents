---
name: cli-design
description: Core CLI interface design patterns, command structure, and user interaction flow
author: pesap
version: "1.0.0"
---

# CLI Design Skill

Designs command-line interfaces optimized for clarity, efficiency, and user understanding.

## When to Use

- Creating new CLI commands or subcommands
- Refactoring existing CLI structure
- Designing argument and flag schemes
- Planning command hierarchies (noun-verb vs verb-noun)

## Capabilities

### Command Structure Design

**Noun-Verb Pattern (recommended):**
```
<tool> <resource> <action> [flags]

Examples:
  gh repo clone owner/repo
  kubectl pods list --namespace=production
  myapp deploy --env=staging
```

**Verb-Noun Pattern:**
```
<tool> <action> <resource> [flags]

Examples:
  aws s3 cp local.txt s3://bucket/
  az storage blob upload
```

**Rules:**
- Pick one pattern and use it consistently
- Noun-verb is more discoverable (what do I want to work with?)
- Group related commands under nouns

### Flag Design

**Boolean flags:**
```yaml
# Good
--watch              # implies true
--no-watch           # explicit false
--watch=false        # explicit false

# Bad
--watch true         # ambiguous parsing
```

**Required vs optional:**
- Required: positional argument or required flag with no default
- Optional: flag with sensible default or --flag/--no-flag pattern

**Naming conventions:**
- Use kebab-case: `--max-connections`, not `--maxConnections` or `--max_connections`
- Short flags for common operations: `-v`, `-f`
- Long flags for clarity: `--verbose`, `--force`

### Help Text Structure

```
NAME:
   myapp deploy - Deploy application to cloud environment

USAGE:
   myapp deploy [command options] <app-name>

DESCRIPTION:
   Deploys the specified application with zero-downtime rollout.
   Builds container image, pushes to registry, and updates deployment.

OPTIONS:
   --env, -e           Target environment (default: "staging")
   --version           Version to deploy (default: current git SHA)
   --wait              Block until complete (default: true)
   --no-wait           Exit immediately after triggering
   --verbose, -v       Show detailed progress
   --dry-run           Preview changes without applying

EXAMPLES:
   # Deploy to staging
   myapp deploy myapp

   # Deploy specific version to production
   myapp deploy myapp --env=production --version=v1.2.3

ENVIRONMENT VARIABLES:
   MYAPP_TOKEN         API authentication token
   MYAPP_DEBUG         Set to "1" for debug output

SEE ALSO:
   myapp logs, myapp status, myapp rollback
```

## Checklist

- [ ] Command name is clear and consistent with others
- [ ] Arguments vs flags appropriately chosen
- [ ] Help text includes examples
- [ ] Environment variables documented
- [ ] Related commands cross-referenced
- [ ] Defaults are sensible
- [ ] Escape hatches provided (--dry-run, --yes, --verbose)

## Anti-Patterns to Avoid

1. **Too many positional arguments** - Use flags for >3 inputs
2. **Inconsistent flag naming** - Pick `--kebab-case` and stick with it
3. **Silent failures** - Always explain what happened
4. **Breaking changes without migration** - Deprecation warnings first
5. **No --help for subcommands** - Every command needs help
