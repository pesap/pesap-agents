import path from "node:path";
import { buildLifecycleHookMarkdown, type HookConfig } from "../hooks/config";
import { readText, readTextIfExists } from "../lib/io";
import {
  getLearnedSkillsList,
  getLearningMemoryTail,
  type LearningPaths,
} from "../learning/store";
import {
  parseFirstPrinciplesConfig,
  type FirstPrinciplesConfig,
} from "../policy/first-principles";

export async function loadFirstPrinciplesConfig(
  firstPrinciplesConfigPath: string,
  defaults?: FirstPrinciplesConfig,
): Promise<{ config: FirstPrinciplesConfig; warnings: string[] }> {
  const raw = await readTextIfExists(firstPrinciplesConfigPath);
  return parseFirstPrinciplesConfig(raw, defaults);
}

export function createWorkflowReaders(params: {
  skillflowsDir: string;
  commandsDir: string;
  packageSkillsPaths: string[];
}): {
  readWorkflow: (name: string) => Promise<string>;
  readCommandPrompt: (name: string) => Promise<string>;
  readSkill: (name: string) => Promise<string>;
} {
  async function readWorkflow(name: string): Promise<string> {
    return readText(path.join(params.skillflowsDir, name));
  }

  async function readCommandPrompt(name: string): Promise<string> {
    return readText(path.join(params.commandsDir, name));
  }

  async function readSkill(name: string): Promise<string> {
    for (const skillRoot of params.packageSkillsPaths) {
      const skillFile = path.resolve(skillRoot, name, "SKILL.md");
      const resolvedSkillRoot = path.resolve(skillRoot);
      const skillsRoot = `${resolvedSkillRoot}${path.sep}`;
      if (!skillFile.startsWith(skillsRoot)) continue;

      const content = await readTextIfExists(skillFile);
      if (content.trim()) return content;
    }

    return "";
  }

  return { readWorkflow, readCommandPrompt, readSkill };
}

export async function getBootstrapPayload(params: {
  cwd: string;
  runtimeDir: string;
  hooksDir: string;
  activeHookConfig: HookConfig;
  learningPathCache: Map<string, LearningPaths>;
  memoryTailLines: number;
}): Promise<string> {
  const [
    soul,
    rules,
    duties,
    instructions,
    complianceProfile,
    startupHooks,
    memoryTail,
    learnedSkills,
  ] = await Promise.all([
    readTextIfExists(path.join(params.runtimeDir, "SOUL.md")),
    readTextIfExists(path.join(params.runtimeDir, "RULES.md")),
    readTextIfExists(path.join(params.runtimeDir, "DUTIES.md")),
    readTextIfExists(path.join(params.runtimeDir, "INSTRUCTIONS.md")),
    readTextIfExists(path.join(params.runtimeDir, "compliance", "risk-assessment.md")),
    buildLifecycleHookMarkdown({
      lifecycle: "on_session_start",
      activeHookConfig: params.activeHookConfig,
      hooksDir: params.hooksDir,
    }),
    getLearningMemoryTail(params.cwd, params.learningPathCache, params.memoryTailLines),
    getLearnedSkillsList(params.cwd, params.learningPathCache),
  ]);

  return [
    "Pesap agent bootstrap context (single-agent runtime):",
    "",
    "[SOUL]",
    soul.trim(),
    "",
    "[RULES]",
    rules.trim(),
    duties.trim() ? "[DUTIES]" : "",
    duties.trim(),
    "",
    "[INSTRUCTIONS]",
    instructions.trim(),
    complianceProfile.trim() ? "[COMPLIANCE PROFILE]" : "",
    complianceProfile.trim(),
    startupHooks.trim() ? "[LIFECYCLE HOOKS: on_session_start]" : "",
    startupHooks.trim(),
    memoryTail ? "[LEARNING MEMORY TAIL]" : "",
    memoryTail,
    learnedSkills.length > 0 ? `[LEARNED SKILLS] ${learnedSkills.join(", ")}` : "",
  ]
    .filter((line) => line.length > 0)
    .join("\n");
}
