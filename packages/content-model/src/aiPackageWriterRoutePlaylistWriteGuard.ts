export type AiGeneratedPackageWriterRoutePlaylistWriteGuardStatus = "blocked" | "review-only";
export type AiGeneratedPackageWriterRoutePlaylistSurfaceStatus = "blocked" | "needs-review";

export type AiGeneratedPackageWriterRoutePlaylistSurfaceKind =
  | "student_route_registry"
  | "teacher_route_registry"
  | "media_playlist_binding"
  | "qr_deep_link"
  | "route_smoke_check";

export interface AiGeneratedPackageWriterRoutePlaylistSurface {
  surfaceId: string;
  label: string;
  surfaceKind: AiGeneratedPackageWriterRoutePlaylistSurfaceKind;
  status: AiGeneratedPackageWriterRoutePlaylistSurfaceStatus;
  sourceRecord: string;
  requiredProofs: string[];
  blockedMutations: string[];
}

export interface AiGeneratedPackageWriterRoutePlaylistWriteGuard {
  guardId: string;
  tenantId: string;
  requestId: string;
  decisionId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageWriterRoutePlaylistWriteGuardStatus;
  guardState: string;
  packageIdPreview: string;
  protectedSurfaces: AiGeneratedPackageWriterRoutePlaylistSurface[];
  routeSafetyChecks: string[];
  playlistSafetyChecks: string[];
  blockedWriteActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const AI_PACKAGE_WRITER_ROUTE_PLAYLIST_REQUIRED_SURFACE_KINDS = [
  "student_route_registry",
  "teacher_route_registry",
  "media_playlist_binding",
  "qr_deep_link",
  "route_smoke_check",
] as const;

export const AI_PACKAGE_WRITER_ROUTE_PLAYLIST_REQUIRED_BLOCKED_ACTIONS = [
  "No route registry write",
  "No media playlist write",
  "No production QR redirect mutation",
  "No student-facing route activation",
  "No route rewrite from generated package",
  "No playlist rewrite from generated package",
  "No support-language-only route or playlist approval",
  "No writer execution",
] as const;

export const AI_PACKAGE_WRITER_ROUTE_PLAYLIST_REQUIRED_ROUTE_CHECKS = [
  "Stable QR deep link smoke check",
  "Target-language launch route check",
  "Teacher route isolation check",
] as const;

export const AI_PACKAGE_WRITER_ROUTE_PLAYLIST_REQUIRED_PLAYLIST_CHECKS = [
  "Media rights manifest check",
  "Target-language audio first check",
  "Background media opt-in check",
] as const;

export function validateAiGeneratedPackageWriterRoutePlaylistWriteGuard(guard: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(guard)) {
    return ["AI generated package writer route and playlist write guard must be a JSON object."];
  }

  const guardId = readString(guard, "guardId");
  const tenantId = readString(guard, "tenantId");
  const requestId = readString(guard, "requestId");
  const decisionId = readString(guard, "decisionId");
  const status = readString(guard, "status");
  const guardState = readString(guard, "guardState");
  const packageIdPreview = readString(guard, "packageIdPreview");
  const protectedSurfaces = readArray(guard, "protectedSurfaces");
  const routeSafetyChecks = readStringArray(guard, "routeSafetyChecks");
  const playlistSafetyChecks = readStringArray(guard, "playlistSafetyChecks");
  const blockedWriteActions = readStringArray(guard, "blockedWriteActions");
  const supportLanguageBoundary = readStringArray(guard, "supportLanguageBoundary");

  if (!guardId || !tenantId || !requestId || !decisionId) {
    errors.push(
      "AI generated package writer route and playlist write guard must include guardId, tenantId, requestId, and decisionId.",
    );
  }

  if (status !== "blocked") {
    errors.push("AI generated package writer route and playlist write guard status must stay blocked.");
  }

  if (!guardState.toLowerCase().includes("write blocked")) {
    errors.push("AI generated package writer route and playlist write guard must state that writes are blocked.");
  }

  if (!packageIdPreview) {
    errors.push("AI generated package writer route and playlist write guard must include packageIdPreview.");
  }

  const surfaceKinds = protectedSurfaces.flatMap((surface) =>
    isRecord(surface) ? [readString(surface, "surfaceKind")] : [],
  );

  for (const requiredKind of AI_PACKAGE_WRITER_ROUTE_PLAYLIST_REQUIRED_SURFACE_KINDS) {
    if (!surfaceKinds.includes(requiredKind)) {
      errors.push(`AI generated package writer route and playlist write guard must protect: ${requiredKind}.`);
    }
  }

  for (const requiredAction of AI_PACKAGE_WRITER_ROUTE_PLAYLIST_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedWriteActions.includes(requiredAction)) {
      errors.push(`AI generated package writer route and playlist write guard must block: ${requiredAction}.`);
    }
  }

  for (const requiredCheck of AI_PACKAGE_WRITER_ROUTE_PLAYLIST_REQUIRED_ROUTE_CHECKS) {
    if (!routeSafetyChecks.includes(requiredCheck)) {
      errors.push(`AI generated package writer route and playlist write guard must require route check: ${requiredCheck}.`);
    }
  }

  for (const requiredCheck of AI_PACKAGE_WRITER_ROUTE_PLAYLIST_REQUIRED_PLAYLIST_CHECKS) {
    if (!playlistSafetyChecks.includes(requiredCheck)) {
      errors.push(
        `AI generated package writer route and playlist write guard must require playlist check: ${requiredCheck}.`,
      );
    }
  }

  for (const surface of protectedSurfaces) {
    if (!isRecord(surface)) {
      errors.push("AI generated package writer route and playlist protected surfaces must be objects.");
      continue;
    }

    const surfaceId = readString(surface, "surfaceId");
    const statusValue = readString(surface, "status");
    const sourceRecord = readString(surface, "sourceRecord");
    const requiredProofs = readStringArray(surface, "requiredProofs");
    const blockedMutations = readStringArray(surface, "blockedMutations");

    if (!surfaceId) {
      errors.push("AI generated package writer route and playlist protected surfaces must include surfaceId.");
    }

    if (statusValue !== "blocked") {
      errors.push(`AI generated package writer route and playlist surface ${surfaceId || "(missing)"} must stay blocked.`);
    }

    if (!sourceRecord || requiredProofs.length === 0 || blockedMutations.length === 0) {
      errors.push(
        `AI generated package writer route and playlist surface ${surfaceId || "(missing)"} must include sourceRecord, requiredProofs, and blockedMutations.`,
      );
    }

    if (!blockedMutations.every((blockedMutation) => blockedMutation.startsWith("No "))) {
      errors.push(
        `AI generated package writer route and playlist surface ${surfaceId || "(missing)"} blockedMutations must be explicit No rules.`,
      );
    }
  }

  if (supportLanguageBoundary.length === 0 || !supportLanguageBoundary.join(" ").toLowerCase().includes("support")) {
    errors.push("AI generated package writer route and playlist write guard must preserve a support-language boundary.");
  }

  if (tenantId === "ministar") {
    const guardText = [
      readString(guard, "summary"),
      ...routeSafetyChecks,
      ...playlistSafetyChecks,
      ...supportLanguageBoundary,
    ]
      .join(" ")
      .toLowerCase();

    if (!guardText.includes("english")) {
      errors.push("MiniStar route and playlist write guard must preserve English as the target-language trigger.");
    }

    if (!guardText.includes("hiragana")) {
      errors.push("MiniStar route and playlist write guard must preserve hiragana support-language rules.");
    }
  }

  return errors;
}

export function getAiGeneratedPackageWriterRoutePlaylistWriteGuardWarnings(guard: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(guard)) {
    return warnings;
  }

  const nextRequiredRecords = readStringArray(guard, "nextRequiredRecords");
  const routeSafetyChecks = readStringArray(guard, "routeSafetyChecks");
  const playlistSafetyChecks = readStringArray(guard, "playlistSafetyChecks");

  if (!nextRequiredRecords.includes("Route and playlist write guard storage contract")) {
    warnings.push("AI generated package writer route and playlist write guard should require its storage contract.");
  }

  if (!nextRequiredRecords.includes("Local companion package guard review")) {
    warnings.push("AI generated package writer route and playlist write guard should require local companion review.");
  }

  if (!nextRequiredRecords.includes("Assignment shell guard review")) {
    warnings.push("AI generated package writer route and playlist write guard should require assignment shell review.");
  }

  if (!routeSafetyChecks.some((check) => check.toLowerCase().includes("qr"))) {
    warnings.push("AI generated package writer route and playlist write guard should include a QR route check.");
  }

  if (!playlistSafetyChecks.some((check) => check.toLowerCase().includes("audio"))) {
    warnings.push("AI generated package writer route and playlist write guard should include an audio-first playlist check.");
  }

  return warnings;
}

export function validateAiGeneratedPackageWriterRoutePlaylistWriteGuards(guards: unknown[]): string[] {
  return guards.flatMap((guard) => validateAiGeneratedPackageWriterRoutePlaylistWriteGuard(guard));
}

export function getAiGeneratedPackageWriterRoutePlaylistWriteGuardCollectionWarnings(
  guards: unknown[],
): string[] {
  return guards.flatMap((guard) => getAiGeneratedPackageWriterRoutePlaylistWriteGuardWarnings(guard));
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
