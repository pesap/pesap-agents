---
name: artifact-management
description: Optimize artifact uploads, retention, and cross-job data passing in GitHub Actions
license: MIT
allowed-tools: Read Grep Glob Bash
metadata:
  author: pesap
  version: "1.0.0"
  category: devops
---

# Artifact Management

## When to Use
When workflows upload artifacts, pass data between jobs, or when storage costs are a concern.

## Instructions

1. **Audit artifact usage** — Find all `actions/upload-artifact` and `actions/download-artifact` steps. Note what's uploaded, how large, and retention days
2. **Retention policies** — Default is 90 days. Set `retention-days` explicitly:
   - Build logs/test reports: 7-14 days
   - Release binaries: 30-90 days
   - Debug artifacts: 1-3 days
   - PR-specific artifacts: 5-7 days
3. **Size optimization**:
   - Compress before uploading (tar.gz, zip)
   - Exclude unnecessary files (node_modules, .git, source maps in non-debug builds)
   - Use `.artifactignore` patterns or specific `path` globs
   - Split large artifacts into smaller, targeted uploads
4. **Cross-job data passing** — For passing data between jobs:
   - Small data (<1KB): use `$GITHUB_OUTPUT` and job outputs instead of artifacts
   - Medium data: artifacts with short retention (1 day)
   - Build outputs needed by test jobs: cache with `actions/cache` instead of artifacts (faster restore)
5. **Unnecessary uploads** — Flag artifacts that are uploaded but never downloaded by any job or used in releases
6. **Storage budget** — GitHub Actions storage counts against the account. Estimate monthly storage:
   - `artifact_size × uploads_per_day × retention_days`
   - Suggest retention reductions for the biggest offenders
