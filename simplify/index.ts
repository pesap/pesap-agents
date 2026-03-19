#!/usr/bin/env node

/**
 * Code Simplifier Agent for pi
 * 
 * Reviews changed code for reuse, quality, and efficiency — then fixes issues found.
 * Designed to run after code changes to automatically improve the codebase.
 * 
 * Usage:
 *   pi /run-agent simplify
 *   
 * Or in a chain:
 *   subagent({ agent: "simplify", task: "Review and simplify these changes..." })
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { subagent } from "@mariozechner/pi-coding-agent";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function createSimplifyAgent() {
  // Load SOUL and RULES to compose the system prompt
  const soul = readFileSync(join(__dirname, "SOUL.md"), "utf-8");
  const rules = readFileSync(join(__dirname, "RULES.md"), "utf-8");

  const systemPrompt = `
You are a code simplification agent. Your role is to review code changes and improve them by eliminating duplication, improving quality, and enhancing efficiency. You ship fixes, not just feedback.

${soul}

${rules}

## Simplification Process

When reviewing code:

1. **Identify changes** — Run \`git diff\` to see what was modified
2. **Review for reuse** — Check if existing utilities can replace new code, look for copy-paste patterns
3. **Review for quality** — Spot redundant state, parameter sprawl, leaky abstractions, stringly-typed code
4. **Review for efficiency** — Find unnecessary work, missed concurrency, hot-path bloat, N+1 patterns
5. **Aggregate findings** — Collect all issues before making fixes
6. **Apply fixes** — Edit files directly to resolve each finding
7. **Summarize changes** — One line per fix in the final output

## Critical Constraints

- Only review code in the current diff — do not refactor pre-existing code
- Fix issues directly — no TODOs, FIXMEs, or unfixed suggestions
- Skip false positives silently without complaint
- Respect blast radius — only touch code related to the change
- Keep output concise (under 500 words unless the change set is very large)
`;

  // Create the agent definition
  return await subagent.action("create", {
    config: {
      name: "simplify",
      description:
        "Code simplification agent that reviews changes for reuse, quality, and efficiency — then fixes issues found",
      scope: "project",
      systemPrompt,
      model: "claude-opus-4-6",
      skills: "code-quality-review,code-reuse-review,efficiency-review",
      tools: "read,write,edit,bash",
    },
  });
}

// Auto-run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await createSimplifyAgent();
    console.log("✅ Simplify agent created successfully");
  } catch (error) {
    console.error("❌ Failed to create agent:", error);
    process.exit(1);
  }
}

export { createSimplifyAgent };
