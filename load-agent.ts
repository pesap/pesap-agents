#!/usr/bin/env node

/**
 * Universal Agent Loader
 *
 * Reads any agent directory's agent.yaml + SOUL.md + RULES.md
 * and registers it with pi via the subagent API.
 *
 * This is the single source of truth bridge: agent.yaml defines everything,
 * and this loader translates it for pi at runtime.
 *
 * Usage:
 *   npx ts-node load-agent.ts <agent-dir>
 *   npx ts-node load-agent.ts code-reviewer
 *   npx ts-node load-agent.ts ./data-modeler
 */

import { readFileSync, existsSync } from "fs";
import { join, resolve } from "path";

import { parse as parseYaml } from "yaml";
import { subagent } from "@mariozechner/pi-coding-agent";

/**
 * Minimal subset of agent.yaml fields needed for pi registration.
 * Full gitagent spec includes: spec_version, version, author, license,
 * delegation, runtime, compliance, tags, metadata (unused here).
 */
interface AgentYaml {
  name: string;
  description: string;
  model?: {
    preferred?: string;
    fallback?: string[];
    constraints?: {
      temperature?: number;
      max_tokens?: number;
    };
  };
  skills?: string[];
  pi?: {
    scope?: "project" | "user";
    tools?: string;
    thinking?: string;
  };
}

function readOptionalFile(path: string): string {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return "";
  }
}

export async function loadAgent(agentDir: string) {
  const dir = resolve(agentDir);

  // Read the single source of truth
  const agentYamlPath = join(dir, "agent.yaml");
  if (!existsSync(agentYamlPath)) {
    throw new Error(`No agent.yaml found in ${dir}`);
  }

  const config: AgentYaml = parseYaml(readFileSync(agentYamlPath, "utf-8"));
  const soul = readOptionalFile(join(dir, "SOUL.md"));
  const rules = readOptionalFile(join(dir, "RULES.md"));

  // Compose system prompt from markdown files
  const parts = [soul, rules].filter(Boolean);
  const systemPrompt = parts.join("\n\n");

  // Derive pi config from agent.yaml
  const pi = config.pi ?? {};

  return await subagent.action("create", {
    config: {
      name: config.name,
      description: config.description,
      scope: pi.scope ?? "project",
      systemPrompt,
      model: config.model?.preferred ?? "claude-sonnet-4-5-20250929",
      skills: (config.skills ?? []).join(","),
      tools: pi.tools ?? "read,edit,bash",
      ...(pi.thinking ? { thinking: pi.thinking } : {}),
    },
  });
}

// CLI: load a single agent
if (import.meta.url === `file://${process.argv[1]}`) {
  const agentDir = process.argv[2];
  if (!agentDir) {
    console.error("Usage: npx ts-node load-agent.ts <agent-dir>");
    process.exit(1);
  }

  try {
    await loadAgent(agentDir);
    console.log(`Agent loaded from ${agentDir}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`Failed to load agent: ${msg}`);
    process.exit(1);
  }
}
