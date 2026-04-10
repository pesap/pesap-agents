/**
 * pi-gitagent
 *
 * Pi extension that loads any gitagent agent into the current session.
 *
 * Commands (user-facing, TUI):
 *   /gitagent load <ref>      Load an agent into this session
 *   /gitagent new <prompt>     Create a new agent using the gitagent architect
 *   /gitagent list [ref]      List available agents (local or remote)
 *   /gitagent info            Show the currently loaded agent
 *   /gitagent refresh         Re-pull and reload the current agent
 *   /gitagent unload          Remove the loaded agent context
 *
 * Tools (LLM-callable):
 *   gitagent_load             Load an agent, optionally queue a follow-up task
 *   gitagent_unload           Remove the loaded agent context
 *   gitagent_info             Show the currently loaded agent
 *   gitagent_list             List available agents in a repo or directory
 *   gitagent_remember         Save a learning to the agent's persistent memory
 *
 * Agent references:
 *   /gitagent load code-reviewer
 *   /gitagent load gh:pesap/agents/code-reviewer
 *   /gitagent load https://github.com/pesap/agents/tree/main/code-reviewer
 *
 * Install:
 *   pi install https://github.com/pesap/agents
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { resolveAgent, resolveDir, listAgentsInDir } from "./resolve.js";
import { loadAgent, mapModel, type LoadedAgent } from "./loader.js";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const MEMORY_DIR = join(homedir(), ".pitagent", "memory");
const ARCHITECT_REF = "gh:shreyas-lyzr/architect";
const SKILL_ENFORCEMENT_MAX_STREAK = 2;

const USAGE = [
  "Usage:",
  "  /gitagent load <ref>      Load an agent into this session",
  "  /gitagent new <prompt>     Create a new agent via the architect",
  "  /gitagent list [ref]      List available agents",
  "  /gitagent info            Show loaded agent",
  "  /gitagent refresh         Re-pull and reload",
  "  /gitagent unload          Remove agent context",
].join("\n");

export default function piGitagent(pi: ExtensionAPI) {
  let currentAgent: LoadedAgent | null = null;
  let currentRef: string | null = null;
  let pendingRestore: { agent: LoadedAgent | null; ref: string | null } | null =
    null;
  let rememberedThisSession = false;
  let lastSkillAuditFingerprint: string | null = null;
  let lastFeedbackFingerprint: string | null = null;
  let skillEnforcementStreak = 0;

  /** Append a dated entry to the agent's memory file. Trims to 200 lines.
   *  Uses the agent's own memoryDir so local agents write to their folder,
   *  not the centralized store. */
  function appendToMemory(agent: LoadedAgent, entry: string) {
    mkdirSync(agent.memoryDir, { recursive: true });
    const memoryPath = join(agent.memoryDir, "MEMORY.md");

    // Fast path: if file is small enough, just append
    if (existsSync(memoryPath)) {
      const content = readFileSync(memoryPath, "utf-8");
      const lineCount = (content.match(/\n/g) || []).length + 1;

      if (lineCount < 200) {
        appendFileSync(memoryPath, `\n${entry}`, "utf-8");
        return;
      }

      // Slow path: trim old lines
      const lines = content.split("\n");
      lines.push(entry);
      const trimmed = lines.slice(lines.length - 200);
      writeFileSync(memoryPath, trimmed.join("\n"), "utf-8");
    } else {
      writeFileSync(memoryPath, entry, "utf-8");
    }
  }

  /** Extract plain text from a message content array. */
  function extractText(content: unknown): string {
    if (typeof content === "string") return content;
    if (!Array.isArray(content)) return "";
    return content
      .filter((b: any) => b.type === "text" && typeof b.text === "string")
      .map((b: any) => b.text)
      .join(" ")
      .trim();
  }

  function todayIsoDate(): string {
    return new Date().toISOString().split("T")[0];
  }

  function saveAgentMemoryEntry(agent: LoadedAgent, entry: string) {
    appendToMemory(agent, entry);
    rememberedThisSession = true;
  }

  function getLastAssistantText(ctx: any): string {
    const entries = ctx.sessionManager?.getBranch?.() ?? [];
    for (let i = entries.length - 1; i >= 0; i--) {
      const entry = entries[i];
      if (entry?.type !== "message") continue;
      const msg = (entry as any).message;
      if (msg?.role === "assistant") return extractText(msg.content);
    }
    return "";
  }

  function getLastUserText(ctx: any): string {
    const entries = ctx.sessionManager?.getBranch?.() ?? [];
    for (let i = entries.length - 1; i >= 0; i--) {
      const entry = entries[i];
      if (entry?.type !== "message") continue;
      const msg = (entry as any).message;
      if (msg?.role === "user") return extractText(msg.content);
    }
    return "";
  }

  function inferSentiment(feedback: string): "positive" | "negative" | "neutral" {
    const lower = feedback.toLowerCase();
    if (/(great|nice|love|perfect|thanks|good job|awesome)/.test(lower)) return "positive";
    if (/(bad|wrong|hate|not good|broken|annoying|doesn't work|does not work|regression)/.test(lower)) {
      return "negative";
    }
    return "neutral";
  }

  function formatFeedbackEntry(params: {
    feedback: string;
    topic?: string;
    source?: string;
    sentiment?: "positive" | "negative" | "neutral";
  }): string {
    const topic = (params.topic ?? "general").trim() || "general";
    const source = (params.source ?? "user").trim() || "user";
    const sentiment = params.sentiment ?? inferSentiment(params.feedback);
    return `- ${todayIsoDate()}: [feedback/${topic}/${sentiment}] ${params.feedback.trim()} (source: ${source})`;
  }

  function getFeedbackHookConfig(agent: LoadedAgent): {
    enabled: boolean;
    minConfidence: number;
    maxChars: number;
    redactSensitive: boolean;
  } {
    const metadata = agent.manifest.metadata as Record<string, unknown> | undefined;
    const raw = metadata?.feedback_memory_hook as Record<string, unknown> | undefined;

    const minConfidenceRaw = raw?.min_confidence;
    const maxCharsRaw = raw?.max_chars;

    const minConfidence =
      typeof minConfidenceRaw === "number" && minConfidenceRaw >= 0 && minConfidenceRaw <= 1
        ? minConfidenceRaw
        : 0.9;
    const maxChars =
      typeof maxCharsRaw === "number" && maxCharsRaw >= 80 && maxCharsRaw <= 500
        ? Math.floor(maxCharsRaw)
        : 220;

    return {
      enabled: raw?.enabled === true,
      minConfidence,
      maxChars,
      redactSensitive: raw?.redact_sensitive !== false,
    };
  }

  function redactPotentialSensitiveText(text: string): string {
    const patterns: Array<[RegExp, string]> = [
      [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted-email]"],
      [/\b(?:sk|pk)_(?:live|test)_[A-Za-z0-9]{16,}\b/g, "[redacted-api-key]"],
      [/\bghp_[A-Za-z0-9]{20,}\b/g, "[redacted-github-token]"],
      [/\bAKIA[0-9A-Z]{16}\b/g, "[redacted-aws-key]"],
      [/\b(?:\d[ -]*?){13,19}\b/g, "[redacted-number]"],
    ];

    return patterns.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);
  }

  function normalizeFeedbackText(feedback: string, maxChars: number): string {
    const compact = feedback.replace(/\s+/g, " ").trim();
    if (compact.length <= maxChars) return compact;

    const sentence = compact.match(/^(.{1,500}?[.!?])(?:\s|$)/);
    const candidate = sentence?.[1]?.trim() ?? compact;
    if (candidate.length <= maxChars) return candidate;

    return `${candidate.slice(0, Math.max(0, maxChars - 1)).trimEnd()}…`;
  }

  function inferFeedbackTopic(feedback: string): string {
    const lower = feedback.toLowerCase();
    if (/(style|format|tone|concise|verbosity|wording|response)/.test(lower)) {
      return "communication";
    }
    if (/(memory|remember|feedback|preference)/.test(lower)) {
      return "memory";
    }
    if (/(performance|speed|fast|slow|latency)/.test(lower)) {
      return "performance";
    }
    if (/(test|lint|clippy|quality|bug|error handling)/.test(lower)) {
      return "quality";
    }
    if (/(agent|skill|hook|tool)/.test(lower)) {
      return "agent-behavior";
    }
    return "general";
  }

  function parseAutoFeedback(text: string): {
    feedback: string;
    topic: string;
    signal: string;
    confidence: number;
  } | null {
    const normalized = text.replace(/\s+/g, " ").trim();
    if (normalized.length < 16) return null;

    const lower = normalized.toLowerCase();
    const hasPreference =
      /\bi\s+(?:prefer|want|need|expect|like|love|hate|do not want|don't want)\b/.test(lower) ||
      /\b(?:from now on|next time)\b/.test(lower);
    const hasCorrection =
      /\b(?:wrong|incorrect|not what i asked|you missed|that's not|that is not|instead)\b/.test(
        lower,
      );
    const hasPraise = /\b(?:great|nice|good|perfect|awesome|thanks|thank you)\b/.test(lower);
    const hasMeta =
      /\b(?:agent|response|answer|format|style|tone|memory|remember|manual|automatic|hook|tool|skill)\b/.test(
        lower,
      );

    const shouldCapture = hasCorrection || hasPreference || (hasPraise && hasMeta);
    if (!shouldCapture) return null;

    const signal = hasCorrection
      ? "correction"
      : hasPreference
        ? "preference"
        : "praise";

    let confidence = 0.6;
    if (hasMeta) confidence += 0.2;
    if (hasCorrection || hasPreference) confidence += 0.2;
    if (confidence > 1) confidence = 1;

    return {
      feedback: normalized,
      topic: inferFeedbackTopic(normalized),
      signal,
      confidence,
    };
  }

  function auditAutoFeedback(ctx: any) {
    if (!currentAgent) return;

    const cfg = getFeedbackHookConfig(currentAgent);
    if (!cfg.enabled) return;

    const userText = getLastUserText(ctx);
    if (!userText) return;

    const parsed = parseAutoFeedback(userText);
    if (!parsed) return;
    if (parsed.confidence < cfg.minConfidence) return;

    const sanitized = cfg.redactSensitive
      ? redactPotentialSensitiveText(parsed.feedback)
      : parsed.feedback;
    const concise = normalizeFeedbackText(sanitized, cfg.maxChars);
    if (concise.length < 12) return;

    const fingerprint = `${currentAgent.manifest.name}:${concise.slice(-220)}`;
    if (fingerprint === lastFeedbackFingerprint) return;
    lastFeedbackFingerprint = fingerprint;

    const entry = formatFeedbackEntry({
      feedback: concise,
      topic: parsed.topic,
      source: "user-auto",
    });
    saveAgentMemoryEntry(currentAgent, entry);

    pi.appendEntry("gitagent-feedback-captured", {
      agent: currentAgent.manifest.name,
      mode: "auto-inferred",
      topic: parsed.topic,
      signal: parsed.signal,
      confidence: parsed.confidence,
      min_confidence: cfg.minConfidence,
      at: new Date().toISOString(),
    });

    ctx.ui.notify(
      `📝 Auto-saved user feedback to ${currentAgent.manifest.name} memory (${parsed.signal}).`,
      "info",
    );
  }

  function verifySkillSection(
    agent: LoadedAgent,
    assistantText: string,
  ): { ok: boolean; reason: string; matchedSkills: string[] } {
    if (agent.skills.length === 0) {
      return { ok: true, reason: "no_skills", matchedSkills: [] };
    }

    const hasSkillsSection =
      /(?:^|\n)#{1,6}\s*skills?\s*(?:used|applied|check|activation)\b/i.test(
        assistantText,
      ) ||
      /skills?\s*(?:used|applied|check|activation)\s*:/i.test(assistantText);

    if (!hasSkillsSection) {
      return {
        ok: false,
        reason: "missing_skills_used_section",
        matchedSkills: [],
      };
    }

    const lower = assistantText.toLowerCase();
    const matchedSkills = agent.skills
      .filter((skill) => lower.includes(skill.name.toLowerCase()))
      .map((skill) => skill.name);

    const explicitlyNone =
      /skills?\s*(?:used|applied|check|activation)[^\n]*none/i.test(
        assistantText,
      ) || /no\s+applicable\s+skill/i.test(assistantText);

    if (matchedSkills.length === 0 && !explicitlyNone) {
      return {
        ok: false,
        reason: "skills_section_without_known_skill_or_none",
        matchedSkills: [],
      };
    }

    return { ok: true, reason: "ok", matchedSkills };
  }

  function auditSkillUsage(
    ctx: any,
  ): { checked: boolean; result?: { ok: boolean; reason: string; matchedSkills: string[] } } {
    if (!currentAgent || currentAgent.skills.length === 0) {
      skillEnforcementStreak = 0;
      return { checked: false };
    }

    const assistantText = getLastAssistantText(ctx);
    if (!assistantText) return { checked: false };

    const fingerprint = `${currentAgent.manifest.name}:${assistantText.slice(-160)}`;
    if (fingerprint === lastSkillAuditFingerprint) return { checked: false };
    lastSkillAuditFingerprint = fingerprint;

    const result = verifySkillSection(currentAgent, assistantText);
    pi.appendEntry("gitagent-skill-check", {
      agent: currentAgent.manifest.name,
      ok: result.ok,
      reason: result.reason,
      matchedSkills: result.matchedSkills,
      at: new Date().toISOString(),
    });

    if (!result.ok) {
      ctx.ui.notify(
        `⚠️ Skill hook: ${currentAgent.manifest.name} is missing a valid Skills Used section (${result.reason}).`,
        "info",
      );

      if (skillEnforcementStreak < SKILL_ENFORCEMENT_MAX_STREAK) {
        skillEnforcementStreak += 1;
        const enforcementPrompt = [
          "Your previous response failed the skill verification hook.",
          "Please restate your answer and include a `Skills Used` section.",
          "List at least one loaded skill by name with one-line evidence, or write `Skills Used: none` with a reason.",
          "Do not change conclusions unless you found an actual error.",
        ].join(" ");

        pi.appendEntry("gitagent-skill-enforcement", {
          agent: currentAgent.manifest.name,
          reason: result.reason,
          streak: skillEnforcementStreak,
          at: new Date().toISOString(),
        });
        pi.sendUserMessage(enforcementPrompt, { deliverAs: "followUp" });
        ctx.ui.notify(
          `🧰 Skill hook enforcement queued (${skillEnforcementStreak}/${SKILL_ENFORCEMENT_MAX_STREAK}).`,
          "info",
        );
      } else {
        ctx.ui.notify(
          `🛑 Skill hook reached max enforcement streak (${SKILL_ENFORCEMENT_MAX_STREAK}).`,
          "info",
        );
      }
    } else {
      skillEnforcementStreak = 0;
    }

    return { checked: true, result };
  }

  /** Resolve + load in one shot. Every load path funnels through here. */
  function resolveAndLoad(ref: string, cwd: string): LoadedAgent {
    const resolved = resolveAgent(ref, { cwd });
    // Local agents keep memory alongside the agent directory.
    // Remote/cached agents use centralized memory so it survives cache clears.
    const opts = resolved.remote ? { memoryBaseDir: MEMORY_DIR } : {};
    return loadAgent(resolved.dir, opts);
  }

  /** Set the agent as current, persist the ref, update status bar. */
  function activateAgent(
    agent: LoadedAgent,
    ref: string,
    ctx: { ui: { setStatus: (key: string, text: string | undefined) => void } },
  ) {
    currentAgent = agent;
    currentRef = ref;
    rememberedThisSession = false;
    lastSkillAuditFingerprint = null;
    lastFeedbackFingerprint = null;
    skillEnforcementStreak = 0;
    pi.appendEntry("gitagent-loaded", { ref });
    ctx.ui.setStatus("gitagent", `🤖 ${agent.manifest.name}`);
  }

  /** Try switching to the agent's preferred model. Returns true if switched. */
  async function switchModel(
    agent: LoadedAgent,
    ctx: {
      modelRegistry: { find: (provider: string, modelId: string) => any };
    },
  ): Promise<boolean> {
    const modelPref = agent.manifest.model?.preferred;
    if (!modelPref) return false;
    const mapped = mapModel(modelPref);
    const model = ctx.modelRegistry.find(mapped.provider, mapped.modelId);
    return model ? await pi.setModel(model) : false;
  }

  // ── Restore state from session entries ─────────────────────────────────

  pi.on("session_start", async (_event, ctx) => {
    const entries = ctx.sessionManager.getEntries();
    let lastRef: string | null = null;

    // Scan backwards to find the most recent load/unload
    for (let i = entries.length - 1; i >= 0; i--) {
      const entry = entries[i];
      if (entry.type === "custom") {
        if (entry.customType === "gitagent-loaded") {
          lastRef = (entry as any).data?.ref ?? null;
          break;
        } else if (entry.customType === "gitagent-unloaded") {
          break; // Most recent was unload, stop
        }
      }
    }

    if (lastRef) {
      try {
        const agent = resolveAndLoad(lastRef, ctx.cwd);
        activateAgent(agent, lastRef, ctx);
      } catch {
        currentAgent = null;
        currentRef = null;
      }
    }
  });

  // ── LLM-callable tools ─────────────────────────────────────────────────

  pi.registerTool({
    name: "gitagent_load",
    label: "Load Agent",
    description:
      "Load a gitagent agent into the session. The agent's identity, rules, and skills are injected into the system prompt on the next turn. Use followUp to queue a task that runs with the agent's context active.",
    promptSnippet:
      "Load a gitagent agent (local path, gh:owner/repo/agent, or full GitHub URL). Use followUp to queue work that runs under the agent's identity.",
    promptGuidelines: [
      "When the user asks to 'load agent X and do Y', call gitagent_load with ref=X and followUp=Y so Y runs with the agent's context.",
      "When the user just says 'load agent X', call gitagent_load with ref=X and no followUp.",
    ],
    parameters: Type.Object({
      ref: Type.String({
        description:
          "Agent reference: local name (code-reviewer), gh: shorthand (gh:owner/repo/agent), or full GitHub URL",
      }),
      followUp: Type.Optional(
        Type.String({
          description:
            "Task to execute after loading. Queued as a follow-up message so it runs with the agent's soul active in the system prompt.",
        }),
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      try {
        const agent = resolveAndLoad(params.ref, ctx.cwd);
        activateAgent(agent, params.ref, ctx);

        const switched = await switchModel(agent, ctx);
        const modelName = agent.manifest.model?.preferred ?? "default";
        const skillNames = agent.skills.map((s) => s.name).join(", ") || "none";

        if (params.followUp) {
          pi.sendUserMessage(params.followUp, { deliverAs: "followUp" });
        }

        const lines = [
          `Loaded ${agent.manifest.name} (model: ${modelName}, skills: ${skillNames}).`,
          params.followUp
            ? `Follow-up task queued: "${params.followUp}" — it will run with ${agent.manifest.name}'s context active.`
            : "Agent context will be active on the next message.",
        ];

        return {
          content: [{ type: "text", text: lines.join("\n") }],
          details: {
            agent: agent.manifest.name,
            ref: params.ref,
            followUp: params.followUp ?? null,
          },
        };
      } catch (err) {
        throw new Error(
          `Failed to load agent "${params.ref}": ${(err as Error).message}`,
        );
      }
    },
  });

  pi.registerTool({
    name: "gitagent_unload",
    label: "Unload Agent",
    description: "Remove the currently loaded gitagent agent from the session.",
    promptSnippet: "Unload the current gitagent agent from the session.",
    parameters: Type.Object({}),
    async execute(_toolCallId, _params, _signal, _onUpdate, ctx) {
      if (!currentAgent) {
        return {
          content: [{ type: "text", text: "No agent loaded." }],
          details: {},
        };
      }
      const name = currentAgent.manifest.name;
      currentAgent = null;
      currentRef = null;
      lastFeedbackFingerprint = null;
      pi.appendEntry("gitagent-unloaded", {});
      ctx.ui.setStatus("gitagent", undefined);
      return {
        content: [
          { type: "text", text: `Unloaded ${name}. Agent context removed.` },
        ],
        details: { unloaded: name },
      };
    },
  });

  pi.registerTool({
    name: "gitagent_info",
    label: "Agent Info",
    description: "Show information about the currently loaded gitagent agent.",
    promptSnippet:
      "Show the currently loaded gitagent agent's name, model, skills, and memory status.",
    parameters: Type.Object({}),
    async execute() {
      if (!currentAgent) {
        return {
          content: [{ type: "text", text: "No agent loaded." }],
          details: {},
        };
      }
      const info = buildAgentInfo(currentAgent);
      const text = Object.entries(info)
        .map(
          ([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") || "none" : v}`,
        )
        .join("\n");
      return {
        content: [{ type: "text", text }],
        details: info,
      };
    },
  });

  pi.registerTool({
    name: "gitagent_list",
    label: "List Agents",
    description:
      "List available gitagent agents in a directory or GitHub repo.",
    promptSnippet:
      "List available gitagent agents in a local directory or GitHub repo.",
    parameters: Type.Object({
      ref: Type.Optional(
        Type.String({
          description:
            "Directory or GitHub reference to list. Defaults to current working directory.",
        }),
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      try {
        const agents = getAgentList(params.ref ?? ctx.cwd, ctx.cwd);
        if (agents.length === 0) {
          return {
            content: [{ type: "text", text: `No agents found` }],
            details: {},
          };
        }
        return {
          content: [
            {
              type: "text",
              text: `Available agents:\n${agents.map((a) => `  ${a}`).join("\n")}`,
            },
          ],
          details: { agents },
        };
      } catch (err) {
        throw new Error(`Failed to list agents: ${(err as Error).message}`);
      }
    },
  });

  pi.registerTool({
    name: "gitagent_remember",
    label: "Remember",
    description:
      "Save a learning to the loaded agent's persistent memory. Use this whenever you discover something worth remembering across sessions.",
    promptSnippet: "Save a learning to the agent's persistent memory file.",
    promptGuidelines: [
      "Call gitagent_remember when you learn something important: project conventions, user preferences, decision rationale, discovered patterns, or useful context for future sessions.",
      "Keep entries concise. One learning per call. The memory file has a 200-line cap, oldest entries are trimmed.",
    ],
    parameters: Type.Object({
      learning: Type.String({
        description:
          "The learning to save. Be concise, one fact or pattern per entry.",
      }),
    }),
    async execute(_toolCallId, params) {
      if (!currentAgent) {
        throw new Error(
          "No agent loaded. Load an agent first with gitagent_load.",
        );
      }
      const entry = `- ${todayIsoDate()}: ${params.learning}`;
      saveAgentMemoryEntry(currentAgent, entry);
      return {
        content: [
          {
            type: "text",
            text: `Saved to ${currentAgent.manifest.name}'s memory.`,
          },
        ],
        details: { agent: currentAgent.manifest.name, entry },
      };
    },
  });

  // ── /gitagent command (TUI) ────────────────────────────────────────────

  pi.registerCommand("gitagent", {
    description: "Load a gitagent agent into this session",
    handler: async (args, ctx) => {
      const parts = (args ?? "").trim().split(/\s+/);
      const subcommand = parts[0] || "";
      const rest = parts.slice(1).join(" ").trim();

      switch (subcommand) {
        case "load": {
          if (!rest) {
            ctx.ui.notify("Usage: /gitagent load <ref>", "error");
            return;
          }
          try {
            const agent = resolveAndLoad(rest, ctx.cwd);
            activateAgent(agent, rest, ctx);
            const switched = await switchModel(agent, ctx);
            const modelName = agent.manifest.model?.preferred ?? "default";
            const skillNames =
              agent.skills.map((s) => s.name).join(", ") || "none";
            ctx.ui.notify(
              `Loaded ${agent.manifest.name} (model: ${modelName}, skills: ${skillNames})`,
              "info",
            );
            if (switched)
              ctx.ui.notify(`Switched model to ${modelName}`, "info");
          } catch (err) {
            ctx.ui.notify(`${(err as Error).message}`, "error");
          }
          return;
        }

        case "new": {
          if (!rest) {
            ctx.ui.notify(
              "Usage: /gitagent new <prompt describing the agent to create>",
              "error",
            );
            return;
          }
          handleNew(pi, ctx, rest);
          return;
        }

        case "list": {
          handleList(ctx, rest || undefined);
          return;
        }

        case "info": {
          if (currentAgent) {
            showAgentInfo(ctx, currentAgent);
          } else {
            ctx.ui.notify("No agent loaded.", "info");
          }
          return;
        }

        case "refresh": {
          if (!currentAgent || !currentRef) {
            ctx.ui.notify("No agent loaded.", "info");
            return;
          }
          try {
            resolveAgent(currentRef, { refresh: true, cwd: ctx.cwd });
            currentAgent = resolveAndLoad(currentRef, ctx.cwd);
            ctx.ui.notify(
              `Refreshed ${currentAgent.manifest.name}. Takes effect on next prompt.`,
              "info",
            );
          } catch (err) {
            ctx.ui.notify(`Refresh failed: ${(err as Error).message}`, "error");
          }
          return;
        }

        case "unload": {
          if (currentAgent) {
            const name = currentAgent.manifest.name;
            currentAgent = null;
            currentRef = null;
            lastFeedbackFingerprint = null;
            pi.appendEntry("gitagent-unloaded", {});
            ctx.ui.notify(
              `Unloaded ${name}. Takes effect on next prompt.`,
              "info",
            );
            ctx.ui.setStatus("gitagent", undefined);
          } else {
            ctx.ui.notify("No agent loaded.", "info");
          }
          return;
        }

        default: {
          ctx.ui.notify(USAGE, "info");
          return;
        }
      }
    },
  });

  // ── New agent handler (temporary architect swap) ───────────────────────

  function handleNew(
    pi: ExtensionAPI,
    ctx: {
      ui: {
        notify: (msg: string, type: string) => void;
        setStatus: (key: string, text: string | undefined) => void;
      };
      cwd: string;
    },
    prompt: string,
  ) {
    try {
      pendingRestore = { agent: currentAgent, ref: currentRef };

      currentAgent = resolveAndLoad(ARCHITECT_REF, ctx.cwd);
      currentRef = null;

      ctx.ui.setStatus(
        "gitagent",
        `🤖 ${currentAgent.manifest.name} (creating...)`,
      );
      ctx.ui.notify("Loaded architect agent. Creating your agent...", "info");

      pi.sendUserMessage(prompt);
    } catch (err) {
      pendingRestore = null;
      ctx.ui.notify(
        `Failed to load architect: ${(err as Error).message}`,
        "error",
      );
    }
  }

  // Auto-restore previous agent when the architect finishes its turn
  pi.on("agent_end", async (_event, ctx: any) => {
    if (!pendingRestore) {
      auditAutoFeedback(ctx);
      auditSkillUsage(ctx);
      return;
    }

    const restore = pendingRestore;
    pendingRestore = null;

    currentAgent = restore.agent;
    currentRef = restore.ref;
    lastSkillAuditFingerprint = null;
    lastFeedbackFingerprint = null;
    skillEnforcementStreak = 0;

    if (currentAgent) {
      ctx.ui.setStatus("gitagent", `🤖 ${currentAgent.manifest.name}`);
      ctx.ui.notify(
        `Architect finished. Restored ${currentAgent.manifest.name}.`,
        "info",
      );
    } else {
      ctx.ui.setStatus("gitagent", undefined);
      ctx.ui.notify(
        "Architect finished. No previous agent to restore.",
        "info",
      );
    }
  });

  // ── Auto-save session context to memory on shutdown ─────────────────

  pi.on("session_shutdown", async (_event, ctx) => {
    if (!currentAgent) return;
    if (rememberedThisSession) return; // LLM already saved learnings explicitly

    // Extract user messages to determine if this was a non-trivial session
    const entries = ctx.sessionManager.getBranch();
    const userMessages: string[] = [];
    for (const entry of entries) {
      if (entry.type !== "message") continue;
      const msg = (entry as any).message;
      if (msg?.role === "user") {
        const text = extractText(msg.content);
        if (text) userMessages.push(text);
      }
    }

    // Skip trivial sessions (greetings, single questions, etc.)
    if (userMessages.length < 2) return;

    const date = new Date().toISOString().split("T")[0];
    const topic = userMessages[0].slice(0, 120);
    appendToMemory(
      currentAgent,
      `- ${date}: [auto] Session ended without explicit memory save. Topic: "${topic}"`,
    );
  });

  // ── System prompt injection ────────────────────────────────────────────

  pi.on("before_agent_start", async (event) => {
    if (!currentAgent) return undefined;

    return {
      systemPrompt:
        event.systemPrompt + "\n\n" + currentAgent.systemPromptAppend,
    };
  });

  // ── Helpers ────────────────────────────────────────────────────────────

  function buildAgentInfo(agent: LoadedAgent) {
    const feedbackCfg = getFeedbackHookConfig(agent);
    return {
      name: agent.manifest.name,
      version: agent.manifest.version,
      description: agent.manifest.description,
      model: agent.manifest.model?.preferred ?? "default",
      skills: agent.skills.map((s) => s.name),
      memory: agent.memory ? "has content" : "empty",
      source: agent.dir,
      skill_verification_hook:
        agent.skills.length > 0
          ? `active (strict mode: auto follow-up enforcement, max streak ${SKILL_ENFORCEMENT_MAX_STREAK})`
          : "inactive (no skills loaded)",
      feedback_memory_hook: feedbackCfg.enabled
        ? `active (min_confidence=${feedbackCfg.minConfidence}, max_chars=${feedbackCfg.maxChars}, redact_sensitive=${feedbackCfg.redactSensitive})`
        : "inactive (set metadata.feedback_memory_hook.enabled=true in agent.yaml)",
    };
  }

  function showAgentInfo(
    ctx: { ui: { notify: (msg: string, type: string) => void } },
    agent: LoadedAgent,
  ) {
    const info = buildAgentInfo(agent);
    const lines = Object.entries(info).map(
      ([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") || "none" : v}`,
    );
    ctx.ui.notify(lines.join("\n"), "info");
  }

  function getAgentList(ref: string, cwd: string): string[] {
    const dir = ref === cwd ? cwd : resolveDir(ref, { cwd });
    const isRoot = existsSync(join(dir, "agent.yaml"));
    const subs = listAgentsInDir(dir);
    const agents: string[] = [];
    if (isRoot) agents.push(". (root agent)");
    agents.push(...subs);
    return agents;
  }

  function handleList(
    ctx: { ui: { notify: (msg: string, type: string) => void }; cwd: string },
    ref?: string,
  ) {
    try {
      const agents = getAgentList(ref ?? ctx.cwd, ctx.cwd);
      if (agents.length === 0) {
        ctx.ui.notify(`No agents found`, "info");
        return;
      }
      ctx.ui.notify(
        `Available agents:\n${agents.map((a) => `  ${a}`).join("\n")}`,
        "info",
      );
    } catch (err) {
      ctx.ui.notify(`${(err as Error).message}`, "error");
    }
  }
}
