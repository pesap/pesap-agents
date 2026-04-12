# Caching Patterns for GitHub Actions

## Dependency Caching

### Python (pip)
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-
```

### Node.js (npm/yarn/pnpm)
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # Built-in caching
```

### Rust (cargo)
```yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.cargo/registry
      ~/.cargo/git
      target/
    key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}
```

## Build Output Caching

### Compiler Cache (ccache)
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.ccache
    key: ${{ runner.os }}-ccache-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-ccache-
```

### Docker Layer Caching
```yaml
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

## Cache Key Strategies

### Content-Addressed (Deterministic)
```yaml
key: deps-${{ hashFiles('package-lock.json') }}
```
- Cache updates when dependencies change
- Most precise, avoids stale caches

### Branch-Based
```yaml
key: build-${{ github.ref }}-${{ github.sha }}
restore-keys: |
  build-${{ github.ref }}-
  build-main-
```
- Prioritize same-branch cache
- Fall back to main branch cache

### Date-Based (Rolling)
```yaml
key: data-${{ steps.date.outputs.week }}
```
- For data that changes periodically
- Forces refresh on schedule

## Cache Eviction and Maintenance

### Cache Size Limits
- 10 GB per repository
- 7 days retention (unused caches)

### Best Practices
- Compress large artifacts before caching
- Exclude unnecessary files (.git, node_modules/.cache)
- Split large caches into logical units
- Monitor cache hit rates in Actions analytics

## Anti-Patterns to Avoid
- Caching generated files that are quick to rebuild
- Caching secrets or credentials
- Using non-deterministic keys (timestamp without content hash)
- Caching the same data in multiple keys
