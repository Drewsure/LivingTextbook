export type BrowserRehearsalObservationMode = "browser-automation" | "human-observed";
export type BrowserRehearsalObservationReviewerRole = "automation" | "teacher";

export interface BrowserRehearsalObservation {
  version: 1;
  observationId: string;
  tenantId: string;
  packageId: string;
  launchCode: string;
  unitKey: string;
  studentSessionId: string;
  mode: BrowserRehearsalObservationMode;
  reviewerRole: BrowserRehearsalObservationReviewerRole;
  reviewerRef: string;
  observedAt: string;
  routePaths: string[];
  checkIds: string[];
  status: "review-only";
  releasePromotionAllowed: false;
  studentProductionLaunchAllowed: false;
}

export function validateBrowserRehearsalObservation(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Browser rehearsal observation must be an object."];

  for (const field of [
    "observationId",
    "tenantId",
    "packageId",
    "launchCode",
    "unitKey",
    "studentSessionId",
    "reviewerRef",
  ] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Browser rehearsal observation ${field} must be non-empty.`);
  }

  if (value.version !== 1) errors.push("Browser rehearsal observation version is unsupported.");
  if (value.status !== "review-only") errors.push("Browser rehearsal observation status must remain review-only.");
  if (value.releasePromotionAllowed !== false) errors.push("Browser rehearsal observation release promotion must remain false.");
  if (value.studentProductionLaunchAllowed !== false) errors.push("Browser rehearsal observation student launch must remain false.");
  if (!["browser-automation", "human-observed"].includes(readString(value, "mode"))) {
    errors.push("Browser rehearsal observation mode is unsupported.");
  }
  if (!["automation", "teacher"].includes(readString(value, "reviewerRole"))) {
    errors.push("Browser rehearsal observation reviewer role is unsupported.");
  }
  if (value.mode === "browser-automation" && value.reviewerRole !== "automation") {
    errors.push("Browser automation observations must identify an automation reviewer.");
  }
  if (value.mode === "human-observed" && value.reviewerRole !== "teacher") {
    errors.push("Human-observed browser evidence must identify a teacher reviewer.");
  }
  if (!isIsoTimestamp(value.observedAt)) errors.push("Browser rehearsal observation observedAt must be an ISO timestamp.");

  const routePaths = readStringArray(value, "routePaths");
  if (routePaths.length === 0) errors.push("Browser rehearsal observation must list route paths.");
  if (routePaths.some((path) => !path.startsWith("/"))) errors.push("Browser rehearsal observation routes must be app-relative.");
  if (new Set(routePaths).size !== routePaths.length) errors.push("Browser rehearsal observation routes must be unique.");

  const checkIds = readStringArray(value, "checkIds");
  if (checkIds.length === 0) errors.push("Browser rehearsal observation must list check ids.");
  if (new Set(checkIds).size !== checkIds.length) errors.push("Browser rehearsal observation check ids must be unique.");

  const tenantId = readString(value, "tenantId");
  const unitKey = readString(value, "unitKey");
  if (!unitKey.startsWith(`${tenantId}:`)) {
    errors.push("Browser rehearsal observation unit must remain tenant-scoped.");
  }
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function readString(record: Record<string, unknown>, key: string): string {
  return typeof record[key] === "string" ? record[key].trim() : "";
}

function readStringArray(record: Record<string, unknown>, key: string): string[] {
  return Array.isArray(record[key])
    ? record[key].filter((value): value is string => isNonEmptyString(value)).map((value) => value.trim())
    : [];
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && value.includes("T") && !Number.isNaN(Date.parse(value));
}
