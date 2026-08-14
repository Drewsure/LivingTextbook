export type AiExternalPrototypeTaskExportGateStatus = "blocked" | "review-only";
export type AiExternalPrototypeTaskExportCheckStatus = "blocked" | "ready-preview";

export interface AiExternalPrototypeTaskExportCheck {
  checkId: string;
  label: string;
  status: AiExternalPrototypeTaskExportCheckStatus;
  evidenceRequired: string[];
  blocksUntil: string;
}

export interface AiExternalPrototypeTaskExportChannel {
  channelId: string;
  label: string;
  status: "blocked";
  purpose: string;
  blockedReason: string;
}

export interface AiExternalPrototypeTaskExportReadinessGate {
  gateId: string;
  tenantId: string;
  requestId: string;
  taskPacketId: string;
  label: string;
  status: AiExternalPrototypeTaskExportGateStatus;
  summary: string;
  sourceRecords: string[];
  exportChannels: AiExternalPrototypeTaskExportChannel[];
  readinessChecks: AiExternalPrototypeTaskExportCheck[];
  blockedActions: string[];
}

export const AI_EXTERNAL_TASK_EXPORT_REQUIRED_SOURCE_RECORDS = [
  "ai_external_prototype_task_packet",
  "ai_generator_responsibility_matrix",
  "ai_generator_reviewer_runbook",
  "ai_generator_review_summary",
  "reviewer_identity_signature_gate",
  "evidence_packet",
  "ai_prototype_return_review",
] as const;

export const AI_EXTERNAL_TASK_EXPORT_REQUIRED_CHANNEL_IDS = [
  "manual-prompt-copy-preview",
  "repository-issue-preview",
  "task-archive-preview",
] as const;

export const AI_EXTERNAL_TASK_EXPORT_REQUIRED_CHECK_IDS = [
  "reviewer-identity-required",
  "evidence-storage-required",
  "task-packet-storage-required",
  "repository-policy-required",
  "return-review-intake-required",
] as const;

export const AI_EXTERNAL_TASK_EXPORT_REQUIRED_BLOCKED_ACTIONS = [
  "No task export",
  "No prompt copy action",
  "No repository issue creation",
  "No archive download",
  "No live handoff",
  "No app file writes",
  "No route creation",
  "No scoring authority",
  "No student-facing pathway",
  "No support-language progress",
] as const;

export function validateAiExternalPrototypeTaskExportReadinessGate(gate: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(gate)) {
    return ["AI external task export readiness gate must be a JSON object."];
  }

  const gateId = readString(gate, "gateId");
  const tenantId = readString(gate, "tenantId");
  const requestId = readString(gate, "requestId");
  const taskPacketId = readString(gate, "taskPacketId");
  const label = readString(gate, "label");
  const status = readString(gate, "status");
  const summary = readString(gate, "summary");
  const sourceRecords = readStringArray(gate, "sourceRecords");
  const exportChannels = readExportChannels(gate);
  const readinessChecks = readReadinessChecks(gate);
  const blockedActions = readStringArray(gate, "blockedActions");

  if (!gateId || !tenantId || !requestId || !taskPacketId) {
    errors.push("AI external task export readiness gate must include gateId, tenantId, requestId, and taskPacketId.");
  }

  if (!label.includes("external task export readiness gate")) {
    errors.push("AI external task export readiness gate label must name the export readiness gate.");
  }

  if (status !== "blocked") {
    errors.push("AI external task export readiness gate must stay blocked.");
  }

  if (!summary.includes("Export readiness blocked")) {
    errors.push("AI external task export readiness gate summary must say export readiness is blocked.");
  }

  for (const requiredRecord of AI_EXTERNAL_TASK_EXPORT_REQUIRED_SOURCE_RECORDS) {
    if (!sourceRecords.includes(requiredRecord)) {
      errors.push(`AI external task export readiness gate must include source record: ${requiredRecord}.`);
    }
  }

  for (const requiredChannelId of AI_EXTERNAL_TASK_EXPORT_REQUIRED_CHANNEL_IDS) {
    if (!exportChannels.some((channel) => channel.channelId === requiredChannelId)) {
      errors.push(`AI external task export readiness gate must include export channel: ${requiredChannelId}.`);
    }
  }

  for (const channel of exportChannels) {
    if (channel.status !== "blocked") {
      errors.push(`AI external task export channel ${channel.channelId} must stay blocked.`);
    }

    if (!channel.label || !channel.purpose || !channel.blockedReason) {
      errors.push(`AI external task export channel ${channel.channelId} must include label, purpose, and blocked reason.`);
    }
  }

  for (const requiredCheckId of AI_EXTERNAL_TASK_EXPORT_REQUIRED_CHECK_IDS) {
    if (!readinessChecks.some((check) => check.checkId === requiredCheckId)) {
      errors.push(`AI external task export readiness gate must include readiness check: ${requiredCheckId}.`);
    }
  }

  for (const check of readinessChecks) {
    if (check.status !== "blocked" && check.status !== "ready-preview") {
      errors.push(`AI external task export readiness check ${check.checkId} must use a blocked or ready-preview status.`);
    }

    if (!check.label || check.evidenceRequired.length === 0 || !check.blocksUntil) {
      errors.push(`AI external task export readiness check ${check.checkId} must include label, evidence, and blocksUntil.`);
    }
  }

  if (!readinessChecks.some((check) => textListIncludes(check.evidenceRequired, "Codex owner confirmation required"))) {
    errors.push("AI external task export readiness gate must require Codex owner confirmation.");
  }

  for (const requiredAction of AI_EXTERNAL_TASK_EXPORT_REQUIRED_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, requiredAction)) {
      errors.push(`AI external task export readiness gate must block action: ${requiredAction}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(blockedActions, "No Japanese support-language progress")) {
    errors.push("MiniStar AI external task export readiness gate must block Japanese support-language progress.");
  }

  return errors;
}

export function getAiExternalPrototypeTaskExportReadinessGateWarnings(gate: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(gate)) {
    return warnings;
  }

  const readinessChecks = readReadinessChecks(gate);
  const exportChannels = readExportChannels(gate);

  if (!readinessChecks.some((check) => check.status === "ready-preview")) {
    warnings.push("AI external task export readiness gate should identify durable task packet storage as ready-preview when applicable.");
  }

  if (!exportChannels.every((channel) => channel.blockedReason.includes("until"))) {
    warnings.push("Every export channel should explain what must exist before it can open.");
  }

  return warnings;
}

export function validateAiExternalPrototypeTaskExportReadinessGates(gates: unknown[]): string[] {
  return gates.flatMap((gate) => validateAiExternalPrototypeTaskExportReadinessGate(gate));
}

export function getAiExternalPrototypeTaskExportReadinessGateCollectionWarnings(gates: unknown[]): string[] {
  return gates.flatMap((gate) => getAiExternalPrototypeTaskExportReadinessGateWarnings(gate));
}

function readExportChannels(source: Record<string, unknown>): AiExternalPrototypeTaskExportChannel[] {
  const value = source.exportChannels;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((channel) => ({
    channelId: readString(channel, "channelId"),
    label: readString(channel, "label"),
    status: readString(channel, "status") as "blocked",
    purpose: readString(channel, "purpose"),
    blockedReason: readString(channel, "blockedReason"),
  }));
}

function readReadinessChecks(source: Record<string, unknown>): AiExternalPrototypeTaskExportCheck[] {
  const value = source.readinessChecks;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((check) => ({
    checkId: readString(check, "checkId"),
    label: readString(check, "label"),
    status: readString(check, "status") as AiExternalPrototypeTaskExportCheckStatus,
    evidenceRequired: readStringArray(check, "evidenceRequired"),
    blocksUntil: readString(check, "blocksUntil"),
  }));
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

function textListIncludes(items: string[], expected: string): boolean {
  return items.some((item) => item.includes(expected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
