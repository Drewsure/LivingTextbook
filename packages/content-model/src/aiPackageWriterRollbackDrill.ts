export type AiGeneratedPackageWriterRollbackDrillStatus = "blocked" | "review-only";
export type AiGeneratedPackageWriterRollbackStepStatus = "blocked" | "needs-evidence";

export interface AiGeneratedPackageWriterRollbackStep {
  stepId: string;
  label: string;
  scope: string;
  status: AiGeneratedPackageWriterRollbackStepStatus;
  requiredSnapshot: string;
  verificationCheck: string;
  blockedActions: string[];
}

export interface AiGeneratedPackageWriterRollbackDrill {
  drillId: string;
  tenantId: string;
  requestId: string;
  preflightId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageWriterRollbackDrillStatus;
  drillState: string;
  packageIdPreview: string;
  preWriteSnapshots: string[];
  postWriteVerification: string[];
  rollbackSteps: AiGeneratedPackageWriterRollbackStep[];
  allowedReviewActions: string[];
  blockedRollbackActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const AI_PACKAGE_WRITER_ROLLBACK_REQUIRED_BLOCKED_ACTIONS = [
  "No rollback execution",
  "No package writer execution",
  "No package JSON rollback execution",
  "No route registry rollback",
  "No media playlist rollback",
  "No local bundle rollback",
  "No assignment rollback",
  "No production QR redirect mutation",
  "No support-language-only rollback evidence",
] as const;

export const AI_PACKAGE_WRITER_ROLLBACK_REQUIRED_SNAPSHOT_KEYWORDS = [
  "package JSON",
  "route registry",
  "media playlist",
  "local companion",
  "assignment shell",
  "release-control",
] as const;

export function validateAiGeneratedPackageWriterRollbackDrill(drill: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(drill)) {
    return ["AI generated package writer rollback drill must be a JSON object."];
  }

  const drillId = readString(drill, "drillId");
  const tenantId = readString(drill, "tenantId");
  const requestId = readString(drill, "requestId");
  const preflightId = readString(drill, "preflightId");
  const status = readString(drill, "status");
  const drillState = readString(drill, "drillState");
  const packageIdPreview = readString(drill, "packageIdPreview");
  const preWriteSnapshots = readStringArray(drill, "preWriteSnapshots");
  const postWriteVerification = readStringArray(drill, "postWriteVerification");
  const rollbackSteps = readArray(drill, "rollbackSteps");
  const blockedRollbackActions = readStringArray(drill, "blockedRollbackActions");
  const supportLanguageBoundary = readStringArray(drill, "supportLanguageBoundary");

  if (!drillId || !tenantId || !requestId || !preflightId) {
    errors.push("AI generated package writer rollback drill must include drillId, tenantId, requestId, and preflightId.");
  }

  if (status !== "blocked") {
    errors.push("AI generated package writer rollback drill status must stay blocked in the foundation.");
  }

  if (!drillState.toLowerCase().includes("blocked")) {
    errors.push("AI generated package writer rollback drill must state that rollback is blocked.");
  }

  if (!packageIdPreview) {
    errors.push("AI generated package writer rollback drill must include packageIdPreview.");
  }

  for (const requiredAction of AI_PACKAGE_WRITER_ROLLBACK_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedRollbackActions.includes(requiredAction)) {
      errors.push(`AI generated package writer rollback drill must block: ${requiredAction}.`);
    }
  }

  for (const requiredSnapshot of AI_PACKAGE_WRITER_ROLLBACK_REQUIRED_SNAPSHOT_KEYWORDS) {
    if (!preWriteSnapshots.some((snapshot) => snapshot.includes(requiredSnapshot))) {
      errors.push(`AI generated package writer rollback drill must include pre-write snapshot for: ${requiredSnapshot}.`);
    }
  }

  if (postWriteVerification.length === 0) {
    errors.push("AI generated package writer rollback drill must include postWriteVerification checks.");
  }

  if (supportLanguageBoundary.length === 0 || !supportLanguageBoundary.join(" ").toLowerCase().includes("support")) {
    errors.push("AI generated package writer rollback drill must preserve a support-language boundary.");
  }

  for (const step of rollbackSteps) {
    if (!isRecord(step)) {
      errors.push("AI generated package writer rollback drill steps must be objects.");
      continue;
    }

    const stepId = readString(step, "stepId");
    const stepStatus = readString(step, "status");
    const requiredSnapshot = readString(step, "requiredSnapshot");
    const verificationCheck = readString(step, "verificationCheck");
    const blockedActions = readStringArray(step, "blockedActions");

    if (!stepId) {
      errors.push("AI generated package writer rollback drill steps must include stepId.");
    }

    if (stepStatus !== "blocked") {
      errors.push(`AI generated package writer rollback drill step ${stepId || "(missing)"} must stay blocked.`);
    }

    if (!requiredSnapshot || !verificationCheck || blockedActions.length === 0) {
      errors.push(
        `AI generated package writer rollback drill step ${stepId || "(missing)"} must include requiredSnapshot, verificationCheck, and blockedActions.`,
      );
    }

    if (!blockedActions.every((blockedAction) => blockedAction.startsWith("No "))) {
      errors.push(`AI generated package writer rollback drill step ${stepId || "(missing)"} blockedActions must be explicit No rules.`);
    }
  }

  return errors;
}

export function getAiGeneratedPackageWriterRollbackDrillWarnings(drill: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(drill)) {
    return warnings;
  }

  const rollbackSteps = readArray(drill, "rollbackSteps");
  const allowedReviewActions = readStringArray(drill, "allowedReviewActions");
  const nextRequiredRecords = readStringArray(drill, "nextRequiredRecords");

  if (rollbackSteps.length < 5) {
    warnings.push("AI generated package writer rollback drill should cover package, route, playlist, local companion, and assignment rollback rehearsals.");
  }

  if (allowedReviewActions.length === 0) {
    warnings.push("AI generated package writer rollback drill should name allowed review actions.");
  }

  if (!nextRequiredRecords.includes("school_policy_rollback_impact_matrix")) {
    warnings.push("AI generated package writer rollback drill should require school_policy_rollback_impact_matrix before rollback planning.");
  }

  return warnings;
}

export function validateAiGeneratedPackageWriterRollbackDrills(drills: unknown[]): string[] {
  return drills.flatMap((drill) => validateAiGeneratedPackageWriterRollbackDrill(drill));
}

export function getAiGeneratedPackageWriterRollbackDrillCollectionWarnings(drills: unknown[]): string[] {
  return drills.flatMap((drill) => getAiGeneratedPackageWriterRollbackDrillWarnings(drill));
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
