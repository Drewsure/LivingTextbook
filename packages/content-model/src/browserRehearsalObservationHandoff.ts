import type { BrowserRehearsalObservation } from "./browserRehearsalObservation";

export interface BrowserRehearsalObservationHandoff {
  version: 1;
  handoffId: string;
  handoffKind: "browser-observation-review";
  sourceObservationId: string;
  tenantId: string;
  packageId: string;
  launchCode: string;
  unitKey: string;
  studentSessionId: string;
  routePaths: string[];
  checkIds: string[];
  status: "review-only";
  reviewDestination: "adult-evidence-review";
  exportAllowed: false;
  releasePromotionAllowed: false;
  studentProductionLaunchAllowed: false;
  blockedActions: string[];
  nextGate: string[];
}

export function createBrowserRehearsalObservationHandoff(
  observation: BrowserRehearsalObservation,
): BrowserRehearsalObservationHandoff {
  return {
    version: 1,
    handoffId: `browser-observation-handoff:${observation.observationId}`,
    handoffKind: "browser-observation-review",
    sourceObservationId: observation.observationId,
    tenantId: observation.tenantId,
    packageId: observation.packageId,
    launchCode: observation.launchCode,
    unitKey: observation.unitKey,
    studentSessionId: observation.studentSessionId,
    routePaths: [...observation.routePaths],
    checkIds: [...observation.checkIds],
    status: "review-only",
    reviewDestination: "adult-evidence-review",
    exportAllowed: false,
    releasePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
    blockedActions: [
      "No evidence export",
      "No release promotion",
      "No student production launch",
      "No hosted persistence write",
      "No QR route mutation",
    ],
    nextGate: [
      "Adult reviewer adjudication",
      "Fresh browser, privacy, and tenant-isolation evidence",
      "Release-control and school-policy review",
    ],
  };
}

export function validateBrowserRehearsalObservationHandoff(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Browser rehearsal observation handoff must be an object."];

  for (const field of [
    "handoffId",
    "sourceObservationId",
    "tenantId",
    "packageId",
    "launchCode",
    "unitKey",
    "studentSessionId",
  ] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Browser observation handoff ${field} must be non-empty.`);
  }

  if (value.version !== 1) errors.push("Browser observation handoff version is unsupported.");
  if (value.handoffKind !== "browser-observation-review") errors.push("Browser observation handoff kind is unsupported.");
  if (value.status !== "review-only") errors.push("Browser observation handoff must remain review-only.");
  if (value.reviewDestination !== "adult-evidence-review") errors.push("Browser observation handoff destination is unsupported.");
  if (value.exportAllowed !== false) errors.push("Browser observation handoff export must remain false.");
  if (value.releasePromotionAllowed !== false) errors.push("Browser observation handoff promotion must remain false.");
  if (value.studentProductionLaunchAllowed !== false) errors.push("Browser observation handoff student launch must remain false.");

  const routePaths = readStringArray(value, "routePaths");
  if (routePaths.length === 0) errors.push("Browser observation handoff must preserve route paths.");
  if (routePaths.some((path) => !path.startsWith("/"))) errors.push("Browser observation handoff routes must be app-relative.");
  if (new Set(routePaths).size !== routePaths.length) errors.push("Browser observation handoff routes must be unique.");

  const checkIds = readStringArray(value, "checkIds");
  if (checkIds.length === 0) errors.push("Browser observation handoff must preserve check ids.");
  if (new Set(checkIds).size !== checkIds.length) errors.push("Browser observation handoff check ids must be unique.");

  for (const field of ["blockedActions", "nextGate"] as const) {
    const values = readStringArray(value, field);
    if (values.length === 0) errors.push(`Browser observation handoff ${field} must be non-empty.`);
  }

  const tenantId = readString(value, "tenantId");
  const unitKey = readString(value, "unitKey");
  if (!unitKey.startsWith(`${tenantId}:`)) errors.push("Browser observation handoff unit must remain tenant-scoped.");
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
