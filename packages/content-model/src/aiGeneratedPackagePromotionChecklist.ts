export type AiGeneratedPackagePromotionStatus = "blocked" | "ready-for-review";
export type AiGeneratedPackagePromotionStepStatus = "ready-preview" | "blocked" | "missing";

export interface AiGeneratedPackagePromotionStep {
  stepId: string;
  label: string;
  status: AiGeneratedPackagePromotionStepStatus;
  requiredRecord: string;
  evidence: string;
  releaseBoundary: string;
}

export interface AiGeneratedPackagePromotionChecklist {
  checklistId: string;
  tenantId: string;
  requestId: string;
  manifestId: string;
  lineageId: string;
  label: string;
  pathwayLabel: string;
  summary: string;
  status: AiGeneratedPackagePromotionStatus;
  currentPackageState: string;
  futurePromotionTarget: string;
  steps: AiGeneratedPackagePromotionStep[];
  allowedNow: string[];
  blockedActions: string[];
  nextRecords: string[];
}

export const AI_GENERATED_PACKAGE_PROMOTION_REQUIRED_STEP_IDS = [
  "lineage-reviewed",
  "correction-queue-clear",
  "target-audio-approved",
  "verifier-accepted",
  "manifest-complete",
  "reward-and-collection-reviewed",
  "release-control-bound",
  "student-route-scheduled",
] as const;

export const AI_GENERATED_PACKAGE_PROMOTION_REQUIRED_NEXT_RECORDS = [
  "package_game_audio_coverage",
  "media_rights_manifest",
  "ai_verifier_result_evidence_packet",
  "ai_verifier_submission_packet",
  "package_publish_gate",
  "package_approval_ledger",
  "teacher_assignment_rollout_gate",
  "class_roster_plan",
  "release_control_adapter_write_intent",
] as const;

export const AI_GENERATED_PACKAGE_PROMOTION_BLOCKED_ACTIONS = [
  "No promote generated package button",
  "No generated route registry write",
  "No generated playlist write",
  "No generated assignment write",
  "No local companion bundle write",
  "No student-ready marker from promotion checklist",
  "No support-language-only promotion",
] as const;

export function validateAiGeneratedPackagePromotionChecklist(checklist: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(checklist)) {
    return ["AI generated package promotion checklist must be a JSON object."];
  }

  const checklistId = readString(checklist, "checklistId");
  const tenantId = readString(checklist, "tenantId");
  const requestId = readString(checklist, "requestId");
  const manifestId = readString(checklist, "manifestId");
  const lineageId = readString(checklist, "lineageId");
  const label = readString(checklist, "label");
  const pathwayLabel = readString(checklist, "pathwayLabel");
  const summary = readString(checklist, "summary");
  const status = readString(checklist, "status");
  const currentPackageState = readString(checklist, "currentPackageState");
  const futurePromotionTarget = readString(checklist, "futurePromotionTarget");
  const steps = readSteps(checklist, "steps");
  const allowedNow = readStringArray(checklist, "allowedNow");
  const blockedActions = readStringArray(checklist, "blockedActions");
  const nextRecords = readStringArray(checklist, "nextRecords");

  if (!checklistId || !tenantId || !requestId || !manifestId || !lineageId) {
    errors.push("AI generated package promotion checklist must include checklist, tenant, request, manifest, and lineage ids.");
  }

  if (!label.toLowerCase().includes("generated package promotion checklist")) {
    errors.push("AI generated package promotion checklist label must name the promotion checklist.");
  }

  if (!pathwayLabel.toLowerCase().includes("draft-to-playable")) {
    errors.push("AI generated package promotion checklist must name the draft-to-playable pathway.");
  }

  if (!summary.toLowerCase().includes("teacher") && !summary.toLowerCase().includes("admin")) {
    errors.push("AI generated package promotion checklist summary must describe teacher or admin review.");
  }

  if (status !== "blocked" && status !== "ready-for-review") {
    errors.push("AI generated package promotion checklist must use a supported review-only status.");
  }

  if (!currentPackageState.toLowerCase().includes("promotion blocked")) {
    errors.push("AI generated package promotion checklist must keep package promotion blocked.");
  }

  if (!futurePromotionTarget.toLowerCase().includes("blocked")) {
    errors.push("AI generated package promotion checklist future target must stay blocked.");
  }

  for (const stepId of AI_GENERATED_PACKAGE_PROMOTION_REQUIRED_STEP_IDS) {
    if (!steps.some((step) => step.stepId === stepId)) {
      errors.push(`AI generated package promotion checklist must include step: ${stepId}.`);
    }
  }

  for (const step of steps) {
    if (!step.label || !step.requiredRecord || !step.evidence || !step.releaseBoundary) {
      errors.push(`AI generated package promotion checklist step must include full evidence: ${step.stepId}.`);
    }

    if (step.status !== "ready-preview" && step.status !== "blocked" && step.status !== "missing") {
      errors.push(`AI generated package promotion checklist step must use a supported preview status: ${step.stepId}.`);
    }
  }

  if (!textListIncludes(allowedNow, "Review promotion evidence")) {
    errors.push("AI generated package promotion checklist must allow review work only.");
  }

  for (const blockedAction of AI_GENERATED_PACKAGE_PROMOTION_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI generated package promotion checklist must block action: ${blockedAction}.`);
    }
  }

  for (const record of AI_GENERATED_PACKAGE_PROMOTION_REQUIRED_NEXT_RECORDS) {
    if (!nextRecords.includes(record)) {
      errors.push(`AI generated package promotion checklist must include next record: ${record}.`);
    }
  }

  if (!steps.some((step) => step.requiredRecord === "ai_verifier_result_evidence_packet")) {
    errors.push("AI generated package promotion checklist must depend on verifier result evidence.");
  }

  if (tenantId === "ministar") {
    const combinedText = [...steps.map((step) => `${step.label} ${step.evidence} ${step.releaseBoundary}`), ...blockedActions];

    if (
      !textListIncludes(combinedText, "English is the target-language trigger") ||
      !textListIncludes(combinedText, "hiragana") ||
      !textListIncludes(combinedText, "support-only") ||
      !textListIncludes(blockedActions, "No Japanese support-language promotion")
    ) {
      errors.push("MiniStar generated package promotion checklist must preserve English and hiragana support-only promotion boundaries.");
    }
  }

  return errors;
}

export function getAiGeneratedPackagePromotionChecklistWarnings(checklist: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(checklist)) {
    return warnings;
  }

  const steps = readSteps(checklist, "steps");
  const blockedActions = readStringArray(checklist, "blockedActions");

  if (!steps.some((step) => step.status === "blocked" || step.status === "missing")) {
    warnings.push("Generated package promotion checklists should keep at least one blocker visible until live release gates exist.");
  }

  if (!textListIncludes(blockedActions, "No support-language-only promotion")) {
    warnings.push("Generated package promotion checklists should block support-language-only promotion explicitly.");
  }

  return warnings;
}

export function validateAiGeneratedPackagePromotionChecklists(checklists: unknown[]): string[] {
  return checklists.flatMap((checklist) => validateAiGeneratedPackagePromotionChecklist(checklist));
}

export function getAiGeneratedPackagePromotionChecklistCollectionWarnings(checklists: unknown[]): string[] {
  return checklists.flatMap((checklist) => getAiGeneratedPackagePromotionChecklistWarnings(checklist));
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function readSteps(source: Record<string, unknown>, key: string): AiGeneratedPackagePromotionStep[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    stepId: readString(item, "stepId"),
    label: readString(item, "label"),
    status: readString(item, "status") as AiGeneratedPackagePromotionStepStatus,
    requiredRecord: readString(item, "requiredRecord"),
    evidence: readString(item, "evidence"),
    releaseBoundary: readString(item, "releaseBoundary"),
  }));
}

function textListIncludes(items: string[], expected: string): boolean {
  const normalizedExpected = expected.toLowerCase();
  return items.some((item) => item.toLowerCase().includes(normalizedExpected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
