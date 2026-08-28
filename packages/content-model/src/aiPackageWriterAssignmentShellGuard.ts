export type AiGeneratedPackageWriterAssignmentShellGuardStatus = "blocked" | "review-only";
export type AiGeneratedPackageWriterAssignmentShellSurfaceStatus = "blocked" | "needs-review";

export type AiGeneratedPackageWriterAssignmentShellSurfaceKind =
  | "assignment_shell"
  | "private_assignment_link"
  | "class_roster_scope"
  | "progress_event_contract"
  | "teacher_report_preview"
  | "launch_gate_binding";

export interface AiGeneratedPackageWriterAssignmentShellSurface {
  surfaceId: string;
  label: string;
  surfaceKind: AiGeneratedPackageWriterAssignmentShellSurfaceKind;
  status: AiGeneratedPackageWriterAssignmentShellSurfaceStatus;
  sourceRecord: string;
  requiredProofs: string[];
  blockedActions: string[];
}

export interface AiGeneratedPackageWriterAssignmentShellGuard {
  guardId: string;
  tenantId: string;
  requestId: string;
  localCompanionGuardId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageWriterAssignmentShellGuardStatus;
  guardState: string;
  packageIdPreview: string;
  protectedAssignmentSurfaces: AiGeneratedPackageWriterAssignmentShellSurface[];
  assignmentSafetyChecks: string[];
  reportingSafetyChecks: string[];
  blockedAssignmentActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const AI_PACKAGE_WRITER_ASSIGNMENT_SHELL_REQUIRED_SURFACE_KINDS = [
  "assignment_shell",
  "private_assignment_link",
  "class_roster_scope",
  "progress_event_contract",
  "teacher_report_preview",
  "launch_gate_binding",
] as const;

export const AI_PACKAGE_WRITER_ASSIGNMENT_SHELL_REQUIRED_BLOCKED_ACTIONS = [
  "No assignment shell write",
  "No private assignment link activation",
  "No class roster binding",
  "No progress event stream activation",
  "No teacher report export",
  "No live classroom launch",
  "No assignment activation from generated package",
  "No support-language-only assignment approval",
  "No writer execution",
] as const;

export const AI_PACKAGE_WRITER_ASSIGNMENT_SHELL_REQUIRED_ASSIGNMENT_CHECKS = [
  "Teacher QR/front-door assignment review",
  "Target-language trigger assignment check",
  "No real learner data collection check",
  "School policy acceptance preflight",
] as const;

export const AI_PACKAGE_WRITER_ASSIGNMENT_SHELL_REQUIRED_REPORTING_CHECKS = [
  "Teacher report privacy check",
  "Progress event taxonomy check",
  "No raw microphone audio or transcript check",
] as const;

export function validateAiGeneratedPackageWriterAssignmentShellGuard(guard: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(guard)) {
    return ["AI generated package writer assignment shell guard must be a JSON object."];
  }

  const guardId = readString(guard, "guardId");
  const tenantId = readString(guard, "tenantId");
  const requestId = readString(guard, "requestId");
  const localCompanionGuardId = readString(guard, "localCompanionGuardId");
  const status = readString(guard, "status");
  const guardState = readString(guard, "guardState");
  const packageIdPreview = readString(guard, "packageIdPreview");
  const protectedAssignmentSurfaces = readArray(guard, "protectedAssignmentSurfaces");
  const assignmentSafetyChecks = readStringArray(guard, "assignmentSafetyChecks");
  const reportingSafetyChecks = readStringArray(guard, "reportingSafetyChecks");
  const blockedAssignmentActions = readStringArray(guard, "blockedAssignmentActions");
  const supportLanguageBoundary = readStringArray(guard, "supportLanguageBoundary");

  if (!guardId || !tenantId || !requestId || !localCompanionGuardId) {
    errors.push(
      "AI generated package writer assignment shell guard must include guardId, tenantId, requestId, and localCompanionGuardId.",
    );
  }

  if (status !== "blocked") {
    errors.push("AI generated package writer assignment shell guard status must stay blocked.");
  }

  if (!guardState.toLowerCase().includes("assignment shell blocked")) {
    errors.push("AI generated package writer assignment shell guard must state that assignment shell work is blocked.");
  }

  if (!packageIdPreview) {
    errors.push("AI generated package writer assignment shell guard must include packageIdPreview.");
  }

  const surfaceKinds = protectedAssignmentSurfaces.flatMap((surface) =>
    isRecord(surface) ? [readString(surface, "surfaceKind")] : [],
  );

  for (const requiredKind of AI_PACKAGE_WRITER_ASSIGNMENT_SHELL_REQUIRED_SURFACE_KINDS) {
    if (!surfaceKinds.includes(requiredKind)) {
      errors.push(`AI generated package writer assignment shell guard must protect: ${requiredKind}.`);
    }
  }

  for (const requiredAction of AI_PACKAGE_WRITER_ASSIGNMENT_SHELL_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedAssignmentActions.includes(requiredAction)) {
      errors.push(`AI generated package writer assignment shell guard must block: ${requiredAction}.`);
    }
  }

  for (const requiredCheck of AI_PACKAGE_WRITER_ASSIGNMENT_SHELL_REQUIRED_ASSIGNMENT_CHECKS) {
    if (!assignmentSafetyChecks.includes(requiredCheck)) {
      errors.push(`AI generated package writer assignment shell guard must require assignment check: ${requiredCheck}.`);
    }
  }

  for (const requiredCheck of AI_PACKAGE_WRITER_ASSIGNMENT_SHELL_REQUIRED_REPORTING_CHECKS) {
    if (!reportingSafetyChecks.includes(requiredCheck)) {
      errors.push(`AI generated package writer assignment shell guard must require reporting check: ${requiredCheck}.`);
    }
  }

  for (const surface of protectedAssignmentSurfaces) {
    if (!isRecord(surface)) {
      errors.push("AI generated package writer assignment shell protected surfaces must be objects.");
      continue;
    }

    const surfaceId = readString(surface, "surfaceId");
    const statusValue = readString(surface, "status");
    const sourceRecord = readString(surface, "sourceRecord");
    const requiredProofs = readStringArray(surface, "requiredProofs");
    const blockedActions = readStringArray(surface, "blockedActions");

    if (!surfaceId) {
      errors.push("AI generated package writer assignment shell protected surfaces must include surfaceId.");
    }

    if (statusValue !== "blocked") {
      errors.push(`AI generated package writer assignment shell surface ${surfaceId || "(missing)"} must stay blocked.`);
    }

    if (!sourceRecord || requiredProofs.length === 0 || blockedActions.length === 0) {
      errors.push(
        `AI generated package writer assignment shell surface ${surfaceId || "(missing)"} must include sourceRecord, requiredProofs, and blockedActions.`,
      );
    }

    if (!blockedActions.every((blockedAction) => blockedAction.startsWith("No "))) {
      errors.push(
        `AI generated package writer assignment shell surface ${surfaceId || "(missing)"} blockedActions must be explicit No rules.`,
      );
    }
  }

  if (supportLanguageBoundary.length === 0 || !supportLanguageBoundary.join(" ").toLowerCase().includes("support")) {
    errors.push("AI generated package writer assignment shell guard must preserve a support-language boundary.");
  }

  if (tenantId === "ministar") {
    const guardText = [
      readString(guard, "summary"),
      ...assignmentSafetyChecks,
      ...reportingSafetyChecks,
      ...supportLanguageBoundary,
    ]
      .join(" ")
      .toLowerCase();

    if (!guardText.includes("english")) {
      errors.push("MiniStar assignment shell guard must preserve English as the target-language trigger.");
    }

    if (!guardText.includes("hiragana")) {
      errors.push("MiniStar assignment shell guard must preserve hiragana support-language rules.");
    }
  }

  return errors;
}

export function getAiGeneratedPackageWriterAssignmentShellGuardWarnings(guard: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(guard)) {
    return warnings;
  }

  const nextRequiredRecords = readStringArray(guard, "nextRequiredRecords");
  const assignmentSafetyChecks = readStringArray(guard, "assignmentSafetyChecks");
  const reportingSafetyChecks = readStringArray(guard, "reportingSafetyChecks");

  if (!nextRequiredRecords.includes("Assignment shell guard storage contract")) {
    warnings.push("AI generated package writer assignment shell guard should require its storage contract.");
  }

  if (!nextRequiredRecords.includes("Classroom launch gate review")) {
    warnings.push("AI generated package writer assignment shell guard should require classroom launch gate review.");
  }

  if (!nextRequiredRecords.includes("Teacher reporting export policy review")) {
    warnings.push("AI generated package writer assignment shell guard should require report export policy review.");
  }

  if (!assignmentSafetyChecks.some((check) => check.toLowerCase().includes("target-language"))) {
    warnings.push("AI generated package writer assignment shell guard should include a target-language assignment check.");
  }

  if (!reportingSafetyChecks.some((check) => check.toLowerCase().includes("privacy"))) {
    warnings.push("AI generated package writer assignment shell guard should include a teacher report privacy check.");
  }

  return warnings;
}

export function validateAiGeneratedPackageWriterAssignmentShellGuards(guards: unknown[]): string[] {
  return guards.flatMap((guard) => validateAiGeneratedPackageWriterAssignmentShellGuard(guard));
}

export function getAiGeneratedPackageWriterAssignmentShellGuardCollectionWarnings(guards: unknown[]): string[] {
  return guards.flatMap((guard) => getAiGeneratedPackageWriterAssignmentShellGuardWarnings(guard));
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
