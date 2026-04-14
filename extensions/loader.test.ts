import { strict as assert } from "node:assert";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import { loadAgent } from "./loader.js";

test("loadAgent keeps multiline skill sections and checklist items", () => {
  const agentDir = mkdtempSync(join(tmpdir(), "pi-gitagent-loader-"));

  try {
    writeFileSync(
      join(agentDir, "agent.yaml"),
      [
        'name: test-agent',
        'version: "1.0.0"',
        'description: test agent',
        'skills:',
        '  - sample-skill',
      ].join("\n"),
    );

    mkdirSync(join(agentDir, "skills", "sample-skill"), { recursive: true });
    writeFileSync(
      join(agentDir, "skills", "sample-skill", "SKILL.md"),
      [
        '---',
        'name: sample-skill',
        'description: sample description',
        '---',
        '# Sample Skill',
        '',
        '## When to Use',
        '- Inspect command UX',
        '- Review help text',
        '',
        '## Instructions',
        'Start with the summary sentence.',
        '',
        '1. Check the command shape.',
        '2. Check the help text.',
        '',
        '## Notes',
        'Ignore this section for the checklist.',
      ].join("\n"),
    );

    const loaded = loadAgent(agentDir);
    assert.equal(loaded.skills.length, 1);
    assert.equal(loaded.skills[0]?.whenToUse, "- Inspect command UX\n- Review help text");
    assert.deepEqual(loaded.skills[0]?.instructionChecklist, [
      "Check the command shape.",
      "Check the help text.",
    ]);
  } finally {
    rmSync(agentDir, { recursive: true, force: true });
  }
});
