export type AiGeneratorLineageStepStatus = "covered" | "blocked" | "missing" | "review-only";

export interface AiGeneratorLineageStep {
  stepId: string;
  label: string;
  recordType: string;
  status: AiGeneratorLineageStepStatus;
  evidence: string;
  releaseBoundary: string;
}

export interface AiGeneratorLineageMap {
  lineageId: string;
  tenantId: string;
  requestId: string;
  label: string;
  summary: string;
  currentState: string;
  steps: AiGeneratorLineageStep[];
  blockedActions: string[];
  nextRecords: string[];
}

export const AI_GENERATOR_LINEAGE_REQUIRED_RECORD_TYPES = [
  "ai_game_generator_request",
  "ai_prompt_package",
  "ai_generated_draft_payload_preview",
  "ai_draft_correction_queue",
  "ai_verifier_submission_packet",
  "ai_generated_package_manifest",
  "ai_generated_publish_readiness_gate",
  "teacher_draft_review_handoff",
] as const;

export const AI_GENERATOR_LINEAGE_REQUIRED_BLOCKED_ACTIONS = [
  "No live generation from lineage map",
  "No verifier submission from lineage map",
  "No package assembly from lineage map",
  "No route creation from lineage map",
  "No playlist creation from lineage map",
  "No local bundle write from lineage map",
  "No student assignment from lineage map",
  "No student-ready marker from lineage map",
] as const;

export function validateAiGeneratorLineageMap(map: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(map)) {
    return ["AI generator lineage map must be a JSON object."];
  }

  const lineageId = readString(map, "lineageId");
  const tenantId = readString(map, "tenantId");
  const requestId = readString(map, "requestId");
  const currentState = readString(map, "currentState");
  const steps = readLineageSteps(map);
  const recordTypes = steps.map((step) => step.recordType);
  const blockedActions = readStringArray(map, "blockedActions");
  const nextRecords = readStringArray(map, "nextRecords");

  if (!lineageId || !tenantId || !requestId) {
    errors.push("AI generator lineage map must include lineageId, tenantId, and requestId.");
  }

  if (currentState !== "Lineage review only") {
    errors.push("AI generator lineage map must stay in Lineage review only state.");
  }

  for (const requiredRecordType of AI_GENERATOR_LINEAGE_REQUIRED_RECORD_TYPES) {
    if (!recordTypes.includes(requiredRecordType)) {
      errors.push(`AI generator lineage map must include record type: ${requiredRecordType}.`);
    }
  }

  for (const requiredAction of AI_GENERATOR_LINEAGE_REQUIRED_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, requiredAction)) {
      errors.push(`AI generator lineage map must block: ${requiredAction}.`);
    }
  }

  if (nextRecords.length === 0) {
    errors.push("AI generator lineage map must name next required records.");
  }

  for (const step of steps) {
    if (!step.stepId || !step.label || !step.recordType || !step.evidence || !step.releaseBoundary) {
      errors.push("AI generator lineage steps must include id, label, record type, evidence, and release boundary.");
    }

    if (!["covered", "blocked", "missing", "review-only"].includes(step.status)) {
      errors.push(`AI generator lineage step has unknown status: ${step.status}.`);
    }
  }

  return errors;
}

export function getAiGeneratorLineageMapWarnings(map: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(map)) {
    return warnings;
  }

  const tenantId = readString(map, "tenantId");
  const searchableText = [
    readString(map, "summary"),
    readStringArray(map, "blockedActions").join(" "),
    readLineageSteps(map)
      .map((step) => `${step.evidence} ${step.releaseBoundary}`)
      .join(" "),
  ]
    .join(" ")
    .toLowerCase();

  if (!searchableText.includes("review-only")) {
    warnings.push("AI generator lineage map should describe its review-only boundary.");
  }

  if (tenantId === "ministar" && !searchableText.includes("english remains the target-language trigger")) {
    warnings.push("MiniStar lineage map should preserve English as the target-language trigger.");
  }

  if (tenantId === "ministar" && !searchableText.includes("japanese support-language unlock")) {
    warnings.push("MiniStar lineage map should block Japanese support-language unlocks.");
  }

  return warnings;
}

export function validateAiGeneratorLineageMaps(maps: unknown[]): string[] {
  return maps.flatMap((map) => validateAiGeneratorLineageMap(map));
}

export function getAiGeneratorLineageMapCollectionWarnings(maps: unknown[]): string[] {
  return maps.flatMap((map) => getAiGeneratorLineageMapWarnings(map));
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

function readLineageSteps(source: Record<string, unknown>): AiGeneratorLineageStep[] {
  const value = source.steps;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((step) => ({
    stepId: readString(step, "stepId"),
    label: readString(step, "label"),
    recordType: readString(step, "recordType"),
    status: readString(step, "status") as AiGeneratorLineageStepStatus,
    evidence: readString(step, "evidence"),
    releaseBoundary: readString(step, "releaseBoundary"),
  }));
}

function textListIncludes(items: string[], expected: string): boolean {
  return items.some((item) => item.includes(expected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
