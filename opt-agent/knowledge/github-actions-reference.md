# GitHub Actions Reference

## Key Workflow Optimizations

### Concurrency Control
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```
- Prevents redundant runs on the same branch
- Saves compute minutes on rapid pushes

### Path Filters
```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'tests/**'
      - '.github/workflows/ci.yml'
```
- Only run workflows when relevant files change
- Essential for monorepos

### Matrix Strategy
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    python: ['3.9', '3.10', '3.11']
  fail-fast: false
```
- Parallelize across environments
- `fail-fast: false` runs all variants even if one fails

## Runner Sizing

| Runner | vCPU | RAM | Cost Multiplier |
|--------|------|-----|-----------------|
| ubuntu-latest | 2 | 7GB | 1x |
| ubuntu-4-core | 4 | 16GB | 2x |
| ubuntu-8-core | 8 | 32GB | 4x |
| ubuntu-16-core | 16 | 64GB | 8x |

Guideline: Use smallest runner that completes the job. Profile before scaling up.

## Common Anti-Patterns

### Sequential Jobs That Could Be Parallel
```yaml
# Bad: jobs run one after another
test:
  needs: lint  # Unnecessary dependency

# Good: independent jobs start immediately
lint:
test:
  needs: []  # Or omit needs entirely
```

### Missing Caches
- No dependency caching → full install every run
- No build output caching → rebuild from scratch
- No Docker layer caching → pull/push every time

### Inefficient Artifact Upload
```yaml
# Bad: Uploading node_modules
- uses: actions/upload-artifact@v4
  with:
    path: .

# Good: Only what's needed
- uses: actions/upload-artifact@v4
  with:
    path: |
      dist/
      coverage/
```

## Security Best Practices
- Pin actions to SHA, not just version tags
- Use OpenID Connect (OIDC) for cloud auth
- Never store secrets in workflow files
- Enable dependency review for PRs
