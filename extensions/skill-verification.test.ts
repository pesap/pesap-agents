import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  auditSkillResponse,
  decideSkillEnforcement,
  extractSkillsSection,
  formatSkillVerificationHookStatus,
  verifySkillSection,
} from "./skill-verification.js";

const agent = {
  skills: [{ name: "cli-design" }, { name: "error-handling" }],
};

test("extractSkillsSection reads markdown heading blocks", () => {
  const section = extractSkillsSection([
    "Summary",
    "",
    "## Skills Used",
    "- cli-design: tightened flag naming and help wording",
    "- error-handling: checked failure messages for user actionability",
    "",
    "## Next Steps",
    "None",
  ].join("\n"));

  assert.equal(
    section,
    "- cli-design: tightened flag naming and help wording\n- error-handling: checked failure messages for user actionability",
  );
});

test("verifySkillSection fails when the section is missing", () => {
  const result = verifySkillSection(agent, "I reviewed the CLI and used cli-design heavily.");

  assert.equal(result.ok, false);
  assert.equal(result.reason, "missing_skills_used_section");
});

test("verifySkillSection only matches skills named inside the skills section", () => {
  const result = verifySkillSection(
    agent,
    [
      "I used cli-design in the analysis above.",
      "",
      "## Skills Used",
      "- tightened the answer formatting",
    ].join("\n"),
  );

  assert.equal(result.ok, false);
  assert.equal(result.reason, "skills_section_without_known_skill_or_none");
});

test("verifySkillSection accepts known skills with one-line evidence", () => {
  const result = verifySkillSection(
    agent,
    [
      "Done.",
      "",
      "## Skills Used",
      "- cli-design: simplified option names and help text to reduce ambiguity",
      "- error-handling: checked error paths now point users to the next fix step",
    ].join("\n"),
  );

  assert.equal(result.ok, true);
  assert.deepEqual(result.matchedSkills, ["cli-design", "error-handling"]);
});

test("verifySkillSection rejects skill names without evidence", () => {
  const result = verifySkillSection(
    agent,
    ["Done.", "", "Skills Used: cli-design", "- error-handling"].join("\n"),
  );

  assert.equal(result.ok, false);
  assert.equal(result.reason, "skill_evidence_missing");
});

test("verifySkillSection accepts explicit none with a reason", () => {
  const result = verifySkillSection(
    agent,
    [
      "Done.",
      "",
      "Skills Used: none, this was a tiny status confirmation with no domain-specific checklist to apply",
    ].join("\n"),
  );

  assert.equal(result.ok, true);
  assert.equal(result.reason, "ok_none");
});

test("verifySkillSection rejects explicit none without a reason", () => {
  const result = verifySkillSection(agent, ["Done.", "", "Skills Used: none"].join("\n"));

  assert.equal(result.ok, false);
  assert.equal(result.reason, "skills_none_missing_reason");
});

test("decideSkillEnforcement skips follow-up during workflows", () => {
  const decision = decideSkillEnforcement({
    verificationOk: false,
    activeWorkflow: true,
    currentStreak: 1,
  });

  assert.deepEqual(decision, { action: "workflow_audit_only", nextStreak: 1 });
});

test("decideSkillEnforcement increments streak on normal failed turns", () => {
  const decision = decideSkillEnforcement({
    verificationOk: false,
    activeWorkflow: false,
    currentStreak: 1,
    maxStreak: 2,
  });

  assert.deepEqual(decision, { action: "send_follow_up", nextStreak: 2 });
});

test("decideSkillEnforcement resets streak after a verified response", () => {
  const decision = decideSkillEnforcement({
    verificationOk: true,
    activeWorkflow: false,
    currentStreak: 2,
  });

  assert.deepEqual(decision, { action: "verified", nextStreak: 0 });
});

test("auditSkillResponse keeps verification and enforcement in one result", () => {
  const result = auditSkillResponse({
    agent,
    assistantText: ["Done.", "", "Skills Used: cli-design"].join("\n"),
    activeWorkflow: false,
    currentStreak: 1,
    maxStreak: 2,
  });

  assert.equal(result.verification.ok, false);
  assert.equal(result.verification.reason, "skill_evidence_missing");
  assert.deepEqual(result.enforcement, { action: "send_follow_up", nextStreak: 2 });
});

test("formatSkillVerificationHookStatus describes workflow audit-only mode", () => {
  assert.equal(
    formatSkillVerificationHookStatus(2),
    "active (strict on normal turns, audit-only during /gitagent run and /gitagent chain, auto follow-up max streak 2)",
  );
  assert.equal(formatSkillVerificationHookStatus(0), "inactive (no skills loaded)");
});
