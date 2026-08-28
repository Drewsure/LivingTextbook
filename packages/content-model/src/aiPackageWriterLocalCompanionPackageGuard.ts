export type AiGeneratedPackageWriterLocalCompanionPackageGuardStatus = "blocked" | "review-only";
export type AiGeneratedPackageWriterLocalCompanionArtifactStatus = "blocked" | "needs-review";

export type AiGeneratedPackageWriterLocalCompanionArtifactKind =
  | "local_manifest"
  | "media_bundle_inventory"
  | "offline_route_map"
  | "qr_fallback_sheet"
  | "export_archive"
  | "restore_checkpoint";

export interface AiGeneratedPackageWriterLocalCompanionArtifact {
  artifactId: string;
  label: string;
  artifactKind: AiGeneratedPackageWriterLocalCompanionArtifactKind;
  status: AiGeneratedPackageWriterLocalCompanionArtifactStatus;
  sourceRecord: string;
  requiredProofs: string[];
  blockedActions: string[];
}

export interface AiGeneratedPackageWriterLocalCompanionPackageGuard {
  guardId: string;
  tenantId: string;
  requestId: string;
  routePlaylistGuardId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageWriterLocalCompanionPackageGuardStatus;
  guardState: string;
  packageIdPreview: string;
  protectedArtifacts: AiGeneratedPackageWriterLocalCompanionArtifact[];
  localSafetyChecks: string[];
  offlineFallbackChecks: string[];
  blockedPackageActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const AI_PACKAGE_WRITER_LOCAL_COMPANION_REQUIRED_ARTIFACT_KINDS = [
  "local_manifest",
  "media_bundle_inventory",
  "offline_route_map",
  "qr_fallback_sheet",
  "export_archive",
  "restore_checkpoint",
] as const;

export const AI_PACKAGE_WRITER_LOCAL_COMPANION_REQUIRED_BLOCKED_ACTIONS = [
  "No local bundle packaging",
  "No local folder activation",
  "No offline route activation",
  "No media file copy",
  "No export archive creation",
  "No local companion release",
  "No assignment activation from local companion",
  "No support-language-only local package approval",
  "No writer execution",
] as const;

export const AI_PACKAGE_WRITER_LOCAL_COMPANION_REQUIRED_LOCAL_CHECKS = [
  "Closed local manifest review",
  "Media rights and file inventory review",
  "Rollback restore checkpoint review",
] as const;

export const AI_PACKAGE_WRITER_LOCAL_COMPANION_REQUIRED_OFFLINE_CHECKS = [
  "Offline route map smoke check",
  "Printed QR fallback review",
  "Student data exclusion check",
] as const;

export function validateAiGeneratedPackageWriterLocalCompanionPackageGuard(guard: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(guard)) {
    return ["AI generated package writer local companion package guard must be a JSON object."];
  }

  const guardId = readString(guard, "guardId");
  const tenantId = readString(guard, "tenantId");
  const requestId = readString(guard, "requestId");
  const routePlaylistGuardId = readString(guard, "routePlaylistGuardId");
  const status = readString(guard, "status");
  const guardState = readString(guard, "guardState");
  const packageIdPreview = readString(guard, "packageIdPreview");
  const protectedArtifacts = readArray(guard, "protectedArtifacts");
  const localSafetyChecks = readStringArray(guard, "localSafetyChecks");
  const offlineFallbackChecks = readStringArray(guard, "offlineFallbackChecks");
  const blockedPackageActions = readStringArray(guard, "blockedPackageActions");
  const supportLanguageBoundary = readStringArray(guard, "supportLanguageBoundary");

  if (!guardId || !tenantId || !requestId || !routePlaylistGuardId) {
    errors.push(
      "AI generated package writer local companion package guard must include guardId, tenantId, requestId, and routePlaylistGuardId.",
    );
  }

  if (status !== "blocked") {
    errors.push("AI generated package writer local companion package guard status must stay blocked.");
  }

  if (!guardState.toLowerCase().includes("local companion blocked")) {
    errors.push("AI generated package writer local companion package guard must state that local companion work is blocked.");
  }

  if (!packageIdPreview) {
    errors.push("AI generated package writer local companion package guard must include packageIdPreview.");
  }

  const artifactKinds = protectedArtifacts.flatMap((artifact) =>
    isRecord(artifact) ? [readString(artifact, "artifactKind")] : [],
  );

  for (const requiredKind of AI_PACKAGE_WRITER_LOCAL_COMPANION_REQUIRED_ARTIFACT_KINDS) {
    if (!artifactKinds.includes(requiredKind)) {
      errors.push(`AI generated package writer local companion package guard must protect: ${requiredKind}.`);
    }
  }

  for (const requiredAction of AI_PACKAGE_WRITER_LOCAL_COMPANION_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedPackageActions.includes(requiredAction)) {
      errors.push(`AI generated package writer local companion package guard must block: ${requiredAction}.`);
    }
  }

  for (const requiredCheck of AI_PACKAGE_WRITER_LOCAL_COMPANION_REQUIRED_LOCAL_CHECKS) {
    if (!localSafetyChecks.includes(requiredCheck)) {
      errors.push(`AI generated package writer local companion package guard must require local check: ${requiredCheck}.`);
    }
  }

  for (const requiredCheck of AI_PACKAGE_WRITER_LOCAL_COMPANION_REQUIRED_OFFLINE_CHECKS) {
    if (!offlineFallbackChecks.includes(requiredCheck)) {
      errors.push(
        `AI generated package writer local companion package guard must require offline fallback check: ${requiredCheck}.`,
      );
    }
  }

  for (const artifact of protectedArtifacts) {
    if (!isRecord(artifact)) {
      errors.push("AI generated package writer local companion protected artifacts must be objects.");
      continue;
    }

    const artifactId = readString(artifact, "artifactId");
    const statusValue = readString(artifact, "status");
    const sourceRecord = readString(artifact, "sourceRecord");
    const requiredProofs = readStringArray(artifact, "requiredProofs");
    const blockedActions = readStringArray(artifact, "blockedActions");

    if (!artifactId) {
      errors.push("AI generated package writer local companion protected artifacts must include artifactId.");
    }

    if (statusValue !== "blocked") {
      errors.push(`AI generated package writer local companion artifact ${artifactId || "(missing)"} must stay blocked.`);
    }

    if (!sourceRecord || requiredProofs.length === 0 || blockedActions.length === 0) {
      errors.push(
        `AI generated package writer local companion artifact ${artifactId || "(missing)"} must include sourceRecord, requiredProofs, and blockedActions.`,
      );
    }

    if (!blockedActions.every((blockedAction) => blockedAction.startsWith("No "))) {
      errors.push(
        `AI generated package writer local companion artifact ${artifactId || "(missing)"} blockedActions must be explicit No rules.`,
      );
    }
  }

  if (supportLanguageBoundary.length === 0 || !supportLanguageBoundary.join(" ").toLowerCase().includes("support")) {
    errors.push("AI generated package writer local companion package guard must preserve a support-language boundary.");
  }

  if (tenantId === "ministar") {
    const guardText = [
      readString(guard, "summary"),
      ...localSafetyChecks,
      ...offlineFallbackChecks,
      ...supportLanguageBoundary,
    ]
      .join(" ")
      .toLowerCase();

    if (!guardText.includes("english")) {
      errors.push("MiniStar local companion package guard must preserve English as the target-language trigger.");
    }

    if (!guardText.includes("hiragana")) {
      errors.push("MiniStar local companion package guard must preserve hiragana support-language rules.");
    }
  }

  return errors;
}

export function getAiGeneratedPackageWriterLocalCompanionPackageGuardWarnings(guard: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(guard)) {
    return warnings;
  }

  const nextRequiredRecords = readStringArray(guard, "nextRequiredRecords");
  const localSafetyChecks = readStringArray(guard, "localSafetyChecks");
  const offlineFallbackChecks = readStringArray(guard, "offlineFallbackChecks");

  if (!nextRequiredRecords.includes("Local companion package guard storage contract")) {
    warnings.push("AI generated package writer local companion package guard should require its storage contract.");
  }

  if (!nextRequiredRecords.includes("Assignment shell guard review")) {
    warnings.push("AI generated package writer local companion package guard should require assignment shell review.");
  }

  if (!nextRequiredRecords.includes("School policy acceptance preflight")) {
    warnings.push("AI generated package writer local companion package guard should require school policy acceptance.");
  }

  if (!localSafetyChecks.some((check) => check.toLowerCase().includes("media"))) {
    warnings.push("AI generated package writer local companion package guard should include a media inventory check.");
  }

  if (!offlineFallbackChecks.some((check) => check.toLowerCase().includes("student data"))) {
    warnings.push("AI generated package writer local companion package guard should exclude student data from local bundles.");
  }

  return warnings;
}

export function validateAiGeneratedPackageWriterLocalCompanionPackageGuards(guards: unknown[]): string[] {
  return guards.flatMap((guard) => validateAiGeneratedPackageWriterLocalCompanionPackageGuard(guard));
}

export function getAiGeneratedPackageWriterLocalCompanionPackageGuardCollectionWarnings(
  guards: unknown[],
): string[] {
  return guards.flatMap((guard) => getAiGeneratedPackageWriterLocalCompanionPackageGuardWarnings(guard));
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
