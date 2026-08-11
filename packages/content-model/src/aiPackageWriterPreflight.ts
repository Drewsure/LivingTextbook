export type AiGeneratedPackageWriterPreflightStatus = "blocked" | "review-only";
export type AiGeneratedPackageWriterTargetStatus = "blocked" | "needs-review";

export interface AiGeneratedPackageWriterTarget {
  targetId: string;
  label: string;
  writerType: string;
  status: AiGeneratedPackageWriterTargetStatus;
  sourceArtifact: string;
  requiredEvidence: string[];
  blockedWrites: string[];
}

export interface AiGeneratedPackageWriterPreflight {
  preflightId: string;
  tenantId: string;
  requestId: string;
  dryRunId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageWriterPreflightStatus;
  preflightState: string;
  packageIdPreview: string;
  writerTargets: AiGeneratedPackageWriterTarget[];
  allowedReviewActions: string[];
  blockedWriterActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const AI_PACKAGE_WRITER_PREFLIGHT_REQUIRED_WRITER_TYPES = [
  "content_package_writer",
  "route_registry_writer",
  "media_playlist_writer",
  "local_companion_writer",
  "teacher_assignment_writer",
  "release_rollback_writer",
] as const;

export const AI_PACKAGE_WRITER_PREFLIGHT_REQUIRED_BLOCKED_ACTIONS = [
  "No package writer execution",
  "No package JSON commit",
  "No route registry mutation",
  "No media playlist creation",
  "No local bundle packaging",
  "No assignment activation",
  "No student-ready marker from writer preflight",
  "No support-language-only package writer",
] as const;

export function validateAiGeneratedPackageWriterPreflight(preflight: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(preflight)) {
    return ["AI generated package writer preflight must be a JSON object."];
  }

  const preflightId = readString(preflight, "preflightId");
  const tenantId = readString(preflight, "tenantId");
  const requestId = readString(preflight, "requestId");
  const dryRunId = readString(preflight, "dryRunId");
  const status = readString(preflight, "status");
  const preflightState = readString(preflight, "preflightState");
  const packageIdPreview = readString(preflight, "packageIdPreview");
  const writerTargets = readArray(preflight, "writerTargets");
  const blockedWriterActions = readStringArray(preflight, "blockedWriterActions");
  const supportLanguageBoundary = readStringArray(preflight, "supportLanguageBoundary");

  if (!preflightId || !tenantId || !requestId || !dryRunId) {
    errors.push("AI generated package writer preflight must include preflightId, tenantId, requestId, and dryRunId.");
  }

  if (status !== "blocked") {
    errors.push("AI generated package writer preflight status must stay blocked in the foundation.");
  }

  if (!preflightState.toLowerCase().includes("writer blocked")) {
    errors.push("AI generated package writer preflight must state that the writer is blocked.");
  }

  if (!packageIdPreview) {
    errors.push("AI generated package writer preflight must include packageIdPreview.");
  }

  for (const requiredAction of AI_PACKAGE_WRITER_PREFLIGHT_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedWriterActions.includes(requiredAction)) {
      errors.push(`AI generated package writer preflight must block: ${requiredAction}.`);
    }
  }

  for (const requiredWriterType of AI_PACKAGE_WRITER_PREFLIGHT_REQUIRED_WRITER_TYPES) {
    if (!writerTargets.some((target) => isRecord(target) && readString(target, "writerType") === requiredWriterType)) {
      errors.push(`AI generated package writer preflight must include writer target: ${requiredWriterType}.`);
    }
  }

  if (supportLanguageBoundary.length === 0 || !supportLanguageBoundary.join(" ").toLowerCase().includes("support")) {
    errors.push("AI generated package writer preflight must preserve a support-language boundary.");
  }

  for (const target of writerTargets) {
    if (!isRecord(target)) {
      errors.push("AI generated package writer preflight targets must be objects.");
      continue;
    }

    const targetId = readString(target, "targetId");
    const statusValue = readString(target, "status");
    const sourceArtifact = readString(target, "sourceArtifact");
    const requiredEvidence = readStringArray(target, "requiredEvidence");
    const blockedWrites = readStringArray(target, "blockedWrites");

    if (!targetId) {
      errors.push("AI generated package writer preflight targets must include targetId.");
    }

    if (statusValue !== "blocked") {
      errors.push(`AI generated package writer preflight target ${targetId || "(missing)"} must stay blocked.`);
    }

    if (!sourceArtifact || requiredEvidence.length === 0 || blockedWrites.length === 0) {
      errors.push(
        `AI generated package writer preflight target ${targetId || "(missing)"} must include sourceArtifact, requiredEvidence, and blockedWrites.`,
      );
    }

    if (!blockedWrites.every((blockedWrite) => blockedWrite.startsWith("No "))) {
      errors.push(`AI generated package writer preflight target ${targetId || "(missing)"} blockedWrites must be explicit No rules.`);
    }
  }

  return errors;
}

export function getAiGeneratedPackageWriterPreflightWarnings(preflight: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(preflight)) {
    return warnings;
  }

  const writerTargets = readArray(preflight, "writerTargets");
  const allowedReviewActions = readStringArray(preflight, "allowedReviewActions");
  const nextRequiredRecords = readStringArray(preflight, "nextRequiredRecords");

  if (writerTargets.length < AI_PACKAGE_WRITER_PREFLIGHT_REQUIRED_WRITER_TYPES.length) {
    warnings.push("AI generated package writer preflight should preview package, route, playlist, local, assignment, and rollback writers.");
  }

  if (allowedReviewActions.length === 0) {
    warnings.push("AI generated package writer preflight should name allowed review actions.");
  }

  if (!nextRequiredRecords.includes("package_publish_gate")) {
    warnings.push("AI generated package writer preflight should require package_publish_gate before writer work.");
  }

  return warnings;
}

export function validateAiGeneratedPackageWriterPreflights(preflights: unknown[]): string[] {
  return preflights.flatMap((preflight) => validateAiGeneratedPackageWriterPreflight(preflight));
}

export function getAiGeneratedPackageWriterPreflightCollectionWarnings(preflights: unknown[]): string[] {
  return preflights.flatMap((preflight) => getAiGeneratedPackageWriterPreflightWarnings(preflight));
}

function readArray(source: Record<string, unknown>, key: string): unknown[] {
  const value = source[key];
  return Array.isArray(value) ? value : [];
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
