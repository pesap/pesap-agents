import type { LoadedAgent } from "./loader.js";

export interface PendingRestore {
  agent: LoadedAgent | null;
  ref: string | null;
}

export type WorkflowMode = "run" | "chain";

export interface WorkflowRun {
  mode: WorkflowMode;
  refs: string[];
  task: string;
  currentStep: number;
  previousOutput: string | null;
  restore: PendingRestore;
}

export interface GitAgentRuntimeState {
  currentAgent: LoadedAgent | null;
  currentRef: string | null;
  pendingRestore: PendingRestore | null;
  activeWorkflow: WorkflowRun | null;
  rememberedThisSession: boolean;
  lastSkillAuditFingerprint: string | null;
  lastFeedbackFingerprint: string | null;
  skillEnforcementStreak: number;
}

export function createRuntimeState(): GitAgentRuntimeState {
  return {
    currentAgent: null,
    currentRef: null,
    pendingRestore: null,
    activeWorkflow: null,
    rememberedThisSession: false,
    lastSkillAuditFingerprint: null,
    lastFeedbackFingerprint: null,
    skillEnforcementStreak: 0,
  };
}
