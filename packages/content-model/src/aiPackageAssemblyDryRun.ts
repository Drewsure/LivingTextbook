export type AiGeneratedPackageAssemblyDryRunStatus = "blocked" | "review-only";
export type AiGeneratedPackageAssemblyArtifactStatus = "draft-preview" | "blocked";

export interface AiGeneratedPackageAssemblyArtifact {
  artifactId: string;
  label: string;
  artifactType: string;
  status: AiGeneratedPackageAssemblyArtifactStatus;
  proposedPath: string;
  sourceRecords: string[];
  previewContents: string[];
  blockedWrites: string[];
}

export interface AiGeneratedPackageAssemblyDryRun {
  dryRunId: string;
  tenantId: string;
  requestId: string;
  readinessId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageAssemblyDryRunStatus;
  dryRunState: string;
  packageIdPreview: string;
  versionPreview: string;
  artifacts: AiGeneratedPackageAssemblyArtifact[];
  allowedReviewActions: string[];
  blockedDryRunActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const AI_PACKAGE_ASSEMBLY_DRY_RUN_REQUIRED_ARTIFACT_TYPES = [
  "teacher_draft_package",
  "route_registry",
  "media_playlist_binding",
  "local_media_bundle_entry",
  "teacher_assignment_rollout_gate",
] as const;

export const AI_PACKAGE_ASSEMBLY_DRY_RUN_REQUIRED_BLOCKED_ACTIONS = [
  "No package JSON write from dry run",
  "No route registry write from dry run",
  "No media playlist write from dry run",
  "No local bundle write from dry run",
  "No assignment from dry run",
  "No student-ready marker from dry run",
  "No support-language-only assembly dry run",
] as const;

export function validateAiGeneratedPackageAssemblyDryRun(dryRun: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(dryRun)) {
    return ["AI generated package assembly dry run must be a JSON object."];
  }

  const dryRunId = readString(dryRun, "dryRunId");
  const tenantId = readString(dryRun, "tenantId");
  const requestId = readString(dryRun, "requestId");
  const readinessId = readString(dryRun, "readinessId");
  const status = readString(dryRun, "status");
  const dryRunState = readString(dryRun, "dryRunState");
  const packageIdPreview = readString(dryRun, "packageIdPreview");
  const versionPreview = readString(dryRun, "versionPreview");
  const artifacts = readArray(dryRun, "artifacts");
  const blockedDryRunActions = readStringArray(dryRun, "blockedDryRunActions");
  const supportLanguageBoundary = readStringArray(dryRun, "supportLanguageBoundary");

  if (!dryRunId || !tenantId || !requestId || !readinessId) {
    errors.push("AI generated package assembly dry run must include dryRunId, tenantId, requestId, and readinessId.");
  }

  if (status !== "blocked") {
    errors.push("AI generated package assembly dry run status must stay blocked in the foundation.");
  }

  if (!dryRunState.toLowerCase().includes("before writes")) {
    errors.push("AI generated package assembly dry run must state that it is before writes.");
  }

  if (!packageIdPreview || !versionPreview) {
    errors.push("AI generated package assembly dry run must include packageIdPreview and versionPreview.");
  }

  for (const requiredAction of AI_PACKAGE_ASSEMBLY_DRY_RUN_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedDryRunActions.includes(requiredAction)) {
      errors.push(`AI generated package assembly dry run must block: ${requiredAction}.`);
    }
  }

  if (supportLanguageBoundary.length === 0 || !supportLanguageBoundary.join(" ").toLowerCase().includes("support")) {
    errors.push("AI generated package assembly dry run must preserve a support-language boundary.");
  }

  for (const requiredType of AI_PACKAGE_ASSEMBLY_DRY_RUN_REQUIRED_ARTIFACT_TYPES) {
    if (!artifacts.some((artifact) => isRecord(artifact) && readString(artifact, "artifactType").includes(requiredType))) {
      errors.push(`AI generated package assembly dry run must include artifact type: ${requiredType}.`);
    }
  }

  for (const artifact of artifacts) {
    if (!isRecord(artifact)) {
      errors.push("AI generated package assembly dry run artifacts must be objects.");
      continue;
    }

    const artifactId = readString(artifact, "artifactId");
    const artifactStatus = readString(artifact, "status");
    const proposedPath = readString(artifact, "proposedPath");
    const sourceRecords = readStringArray(artifact, "sourceRecords");
    const previewContents = readStringArray(artifact, "previewContents");
    const blockedWrites = readStringArray(artifact, "blockedWrites");

    if (!artifactId) {
      errors.push("AI generated package assembly dry run artifacts must include artifactId.");
    }

    if (artifactStatus !== "blocked") {
      errors.push(`AI generated package assembly dry run artifact ${artifactId || "(missing)"} must stay blocked.`);
    }

    if (!proposedPath) {
      errors.push(`AI generated package assembly dry run artifact ${artifactId || "(missing)"} must include proposedPath.`);
    }

    if (sourceRecords.length === 0 || previewContents.length === 0 || blockedWrites.length === 0) {
      errors.push(
        `AI generated package assembly dry run artifact ${artifactId || "(missing)"} must include sourceRecords, previewContents, and blockedWrites.`,
      );
    }

    if (!blockedWrites.every((blockedWrite) => blockedWrite.startsWith("No "))) {
      errors.push(`AI generated package assembly dry run artifact ${artifactId || "(missing)"} blockedWrites must be explicit No rules.`);
    }
  }

  return errors;
}

export function getAiGeneratedPackageAssemblyDryRunWarnings(dryRun: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(dryRun)) {
    return warnings;
  }

  const artifacts = readArray(dryRun, "artifacts");
  const allowedReviewActions = readStringArray(dryRun, "allowedReviewActions");
  const nextRequiredRecords = readStringArray(dryRun, "nextRequiredRecords");

  if (artifacts.length < AI_PACKAGE_ASSEMBLY_DRY_RUN_REQUIRED_ARTIFACT_TYPES.length) {
    warnings.push("AI generated package assembly dry run should preview package, route, playlist, local bundle, and assignment artifacts.");
  }

  if (allowedReviewActions.length === 0) {
    warnings.push("AI generated package assembly dry run should name allowed review actions.");
  }

  if (!nextRequiredRecords.includes("teacher_assignment_rollout_gate")) {
    warnings.push("AI generated package assembly dry run should require teacher_assignment_rollout_gate before student use.");
  }

  return warnings;
}

export function validateAiGeneratedPackageAssemblyDryRuns(dryRuns: unknown[]): string[] {
  return dryRuns.flatMap((dryRun) => validateAiGeneratedPackageAssemblyDryRun(dryRun));
}

export function getAiGeneratedPackageAssemblyDryRunCollectionWarnings(dryRuns: unknown[]): string[] {
  return dryRuns.flatMap((dryRun) => getAiGeneratedPackageAssemblyDryRunWarnings(dryRun));
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
