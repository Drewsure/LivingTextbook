export type AiPrototypeCodexIntegrationDecisionStatus = "blocked" | "review-only" | "ready-for-review";
export type AiPrototypeCodexIntegrationDecisionCheckStatus = "missing" | "blocked" | "pending-review" | "reviewed";

export interface AiPrototypeCodexIntegrationDecisionCheck {
  label: string;
  status: AiPrototypeCodexIntegrationDecisionCheckStatus;
  evidence: string;
  requiredRecord: string;
}

export interface AiPrototypeCodexIntegrationDecision {
  decisionId: string;
  tenantId: string;
  requestId: string;
  label: string;
  status: AiPrototypeCodexIntegrationDecisionStatus;
  summary: string;
  selectedDecision: string;
  sourceRecords: string[];
  checks: AiPrototypeCodexIntegrationDecisionCheck[];
  decisionOptions: string[];
  requiredBeforeDecision: string[];
  blockedActions: string[];
}

export const AI_PROTOTYPE_CODEX_DECISION_REQUIRED_SOURCE_RECORDS = [
  "ai_prototype_integration_plan",
  "ai_prototype_wrapper_adapter_review",
  "ai_prototype_fixture_replay_report",
  "ai_prototype_event_replay_report",
  "ai_prototype_audio_coverage_report",
  "ai_prototype_mobile_accessibility_report",
  "ai_prototype_scoring_replay_report",
  "ai_prototype_integration_readiness_gate",
  "codex_integration_review_decision",
] as const;

export const AI_PROTOTYPE_CODEX_DECISION_REQUIRED_CHECKS = [
  {
    label: "Wrapper adapter evidence",
    requiredRecord: "ai_prototype_wrapper_adapter_review",
  },
  {
    label: "Fixture replay evidence",
    requiredRecord: "ai_prototype_fixture_replay_report",
  },
  {
    label: "Standard event evidence",
    requiredRecord: "ai_prototype_event_replay_report",
  },
  {
    label: "Target-language audio evidence",
    requiredRecord: "ai_prototype_audio_coverage_report",
  },
  {
    label: "Mobile accessibility evidence",
    requiredRecord: "ai_prototype_mobile_accessibility_report",
  },
  {
    label: "Deterministic scoring evidence",
    requiredRecord: "ai_prototype_scoring_replay_report",
  },
  {
    label: "Readiness gate evidence",
    requiredRecord: "ai_prototype_integration_readiness_gate",
  },
] as const;

export const AI_PROTOTYPE_CODEX_DECISION_OPTIONS = [
  "Return to external builder",
  "Approve wrapper integration review",
  "Reject integration",
] as const;

export const AI_PROTOTYPE_CODEX_DECISION_REQUIRED_BEFORE_DECISION = [
  "All prototype evidence reviewed",
  "Manual Codex review completed",
  "No tenant hard-coding",
  "No support-language progress trigger",
  "No hidden score or reward authority",
  "No inaccessible learner controls",
] as const;

export const AI_PROTOTYPE_CODEX_DECISION_BLOCKED_ACTIONS = [
  "No integration approval",
  "No apps/web patch generation",
  "No direct import",
  "No route registry write",
  "No student-facing route",
  "No scoring profile mutation",
  "No Star Dust or reward write",
  "No audio manifest mutation",
  "No package promotion",
  "No assignment",
] as const;

export function validateAiPrototypeCodexIntegrationDecision(decision: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(decision)) {
    return ["AI prototype Codex integration decision must be a JSON object."];
  }

  const decisionId = readString(decision, "decisionId");
  const tenantId = readString(decision, "tenantId");
  const requestId = readString(decision, "requestId");
  const label = readString(decision, "label");
  const status = readString(decision, "status");
  const summary = readString(decision, "summary");
  const selectedDecision = readString(decision, "selectedDecision");
  const sourceRecords = readStringArray(decision, "sourceRecords");
  const checks = readDecisionChecks(decision);
  const decisionOptions = readStringArray(decision, "decisionOptions");
  const requiredBeforeDecision = readStringArray(decision, "requiredBeforeDecision");
  const blockedActions = readStringArray(decision, "blockedActions");

  if (!decisionId || !tenantId || !requestId) {
    errors.push("AI prototype Codex integration decision must include decisionId, tenantId, and requestId.");
  }

  if (!label.includes("Codex integration review decision")) {
    errors.push("AI prototype Codex integration decision label must name the Codex integration review decision.");
  }

  if (status !== "blocked" && status !== "review-only" && status !== "ready-for-review") {
    errors.push("AI prototype Codex integration decision must use a supported review-only status.");
  }

  if (!summary.includes("Manual Codex review remains blocked")) {
    errors.push("AI prototype Codex integration decision summary must keep manual Codex review blocked.");
  }

  if (selectedDecision !== "No decision recorded") {
    errors.push("AI prototype Codex integration decision must not record a selected decision in the preview fixture.");
  }

  for (const sourceRecord of AI_PROTOTYPE_CODEX_DECISION_REQUIRED_SOURCE_RECORDS) {
    if (!sourceRecords.includes(sourceRecord)) {
      errors.push(`AI prototype Codex integration decision must include source record: ${sourceRecord}.`);
    }
  }

  for (const requiredCheck of AI_PROTOTYPE_CODEX_DECISION_REQUIRED_CHECKS) {
    const matchingCheck = checks.find((check) => check.label === requiredCheck.label);

    if (!matchingCheck) {
      errors.push(`AI prototype Codex integration decision must include check: ${requiredCheck.label}.`);
      continue;
    }

    if (matchingCheck.requiredRecord !== requiredCheck.requiredRecord) {
      errors.push(
        `AI prototype Codex integration decision check ${requiredCheck.label} must require record: ${requiredCheck.requiredRecord}.`,
      );
    }
  }

  for (const option of AI_PROTOTYPE_CODEX_DECISION_OPTIONS) {
    if (!decisionOptions.includes(option)) {
      errors.push(`AI prototype Codex integration decision must include decision option: ${option}.`);
    }
  }

  for (const requiredItem of AI_PROTOTYPE_CODEX_DECISION_REQUIRED_BEFORE_DECISION) {
    if (!requiredBeforeDecision.includes(requiredItem)) {
      errors.push(`AI prototype Codex integration decision must require before decision: ${requiredItem}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_CODEX_DECISION_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype Codex integration decision must block action: ${blockedAction}.`);
    }
  }

  if (!checks.some((check) => check.status === "blocked")) {
    errors.push("AI prototype Codex integration decision must keep at least one evidence check blocked.");
  }

  if (tenantId === "ministar") {
    if (!checks.some((check) => textListIncludes([check.evidence], "Japanese support remains support-only and hiragana-safe"))) {
      errors.push("MiniStar AI prototype Codex integration decision must preserve hiragana-safe Japanese support.");
    }

    if (!requiredBeforeDecision.includes("No support-language progress trigger")) {
      errors.push("MiniStar AI prototype Codex integration decision must block support-language progress triggers.");
    }
  }

  return errors;
}

export function getAiPrototypeCodexIntegrationDecisionWarnings(decision: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(decision)) {
    return warnings;
  }

  const status = readString(decision, "status");
  const checks = readDecisionChecks(decision);
  const blockedActions = readStringArray(decision, "blockedActions");

  if (status === "ready-for-review" && !checks.every((check) => check.status === "reviewed")) {
    warnings.push("A ready-for-review Codex decision should have every evidence check reviewed.");
  }

  if (!textListIncludes(blockedActions, "No assignment")) {
    warnings.push("Codex integration decisions should block assignment until integration approval exists.");
  }

  if (!checks.every((check) => check.evidence.length > 0 && check.requiredRecord.length > 0)) {
    warnings.push("Every Codex decision check should include evidence text and a required record.");
  }

  return warnings;
}

export function validateAiPrototypeCodexIntegrationDecisions(decisions: unknown[]): string[] {
  return decisions.flatMap((decision) => validateAiPrototypeCodexIntegrationDecision(decision));
}

export function getAiPrototypeCodexIntegrationDecisionCollectionWarnings(decisions: unknown[]): string[] {
  return decisions.flatMap((decision) => getAiPrototypeCodexIntegrationDecisionWarnings(decision));
}

function readDecisionChecks(source: Record<string, unknown>): AiPrototypeCodexIntegrationDecisionCheck[] {
  const value = source.checks;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((check) => ({
    label: readString(check, "label"),
    status: readString(check, "status") as AiPrototypeCodexIntegrationDecisionCheckStatus,
    evidence: readString(check, "evidence"),
    requiredRecord: readString(check, "requiredRecord"),
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
