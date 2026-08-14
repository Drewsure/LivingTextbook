export type AiGeneratedPublishReadinessStatus = "blocked" | "ready-for-review";
export type AiGeneratedPublishReadinessCheckStatus = "ready-preview" | "blocked" | "missing";

export interface AiGeneratedPublishReadinessCheck {
  checkId: string;
  label: string;
  status: AiGeneratedPublishReadinessCheckStatus;
  evidence: string;
  requiredRecord: string;
  studentUseEffect: string;
}

export interface AiGeneratedPublishReadinessGate {
  gateId: string;
  tenantId: string;
  requestId: string;
  manifestId: string;
  label: string;
  summary: string;
  status: AiGeneratedPublishReadinessStatus;
  publishState: string;
  futureStudentRoute: string;
  checks: AiGeneratedPublishReadinessCheck[];
  allowedNow: string[];
  blockedActions: string[];
  nextRecords: string[];
}

export const AI_GENERATED_PUBLISH_READINESS_REQUIRED_CHECK_IDS = [
  "draft-correction-queue-clear",
  "verifier-packet-approved",
  "manifest-records-complete",
  "reward-readiness-passed",
  "release-control-bound",
  "teacher-approval-ledger",
] as const;

export const AI_GENERATED_PUBLISH_READINESS_REQUIRED_BLOCKED_ACTIONS = [
  "Create launch route from generated package blocked",
  "Write tenant route registry entry blocked",
  "Write media playlist from generated package blocked",
  "Create assignment from generated package blocked",
  "Write local bundle from generated package blocked",
  "Mark generated package student-ready blocked",
  "support-language-only generated package blocked",
] as const;

export const AI_GENERATED_PUBLISH_READINESS_REQUIRED_NEXT_RECORDS = [
  "ai_generated_package_manifest",
  "ai_verifier_submission_packet",
  "package_game_audio_coverage",
  "media_rights_manifest",
  "ai_reward_readiness_gate",
  "package_publish_gate",
  "package_approval_ledger",
] as const;

export function validateAiGeneratedPublishReadinessGate(gate: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(gate)) {
    return ["AI generated publish readiness gate must be a JSON object."];
  }

  const gateId = readString(gate, "gateId");
  const tenantId = readString(gate, "tenantId");
  const requestId = readString(gate, "requestId");
  const manifestId = readString(gate, "manifestId");
  const label = readString(gate, "label");
  const summary = readString(gate, "summary");
  const status = readString(gate, "status");
  const publishState = readString(gate, "publishState");
  const futureStudentRoute = readString(gate, "futureStudentRoute");
  const checks = readChecks(gate, "checks");
  const allowedNow = readStringArray(gate, "allowedNow");
  const blockedActions = readStringArray(gate, "blockedActions");
  const nextRecords = readStringArray(gate, "nextRecords");

  if (!gateId || !tenantId || !requestId || !manifestId) {
    errors.push("AI generated publish readiness gate must include gate, tenant, request, and manifest ids.");
  }

  if (!label.toLowerCase().includes("generated publish readiness gate")) {
    errors.push("AI generated publish readiness gate label must name the publish readiness gate.");
  }

  if (!summary.toLowerCase().includes("last-mile")) {
    errors.push("AI generated publish readiness gate summary must describe the last-mile review boundary.");
  }

  if (status !== "blocked" && status !== "ready-for-review") {
    errors.push("AI generated publish readiness gate must use a supported review-only status.");
  }

  if (!publishState.toLowerCase().includes("student route publish blocked")) {
    errors.push("AI generated publish readiness gate must keep student route publishing blocked.");
  }

  if (!futureStudentRoute.toLowerCase().includes("blocked")) {
    errors.push("AI generated publish readiness gate future route must stay blocked.");
  }

  for (const checkId of AI_GENERATED_PUBLISH_READINESS_REQUIRED_CHECK_IDS) {
    if (!checks.some((check) => check.checkId === checkId)) {
      errors.push(`AI generated publish readiness gate must include check: ${checkId}.`);
    }
  }

  for (const check of checks) {
    if (!check.label || !check.evidence || !check.requiredRecord || !check.studentUseEffect) {
      errors.push(`AI generated publish readiness check must include full evidence: ${check.checkId}.`);
    }

    if (check.status !== "ready-preview" && check.status !== "blocked" && check.status !== "missing") {
      errors.push(`AI generated publish readiness check must use a supported preview status: ${check.checkId}.`);
    }
  }

  if (!textListIncludes(allowedNow, "Review generated draft evidence")) {
    errors.push("AI generated publish readiness gate must allow review work only.");
  }

  for (const blockedAction of AI_GENERATED_PUBLISH_READINESS_REQUIRED_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI generated publish readiness gate must block action: ${blockedAction}.`);
    }
  }

  for (const record of AI_GENERATED_PUBLISH_READINESS_REQUIRED_NEXT_RECORDS) {
    if (!nextRecords.includes(record)) {
      errors.push(`AI generated publish readiness gate must include next record: ${record}.`);
    }
  }

  return errors;
}

export function getAiGeneratedPublishReadinessGateWarnings(gate: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(gate)) {
    return warnings;
  }

  const checks = readChecks(gate, "checks");
  const blockedActions = readStringArray(gate, "blockedActions");

  if (!checks.some((check) => check.status === "blocked" || check.status === "missing")) {
    warnings.push("Generated publish readiness gates should keep at least one blocker visible until release-control exists.");
  }

  if (!textListIncludes(blockedActions, "support-language-only")) {
    warnings.push("Generated publish readiness gates should block support-language-only publishing explicitly.");
  }

  return warnings;
}

export function validateAiGeneratedPublishReadinessGates(gates: unknown[]): string[] {
  return gates.flatMap((gate) => validateAiGeneratedPublishReadinessGate(gate));
}

export function getAiGeneratedPublishReadinessGateCollectionWarnings(gates: unknown[]): string[] {
  return gates.flatMap((gate) => getAiGeneratedPublishReadinessGateWarnings(gate));
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

function readChecks(source: Record<string, unknown>, key: string): AiGeneratedPublishReadinessCheck[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    checkId: readString(item, "checkId"),
    label: readString(item, "label"),
    status: readString(item, "status") as AiGeneratedPublishReadinessCheckStatus,
    evidence: readString(item, "evidence"),
    requiredRecord: readString(item, "requiredRecord"),
    studentUseEffect: readString(item, "studentUseEffect"),
  }));
}

function textListIncludes(items: string[], expected: string): boolean {
  const normalizedExpected = expected.toLowerCase();
  return items.some((item) => item.toLowerCase().includes(normalizedExpected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
