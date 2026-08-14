export type AiPrototypeIntegrationReadinessGateStatus = "blocked" | "review-only" | "ready-for-codex-review";
export type AiPrototypeIntegrationEvidenceStatus = "missing" | "pending-review" | "blocked" | "reviewed";

export interface AiPrototypeIntegrationEvidenceCheck {
  checkId: string;
  label: string;
  sourceRecord: string;
  status: AiPrototypeIntegrationEvidenceStatus;
  requiredBeforeIntegration: boolean;
  blocker: string;
}

export interface AiPrototypeIntegrationReadinessGate {
  gateId: string;
  tenantId: string;
  requestId: string;
  integrationPlanId: string;
  label: string;
  status: AiPrototypeIntegrationReadinessGateStatus;
  summary: string;
  sourceRecords: string[];
  evidenceChecks: AiPrototypeIntegrationEvidenceCheck[];
  integrationPolicy: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const AI_PROTOTYPE_INTEGRATION_READINESS_REQUIRED_SOURCE_RECORDS = [
  "ai_prototype_integration_readiness_gate",
  "ai_prototype_integration_plan",
  "ai_prototype_wrapper_adapter_review",
  "ai_prototype_fixture_replay_report",
  "ai_prototype_event_replay_report",
  "ai_prototype_audio_coverage_report",
  "ai_prototype_mobile_accessibility_report",
  "ai_prototype_scoring_replay_report",
  "codex_integration_review_decision",
] as const;

export const AI_PROTOTYPE_INTEGRATION_READINESS_REQUIRED_EVIDENCE_RECORDS = [
  "prototype_wrapper_adapter_review",
  "prototype_fixture_replay_report",
  "prototype_event_replay_report",
  "prototype_audio_coverage_report",
  "prototype_mobile_accessibility_report",
  "prototype_scoring_replay_report",
  "codex_integration_review_decision",
] as const;

export const AI_PROTOTYPE_INTEGRATION_READINESS_REQUIRED_POLICY = [
  "All prototype evidence before integration",
  "Parent-engine wrapper only",
  "Reviewed JSON fixture required",
  "Standard events required",
  "Target-language audio required",
  "Phone-first accessibility required",
  "Deterministic scoring replay required",
] as const;

export const AI_PROTOTYPE_INTEGRATION_READINESS_BLOCKED_ACTIONS = [
  "No apps/web patch",
  "No direct import",
  "No route registry write",
  "No student-facing route",
  "No scoring profile mutation",
  "No Star Dust or reward write",
  "No audio manifest mutation",
  "No package promotion",
  "No student assignment",
] as const;

export const AI_PROTOTYPE_INTEGRATION_READINESS_NEXT_RECORDS = [
  "Accepted wrapper adapter review",
  "Accepted fixture replay report",
  "Accepted event replay report",
  "Accepted audio coverage report",
  "Accepted mobile accessibility report",
  "Accepted scoring replay report",
  "Codex integration decision",
] as const;

export function validateAiPrototypeIntegrationReadinessGate(gate: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(gate)) {
    return ["AI prototype integration readiness gate must be a JSON object."];
  }

  const gateId = readString(gate, "gateId");
  const tenantId = readString(gate, "tenantId");
  const requestId = readString(gate, "requestId");
  const integrationPlanId = readString(gate, "integrationPlanId");
  const label = readString(gate, "label");
  const status = readString(gate, "status");
  const summary = readString(gate, "summary");
  const sourceRecords = readStringArray(gate, "sourceRecords");
  const evidenceChecks = readEvidenceChecks(gate);
  const integrationPolicy = readStringArray(gate, "integrationPolicy");
  const blockedActions = readStringArray(gate, "blockedActions");
  const nextRequiredRecords = readStringArray(gate, "nextRequiredRecords");

  if (!gateId || !tenantId || !requestId || !integrationPlanId) {
    errors.push("AI prototype integration readiness gate must include gateId, tenantId, requestId, and integrationPlanId.");
  }

  if (!label.includes("prototype integration readiness gate")) {
    errors.push("AI prototype integration readiness gate label must name the prototype integration readiness gate.");
  }

  if (status !== "blocked" && status !== "review-only" && status !== "ready-for-codex-review") {
    errors.push("AI prototype integration readiness gate must use a supported review-only status.");
  }

  if (!summary.includes("Review-only rollup") || !summary.includes("apps/web integration patch")) {
    errors.push("AI prototype integration readiness gate summary must keep the gate review-only before apps/web patches.");
  }

  for (const sourceRecord of AI_PROTOTYPE_INTEGRATION_READINESS_REQUIRED_SOURCE_RECORDS) {
    if (!sourceRecords.includes(sourceRecord)) {
      errors.push(`AI prototype integration readiness gate must include source record: ${sourceRecord}.`);
    }
  }

  for (const evidenceRecord of AI_PROTOTYPE_INTEGRATION_READINESS_REQUIRED_EVIDENCE_RECORDS) {
    const matchingCheck = evidenceChecks.find((check) => check.sourceRecord === evidenceRecord);

    if (!matchingCheck) {
      errors.push(`AI prototype integration readiness gate must include evidence record: ${evidenceRecord}.`);
      continue;
    }

    if (!matchingCheck.requiredBeforeIntegration) {
      errors.push(`AI prototype integration readiness gate must require evidence before integration: ${evidenceRecord}.`);
    }

    if (!matchingCheck.blocker) {
      errors.push(`AI prototype integration readiness gate evidence record must include a blocker: ${evidenceRecord}.`);
    }
  }

  for (const policy of AI_PROTOTYPE_INTEGRATION_READINESS_REQUIRED_POLICY) {
    if (!integrationPolicy.includes(policy)) {
      errors.push(`AI prototype integration readiness gate must include policy: ${policy}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_INTEGRATION_READINESS_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype integration readiness gate must block action: ${blockedAction}.`);
    }
  }

  for (const nextRecord of AI_PROTOTYPE_INTEGRATION_READINESS_NEXT_RECORDS) {
    if (!nextRequiredRecords.includes(nextRecord)) {
      errors.push(`AI prototype integration readiness gate must include next required record: ${nextRecord}.`);
    }
  }

  if (!evidenceChecks.some((check) => check.status === "blocked")) {
    errors.push("AI prototype integration readiness gate must keep evidence checks blocked until review completes.");
  }

  if (tenantId === "ministar") {
    if (!integrationPolicy.includes("Japanese support remains hiragana-only and support-only")) {
      errors.push("MiniStar AI prototype integration readiness gate must preserve hiragana-only support policy.");
    }

    if (!textListIncludes(blockedActions, "No Japanese support-language scoring or release")) {
      errors.push("MiniStar AI prototype integration readiness gate must block Japanese support-language scoring or release.");
    }
  }

  return errors;
}

export function getAiPrototypeIntegrationReadinessGateWarnings(gate: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(gate)) {
    return warnings;
  }

  const status = readString(gate, "status");
  const evidenceChecks = readEvidenceChecks(gate);
  const blockedActions = readStringArray(gate, "blockedActions");

  if (status === "ready-for-codex-review" && !evidenceChecks.every((check) => check.status === "reviewed")) {
    warnings.push("A ready-for-codex-review integration gate should have every evidence check reviewed.");
  }

  if (!evidenceChecks.every((check) => check.requiredBeforeIntegration)) {
    warnings.push("Every integration readiness evidence check should be required before integration.");
  }

  if (!textListIncludes(blockedActions, "No student assignment")) {
    warnings.push("Integration readiness gates should block student assignment until integration approval exists.");
  }

  return warnings;
}

export function validateAiPrototypeIntegrationReadinessGates(gates: unknown[]): string[] {
  return gates.flatMap((gate) => validateAiPrototypeIntegrationReadinessGate(gate));
}

export function getAiPrototypeIntegrationReadinessGateCollectionWarnings(gates: unknown[]): string[] {
  return gates.flatMap((gate) => getAiPrototypeIntegrationReadinessGateWarnings(gate));
}

function readEvidenceChecks(source: Record<string, unknown>): AiPrototypeIntegrationEvidenceCheck[] {
  const value = source.evidenceChecks;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((check) => ({
    checkId: readString(check, "checkId"),
    label: readString(check, "label"),
    sourceRecord: readString(check, "sourceRecord"),
    status: readString(check, "status") as AiPrototypeIntegrationEvidenceStatus,
    requiredBeforeIntegration: check.requiredBeforeIntegration === true,
    blocker: readString(check, "blocker"),
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
