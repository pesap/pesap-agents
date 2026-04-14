/**
 * Agent Resolver
 *
 * Resolves a gitagent agent from:
 *   - Installed registry entry: ~/.pi/gitagent/installed.json
 *   - Local directory:          ./review-agent, /abs/path/to/agent
 *   - GitHub shorthand:         gh:pesap/agents/review-agent
 *   - GitHub URL:               https://github.com/pesap/agents/tree/main/review-agent
 *   - Git SSH:                  git@github.com:pesap/agents.git
 *
 * GitHub repos are shallow-cloned to ~/.pi/gitagent/cache/github/<owner>/<repo>/<branch>
 * and reused across loads and installs.
 */

import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { findInstalledAgent } from "./registry.js";
import { ensureCacheDir, getCacheDir } from "./paths.js";

const GITHUB_CACHE_DIR = join(getCacheDir(), "github");

export interface ResolvedAgent {
  dir: string;
  remote: boolean;
  ref: string;
}

export interface ParsedGitHubRef {
  repoUrl: string;
  subpath: string;
  branch: string;
  owner: string;
  repo: string;
}

function sanitizePathSegment(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, "__");
}

function getGitHubRepoDir(ref: ParsedGitHubRef): string {
  return join(GITHUB_CACHE_DIR, ref.owner, ref.repo, sanitizePathSegment(ref.branch));
}

export function resolveExistingLocalPath(ref: string, cwd: string, requireAgentYaml: boolean): string | null {
  for (const candidate of [resolve(ref), resolve(cwd, ref)]) {
    if (!existsSync(candidate)) continue;
    if (requireAgentYaml && !existsSync(join(candidate, "agent.yaml"))) continue;
    return candidate;
  }
  return null;
}

export function parseGitHubRef(ref: string): ParsedGitHubRef | null {
  // https://github.com/owner/repo[.git][/tree/branch[/subpath]]
  const httpsMatch = ref.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/tree\/([^/]+)(?:\/(.+))?)?$/,
  );
  if (httpsMatch) {
    const [, owner, repo, branch, subpath] = httpsMatch;
    return {
      owner,
      repo,
      repoUrl: `https://github.com/${owner}/${repo}.git`,
      subpath: subpath ?? "",
      branch: branch ?? "main",
    };
  }

  // git@github.com:owner/repo[.git]
  const sshMatch = ref.match(/^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (sshMatch) {
    const [, owner, repo] = sshMatch;
    return {
      owner,
      repo,
      repoUrl: `git@github.com:${owner}/${repo}.git`,
      subpath: "",
      branch: "main",
    };
  }

  // gh:owner/repo[/subpath]
  const ghMatch = ref.match(/^gh:([^/]+)\/([^/]+)(?:\/(.+))?$/);
  if (ghMatch) {
    const [, owner, repo, subpath] = ghMatch;
    return {
      owner,
      repo,
      repoUrl: `https://github.com/${owner}/${repo}.git`,
      subpath: subpath ?? "",
      branch: "main",
    };
  }

  return null;
}

export function cloneOrUpdate(
  repoUrl: string,
  branch: string,
  refresh: boolean,
  repoDirOverride?: string,
): string {
  const cacheDir = ensureCacheDir();
  const hash = createHash("sha256").update(`${repoUrl}#${branch}`).digest("hex").slice(0, 16);
  const repoDir = repoDirOverride ?? join(cacheDir, hash);

  mkdirSync(repoDirOverride ? repoDir : cacheDir, { recursive: true });

  if (existsSync(join(repoDir, ".git"))) {
    if (refresh) {
      execSync(`git -C "${repoDir}" fetch origin ${branch} && git -C "${repoDir}" reset --hard origin/${branch}`, {
        stdio: "pipe",
      });
    }
    return repoDir;
  }

  execSync(`git clone --depth 1 --branch "${branch}" "${repoUrl}" "${repoDir}"`, { stdio: "pipe" });
  return repoDir;
}

export interface ResolveOptions {
  refresh?: boolean;
  agent?: string;
  branch?: string;
  cwd?: string;
}

function resolveInstalledAgent(ref: string, options: ResolveOptions): ResolvedAgent | null {
  const installed = findInstalledAgent(ref);
  if (!installed) return null;

  if (installed.source === "remote") {
    if (!installed.repoUrl || !installed.branch) {
      throw new Error(`Installed remote agent "${ref}" is missing repo metadata. Reinstall it.`);
    }
    const repoDir = cloneOrUpdate(installed.repoUrl, installed.branch, options.refresh ?? false, installed.repoDir);
    const agentDir = installed.dir.startsWith(repoDir)
      ? installed.dir
      : join(repoDir, installed.dir.replace(/^[/\\]+/, ""));

    if (!existsSync(join(agentDir, "agent.yaml"))) {
      throw new Error(`Installed remote agent "${ref}" no longer exists at ${agentDir}. Reinstall it.`);
    }

    return { dir: agentDir, remote: true, ref };
  }

  if (!existsSync(join(installed.dir, "agent.yaml"))) {
    throw new Error(`Installed local agent "${ref}" no longer exists at ${installed.dir}.`);
  }

  return { dir: installed.dir, remote: false, ref };
}

export function resolveAgent(ref: string, options: ResolveOptions = {}): ResolvedAgent {
  const cwd = options.cwd ?? process.cwd();

  const localAgentDir = resolveExistingLocalPath(ref, cwd, true);
  if (localAgentDir) {
    return { dir: localAgentDir, remote: false, ref };
  }

  const installed = resolveInstalledAgent(ref, options);
  if (installed) return installed;

  const github = parseGitHubRef(ref);
  if (!github) {
    throw new Error(
      `Cannot resolve "${ref}". Not an installed agent, local directory, or recognized GitHub reference.\n` +
        `Expected: installed agent name, local path, gh:owner/repo/agent, or https://github.com/owner/repo`,
    );
  }

  if (options.branch) github.branch = options.branch;

  const repoDir = cloneOrUpdate(github.repoUrl, github.branch, options.refresh ?? false, getGitHubRepoDir(github));
  const agentDir = options.agent
    ? join(repoDir, options.agent)
    : github.subpath
      ? join(repoDir, github.subpath)
      : repoDir;

  if (!existsSync(join(agentDir, "agent.yaml"))) {
    const available = listAgentsInDir(repoDir);
    const hint = available.length > 0
      ? `\nAvailable agents:\n${available.map((a) => `  - ${a}`).join("\n")}`
      : "";
    throw new Error(`No agent.yaml found at ${agentDir}${hint}`);
  }

  return { dir: agentDir, remote: true, ref };
}

export function resolveDir(ref: string, options: ResolveOptions = {}): string {
  const cwd = options.cwd ?? process.cwd();
  const localDir = resolveExistingLocalPath(ref, cwd, false);
  if (localDir) return localDir;

  const installed = findInstalledAgent(ref);
  if (installed) {
    if (installed.source === "remote") {
      if (!installed.repoUrl || !installed.branch) {
        throw new Error(`Installed remote agent "${ref}" is missing repo metadata. Reinstall it.`);
      }
      cloneOrUpdate(installed.repoUrl, installed.branch, options.refresh ?? false, installed.repoDir);
    }
    return installed.dir;
  }

  const github = parseGitHubRef(ref);
  if (!github) throw new Error(`Cannot resolve "${ref}".`);

  if (options.branch) github.branch = options.branch;
  const repoDir = cloneOrUpdate(github.repoUrl, github.branch, options.refresh ?? false, getGitHubRepoDir(github));
  return github.subpath ? join(repoDir, github.subpath) : repoDir;
}

export function listAgentsInDir(dir: string): string[] {
  const agents: string[] = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && existsSync(join(dir, entry.name, "agent.yaml"))) {
        agents.push(entry.name);
      }
    }
  } catch {
    // not a directory or unreadable
  }
  return agents.sort();
}
