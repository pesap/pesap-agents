export const SKILL_ENFORCEMENT_MAX_STREAK = 2;

export interface SkillVerificationResult {
  ok: boolean;
  reason: string;
  matchedSkills: string[];
  sectionText: string;
}

export interface SkillEnforcementDecision {
  action: "verified" | "workflow_audit_only" | "send_follow_up" | "max_streak_reached";
  nextStreak: number;
}

export interface SkillAuditResult {
  verification: SkillVerificationResult;
  enforcement: SkillEnforcementDecision;
}

type SkillCarrier = { skills: Array<{ name: string }> };

const SKILLS_HEADING_RE = /^\s*#{1,6}\s*skills?\s*(?:used|applied|check|activation)\b/i;
const SKILLS_INLINE_RE = /^\s*skills?\s*(?:used|applied|check|activation)\s*:\s*(.*)$/i;

function normalizeWhitespace(value: string): string {
  return value.replace(/\r\n/g, "\n").trim();
}

function splitLines(value: string): string[] {
  return normalizeWhitespace(value).split("\n");
}

function isListOrIndentedLine(line: string): boolean {
  return /^\s*(?:[-*]|\d+\.)\s+/.test(line) || /^\s{2,}\S/.test(line);
}

function extractInlineSkillsSection(lines: string[], startIndex: number, firstLineContent: string): string {
  const collected = [firstLineContent.trim()];

  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    if (SKILLS_HEADING_RE.test(line)) break;
    if (!line.trim()) break;
    if (!isListOrIndentedLine(line)) break;
    collected.push(line.trim());
  }

  return collected.join("\n").trim();
}

export function extractSkillsSection(assistantText: string): string {
  const lines = splitLines(assistantText);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";

    if (SKILLS_HEADING_RE.test(line)) {
      const collected: string[] = [];
      for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
        const nextLine = lines[cursor] ?? "";
        if (SKILLS_HEADING_RE.test(nextLine) || /^\s*#{1,6}\s+/.test(nextLine)) break;
        collected.push(nextLine);
      }
      return collected.join("\n").trim();
    }

    const inlineMatch = line.match(SKILLS_INLINE_RE);
    if (inlineMatch) {
      return extractInlineSkillsSection(lines, index, inlineMatch[1] ?? "");
    }
  }

  return "";
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function simplifyLine(line: string): string {
  return line
    .replace(/^\s*(?:[-*]|\d+\.)\s+/, "")
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function countMeaningfulWords(value: string): number {
  return value
    .split(/\s+/)
    .map((word) => word.replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, ""))
    .filter((word) => word.length >= 2).length;
}

function lineHasEvidenceForSkill(line: string, skillName: string): boolean {
  const simplifiedLine = simplifyLine(line);
  const skillRegex = new RegExp(escapeRegExp(skillName), "i");
  if (!skillRegex.test(simplifiedLine)) return false;

  const remainder = simplifiedLine
    .replace(skillRegex, " ")
    .replace(/[|:()-]/g, " ")
    .replace(/\b(?:used|applied|skill|skills|evidence|because|for|via|with|and)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return countMeaningfulWords(remainder) >= 2;
}

function sectionExplicitlySaysNone(sectionText: string): boolean {
  return /\bnone\b/i.test(sectionText) || /no\s+applicable\s+skill/i.test(sectionText);
}

function noneHasReason(sectionText: string): boolean {
  const remainder = sectionText
    .replace(/\b(?:none|n\/a|not applicable|no applicable skill(?:s)?)\b/gi, " ")
    .replace(/[|:()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return countMeaningfulWords(remainder) >= 3;
}

export function verifySkillSection(agent: SkillCarrier, assistantText: string): SkillVerificationResult {
  if (agent.skills.length === 0) {
    return { ok: true, reason: "no_skills", matchedSkills: [], sectionText: "" };
  }

  const sectionText = extractSkillsSection(assistantText);
  if (!sectionText) {
    return {
      ok: false,
      reason: "missing_skills_used_section",
      matchedSkills: [],
      sectionText: "",
    };
  }

  const matchedSkills = agent.skills
    .filter((skill) => sectionText.toLowerCase().includes(skill.name.toLowerCase()))
    .map((skill) => skill.name);

  if (matchedSkills.length === 0) {
    if (!sectionExplicitlySaysNone(sectionText)) {
      return {
        ok: false,
        reason: "skills_section_without_known_skill_or_none",
        matchedSkills: [],
        sectionText,
      };
    }

    if (!noneHasReason(sectionText)) {
      return {
        ok: false,
        reason: "skills_none_missing_reason",
        matchedSkills: [],
        sectionText,
      };
    }

    return { ok: true, reason: "ok_none", matchedSkills: [], sectionText };
  }

  const sectionLines = splitLines(sectionText).filter((line) => line.trim().length > 0);
  const skillsMissingEvidence = matchedSkills.filter(
    (skillName) => !sectionLines.some((line) => lineHasEvidenceForSkill(line, skillName)),
  );

  if (skillsMissingEvidence.length > 0) {
    return {
      ok: false,
      reason: "skill_evidence_missing",
      matchedSkills,
      sectionText,
    };
  }

  return { ok: true, reason: "ok", matchedSkills, sectionText };
}

export function decideSkillEnforcement(params: {
  verificationOk: boolean;
  activeWorkflow: boolean;
  currentStreak: number;
  maxStreak?: number;
}): SkillEnforcementDecision {
  const maxStreak = params.maxStreak ?? SKILL_ENFORCEMENT_MAX_STREAK;

  if (params.verificationOk) {
    return { action: "verified", nextStreak: 0 };
  }

  if (params.activeWorkflow) {
    return { action: "workflow_audit_only", nextStreak: params.currentStreak };
  }

  if (params.currentStreak < maxStreak) {
    return { action: "send_follow_up", nextStreak: params.currentStreak + 1 };
  }

  return { action: "max_streak_reached", nextStreak: params.currentStreak };
}

export function auditSkillResponse(params: {
  agent: SkillCarrier;
  assistantText: string;
  activeWorkflow: boolean;
  currentStreak: number;
  maxStreak?: number;
}): SkillAuditResult {
  const verification = verifySkillSection(params.agent, params.assistantText);
  const enforcement = decideSkillEnforcement({
    verificationOk: verification.ok,
    activeWorkflow: params.activeWorkflow,
    currentStreak: params.currentStreak,
    maxStreak: params.maxStreak,
  });

  return { verification, enforcement };
}

export function formatSkillVerificationHookStatus(skillCount: number, maxStreak = SKILL_ENFORCEMENT_MAX_STREAK): string {
  if (skillCount === 0) {
    return "inactive (no skills loaded)";
  }

  return [
    "active",
    `(strict on normal turns, audit-only during /gitagent run and /gitagent chain, auto follow-up max streak ${maxStreak})`,
  ].join(" ");
}
