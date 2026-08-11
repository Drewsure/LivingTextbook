export type AiGeneratorTenantCoverageStatus = "covered" | "partial" | "missing";

export interface AiGeneratorTenantCoverageLane {
  laneId: string;
  label: string;
  recordType: string;
  status: AiGeneratorTenantCoverageStatus;
  evidence: string;
  nextStep: string;
}

export interface AiGeneratorTenantCoverage {
  coverageId: string;
  tenantId: string;
  requestId: string;
  label: string;
  summary: string;
  status: AiGeneratorTenantCoverageStatus;
  coveredCount: number;
  partialCount: number;
  missingCount: number;
  lanes: AiGeneratorTenantCoverageLane[];
  blockedActions: string[];
  nextRequirements: string[];
}

export const AI_GENERATOR_TENANT_COVERAGE_REQUIRED_RECORD_TYPES = [
  "ai_game_generator_request",
  "ai_prompt_package",
  "premium_ai_cost_gate",
  "ai_generation_request_packet",
  "ai_audio_coverage_plan",
  "ai_gamification_mapping_plan",
  "ai_reward_readiness_gate",
  "ai_engine_binding_plan",
  "ai_verifier_submission_packet",
  "ai_generated_package_manifest",
  "ai_generated_publish_readiness_gate",
  "ai_generated_draft_payload_preview",
  "ai_draft_correction_queue",
] as const;

export const AI_GENERATOR_TENANT_COVERAGE_REQUIRED_BLOCKED_ACTIONS = [
  "No generator request submission",
  "No live model call",
  "No verifier submission",
  "No package assembly",
  "No route or playlist creation",
  "No student assignment",
] as const;

export function validateAiGeneratorTenantCoverage(coverage: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(coverage)) {
    return ["AI generator tenant coverage must be a JSON object."];
  }

  const coverageId = readString(coverage, "coverageId");
  const tenantId = readString(coverage, "tenantId");
  const requestId = readString(coverage, "requestId");
  const status = readString(coverage, "status");
  const coveredCount = readNumber(coverage, "coveredCount");
  const partialCount = readNumber(coverage, "partialCount");
  const missingCount = readNumber(coverage, "missingCount");
  const lanes = readCoverageLanes(coverage);
  const blockedActions = readStringArray(coverage, "blockedActions");
  const nextRequirements = readStringArray(coverage, "nextRequirements");
  const recordTypes = lanes.map((lane) => lane.recordType);

  if (!coverageId || !tenantId || !requestId) {
    errors.push("AI generator tenant coverage must include coverageId, tenantId, and requestId.");
  }

  if (!["covered", "partial", "missing"].includes(status)) {
    errors.push("AI generator tenant coverage status must be covered, partial, or missing.");
  }

  for (const requiredRecordType of AI_GENERATOR_TENANT_COVERAGE_REQUIRED_RECORD_TYPES) {
    if (!recordTypes.includes(requiredRecordType)) {
      errors.push(`AI generator tenant coverage must include lane: ${requiredRecordType}.`);
    }
  }

  const actualCoveredCount = lanes.filter((lane) => lane.status === "covered").length;
  const actualPartialCount = lanes.filter((lane) => lane.status === "partial").length;
  const actualMissingCount = lanes.filter((lane) => lane.status === "missing").length;

  if (coveredCount !== actualCoveredCount) {
    errors.push("AI generator tenant coverage coveredCount must match covered lanes.");
  }

  if (partialCount !== actualPartialCount) {
    errors.push("AI generator tenant coverage partialCount must match partial lanes.");
  }

  if (missingCount !== actualMissingCount) {
    errors.push("AI generator tenant coverage missingCount must match missing lanes.");
  }

  const expectedStatus =
    missingCount === 0 && partialCount === 0 ? "covered" : coveredCount === 0 ? "missing" : "partial";

  if (status !== expectedStatus) {
    errors.push(`AI generator tenant coverage status must match lane coverage: ${expectedStatus}.`);
  }

  for (const requiredAction of AI_GENERATOR_TENANT_COVERAGE_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(requiredAction)) {
      errors.push(`AI generator tenant coverage must block: ${requiredAction}.`);
    }
  }

  if (nextRequirements.length === 0) {
    errors.push("AI generator tenant coverage must include next tenant requirements.");
  }

  for (const lane of lanes) {
    if (!lane.laneId || !lane.label || !lane.recordType || !lane.evidence || !lane.nextStep) {
      errors.push("AI generator tenant coverage lanes must include id, label, record type, evidence, and next step.");
    }
  }

  return errors;
}

export function getAiGeneratorTenantCoverageWarnings(coverage: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(coverage)) {
    return warnings;
  }

  const summary = readString(coverage, "summary").toLowerCase();
  const nextRequirements = readStringArray(coverage, "nextRequirements").join(" ").toLowerCase();

  if (!summary.includes("tenant")) {
    warnings.push("AI generator tenant coverage should explain the tenant-specific boundary.");
  }

  if (!nextRequirements.includes("premium ai")) {
    warnings.push("AI generator tenant coverage should keep premium AI package approval visible.");
  }

  return warnings;
}

export function validateAiGeneratorTenantCoverages(coverages: unknown[]): string[] {
  return coverages.flatMap((coverage) => validateAiGeneratorTenantCoverage(coverage));
}

export function getAiGeneratorTenantCoverageCollectionWarnings(coverages: unknown[]): string[] {
  return coverages.flatMap((coverage) => getAiGeneratorTenantCoverageWarnings(coverage));
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(source: Record<string, unknown>, key: string): number {
  const value = source[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function readCoverageLanes(source: Record<string, unknown>): AiGeneratorTenantCoverageLane[] {
  const value = source.lanes;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((lane) => ({
    laneId: readString(lane, "laneId"),
    label: readString(lane, "label"),
    recordType: readString(lane, "recordType"),
    status: readCoverageStatus(lane),
    evidence: readString(lane, "evidence"),
    nextStep: readString(lane, "nextStep"),
  }));
}

function readCoverageStatus(source: Record<string, unknown>): AiGeneratorTenantCoverageStatus {
  const status = readString(source, "status");
  return status === "covered" || status === "partial" ? status : "missing";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
