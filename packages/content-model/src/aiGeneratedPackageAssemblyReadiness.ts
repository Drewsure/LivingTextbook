export type AiGeneratedPackageAssemblyReadinessStatus = "blocked" | "review-only";
export type AiGeneratedPackageAssemblyLaneStatus = "ready-preview" | "blocked" | "missing";

export interface AiGeneratedPackageAssemblyLane {
  laneId: string;
  label: string;
  status: AiGeneratedPackageAssemblyLaneStatus;
  requiredRecord: string;
  evidence: string;
  assemblyEffect: string;
}

export interface AiGeneratedPackageAssemblyReadiness {
  readinessId: string;
  tenantId: string;
  requestId: string;
  manifestId: string;
  promotionChecklistId: string;
  publishReadinessGateId: string;
  releaseCandidateId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageAssemblyReadinessStatus;
  readinessState: string;
  packageAssemblyTarget: string;
  routeWriteTarget: string;
  localBundleTarget: string;
  lanes: AiGeneratedPackageAssemblyLane[];
  allowedReviewActions: string[];
  blockedAssemblyActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const AI_GENERATED_PACKAGE_ASSEMBLY_READINESS_REQUIRED_LANE_IDS = [
  "manifest-completeness",
  "promotion-checklist",
  "publish-readiness",
  "release-candidate",
  "teacher-approval",
  "media-rights",
  "target-language-audio",
] as const;

export const AI_GENERATED_PACKAGE_ASSEMBLY_READINESS_BLOCKED_ACTIONS = [
  "No package assembly from readiness preview",
  "No route registry write from readiness preview",
  "No media playlist write from readiness preview",
  "No local bundle write from readiness preview",
  "No student-ready marker from readiness preview",
  "No assignment from readiness preview",
  "No support-language-only assembly",
] as const;

export const AI_GENERATED_PACKAGE_ASSEMBLY_READINESS_NEXT_RECORDS = [
  "package_approval_ledger",
  "package_publish_gate",
  "teacher_draft_verifier_submission",
  "package_game_audio_coverage",
  "media_rights_manifest",
  "tenant_library_item",
  "teacher_assignment_rollout_gate",
] as const;

export function validateAiGeneratedPackageAssemblyReadiness(readiness: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(readiness)) {
    return ["AI generated package assembly readiness must be a JSON object."];
  }

  const readinessId = readString(readiness, "readinessId");
  const tenantId = readString(readiness, "tenantId");
  const requestId = readString(readiness, "requestId");
  const manifestId = readString(readiness, "manifestId");
  const promotionChecklistId = readString(readiness, "promotionChecklistId");
  const publishReadinessGateId = readString(readiness, "publishReadinessGateId");
  const releaseCandidateId = readString(readiness, "releaseCandidateId");
  const label = readString(readiness, "label");
  const summary = readString(readiness, "summary");
  const status = readString(readiness, "status");
  const readinessState = readString(readiness, "readinessState");
  const packageAssemblyTarget = readString(readiness, "packageAssemblyTarget");
  const routeWriteTarget = readString(readiness, "routeWriteTarget");
  const localBundleTarget = readString(readiness, "localBundleTarget");
  const lanes = readLanes(readiness, "lanes");
  const allowedReviewActions = readStringArray(readiness, "allowedReviewActions");
  const blockedAssemblyActions = readStringArray(readiness, "blockedAssemblyActions");
  const nextRequiredRecords = readStringArray(readiness, "nextRequiredRecords");
  const supportLanguageBoundary = readStringArray(readiness, "supportLanguageBoundary");

  if (!readinessId || !tenantId || !requestId || !manifestId || !promotionChecklistId || !publishReadinessGateId || !releaseCandidateId) {
    errors.push("AI generated package assembly readiness must include readiness, tenant, request, manifest, promotion, publish, and release candidate ids.");
  }

  if (!label.toLowerCase().includes("generated package assembly readiness")) {
    errors.push("AI generated package assembly readiness label must name the assembly readiness surface.");
  }

  if (!summary.toLowerCase().includes("review-only")) {
    errors.push("AI generated package assembly readiness summary must describe the review-only boundary.");
  }

  if (status !== "blocked") {
    errors.push("AI generated package assembly readiness status must stay blocked in the foundation.");
  }

  if (!readinessState.toLowerCase().includes("package assembly blocked")) {
    errors.push("AI generated package assembly readiness must keep package assembly blocked.");
  }

  if (!packageAssemblyTarget || !routeWriteTarget.toLowerCase().includes("blocked") || !localBundleTarget.toLowerCase().includes("blocked")) {
    errors.push("AI generated package assembly readiness must keep package, route, and local bundle targets blocked.");
  }

  for (const laneId of AI_GENERATED_PACKAGE_ASSEMBLY_READINESS_REQUIRED_LANE_IDS) {
    if (!lanes.some((lane) => lane.laneId === laneId)) {
      errors.push(`AI generated package assembly readiness must include lane: ${laneId}.`);
    }
  }

  for (const lane of lanes) {
    if (!lane.label || !lane.requiredRecord || !lane.evidence || !lane.assemblyEffect) {
      errors.push(`AI generated package assembly readiness lane must include full evidence: ${lane.laneId}.`);
    }

    if (lane.status !== "ready-preview" && lane.status !== "blocked" && lane.status !== "missing") {
      errors.push(`AI generated package assembly readiness lane must use a supported preview status: ${lane.laneId}.`);
    }
  }

  if (!textListIncludes(allowedReviewActions, "Inspect generated package assembly evidence")) {
    errors.push("AI generated package assembly readiness must allow review work only.");
  }

  for (const blockedAction of AI_GENERATED_PACKAGE_ASSEMBLY_READINESS_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedAssemblyActions, blockedAction)) {
      errors.push(`AI generated package assembly readiness must block action: ${blockedAction}.`);
    }
  }

  for (const record of AI_GENERATED_PACKAGE_ASSEMBLY_READINESS_NEXT_RECORDS) {
    if (!nextRequiredRecords.includes(record)) {
      errors.push(`AI generated package assembly readiness must include next record: ${record}.`);
    }
  }

  if (!textListIncludes(supportLanguageBoundary, "support-only") && !textListIncludes(supportLanguageBoundary, "support language")) {
    errors.push("AI generated package assembly readiness must preserve support-language boundaries.");
  }

  if (tenantId === "ministar") {
    const combinedText = [...lanes.map((lane) => `${lane.label} ${lane.evidence} ${lane.assemblyEffect}`), ...supportLanguageBoundary];

    if (
      !textListIncludes(combinedText, "English is the target-language assembly trigger") ||
      !textListIncludes(combinedText, "hiragana") ||
      !textListIncludes(combinedText, "support-only")
    ) {
      errors.push("MiniStar generated package assembly readiness must preserve English and hiragana support-only assembly boundaries.");
    }
  }

  return errors;
}

export function getAiGeneratedPackageAssemblyReadinessWarnings(readiness: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(readiness)) {
    return warnings;
  }

  const lanes = readLanes(readiness, "lanes");
  const blockedAssemblyActions = readStringArray(readiness, "blockedAssemblyActions");

  if (!lanes.some((lane) => lane.status === "blocked" || lane.status === "missing")) {
    warnings.push("Generated package assembly readiness should keep at least one blocker visible until all production lanes exist.");
  }

  if (!textListIncludes(blockedAssemblyActions, "No support-language-only assembly")) {
    warnings.push("Generated package assembly readiness should block support-language-only assembly explicitly.");
  }

  return warnings;
}

export function validateAiGeneratedPackageAssemblyReadinessItems(readiness: unknown[]): string[] {
  return readiness.flatMap((item) => validateAiGeneratedPackageAssemblyReadiness(item));
}

export function getAiGeneratedPackageAssemblyReadinessCollectionWarnings(readiness: unknown[]): string[] {
  return readiness.flatMap((item) => getAiGeneratedPackageAssemblyReadinessWarnings(item));
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

function readLanes(source: Record<string, unknown>, key: string): AiGeneratedPackageAssemblyLane[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    laneId: readString(item, "laneId"),
    label: readString(item, "label"),
    status: readString(item, "status") as AiGeneratedPackageAssemblyLaneStatus,
    requiredRecord: readString(item, "requiredRecord"),
    evidence: readString(item, "evidence"),
    assemblyEffect: readString(item, "assemblyEffect"),
  }));
}

function textListIncludes(items: string[], expected: string): boolean {
  const normalizedExpected = expected.toLowerCase();
  return items.some((item) => item.toLowerCase().includes(normalizedExpected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
