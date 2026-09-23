import type { BrowserRehearsalObservationHandoff } from "./browserRehearsalObservationHandoff";

export type BrowserRehearsalObservationAdjudicationDecision = "accepted-for-next-gate" | "blocked";
export type BrowserRehearsalObservationAdjudicationReviewerRole = "teacher" | "platform-owner";

export interface BrowserRehearsalObservationAdjudication {
  version: 1;
  adjudicationId: string;
  handoffId: string;
  sourceObservationId: string;
  tenantId: string;
  packageId: string;
  launchCode: string;
  unitKey: string;
  studentSessionId: string;
  reviewerRole: BrowserRehearsalObservationAdjudicationReviewerRole;
  reviewerRef: string;
  adjudicatedAt: string;
  decision: BrowserRehearsalObservationAdjudicationDecision;
  reviewerNote: string;
  status: "review-only";
  releasePromotionAllowed: false;
  studentProductionLaunchAllowed: false;
  hostedPersistenceWriteAllowed: false;
  blockedActions: string[];
  nextGate: string[];
}

export const BROWSER_REHEARSAL_ADJUDICATION_BLOCKED_ACTIONS = [
  "No release approval",
  "No release promotion",
  "No student production launch",
  "No hosted persistence write",
  "No evidence export",
  "No QR route mutation",
] as const;

export function createBrowserRehearsalObservationAdjudication(
  handoff: BrowserRehearsalObservationHandoff,
  args: {
    reviewerRole: BrowserRehearsalObservationAdjudicationReviewerRole;
    reviewerRef: string;
    decision: BrowserRehearsalObservationAdjudicationDecision;
    reviewerNote: string;
    adjudicationId?: string;
    adjudicatedAt?: string;
  },
): BrowserRehearsalObservationAdjudication {
  return {
    version: 1,
    adjudicationId: args.adjudicationId?.trim() || `browser-adjudication:${handoff.handoffId}`,
    handoffId: handoff.handoffId,
    sourceObservationId: handoff.sourceObservationId,
    tenantId: handoff.tenantId,
    packageId: handoff.packageId,
    launchCode: handoff.launchCode,
    unitKey: handoff.unitKey,
    studentSessionId: handoff.studentSessionId,
    reviewerRole: args.reviewerRole,
    reviewerRef: args.reviewerRef.trim(),
    adjudicatedAt: args.adjudicatedAt ?? new Date().toISOString(),
    decision: args.decision,
    reviewerNote: args.reviewerNote.trim(),
    status: "review-only",
    releasePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
    hostedPersistenceWriteAllowed: false,
    blockedActions: [...BROWSER_REHEARSAL_ADJUDICATION_BLOCKED_ACTIONS],
    nextGate: args.decision === "accepted-for-next-gate"
      ? ["Fresh browser, privacy, and tenant-isolation evidence", "Release-control and school-policy review"]
      : ["Correct the recorded blocker", "Record a fresh teacher observation", "Repeat adult adjudication"],
  };
}

export function validateBrowserRehearsalObservationAdjudication(
  value: unknown,
  handoff?: BrowserRehearsalObservationHandoff,
): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Browser rehearsal observation adjudication must be an object."];

  for (const field of [
    "adjudicationId",
    "handoffId",
    "sourceObservationId",
    "tenantId",
    "packageId",
    "launchCode",
    "unitKey",
    "studentSessionId",
    "reviewerRef",
    "reviewerNote",
  ] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Browser observation adjudication ${field} must be non-empty.`);
  }

  if (value.version !== 1) errors.push("Browser observation adjudication version is unsupported.");
  if (value.status !== "review-only") errors.push("Browser observation adjudication must remain review-only.");
  if (value.releasePromotionAllowed !== false) errors.push("Browser observation adjudication release promotion must remain false.");
  if (value.studentProductionLaunchAllowed !== false) errors.push("Browser observation adjudication student launch must remain false.");
  if (value.hostedPersistenceWriteAllowed !== false) errors.push("Browser observation adjudication hosted persistence write must remain false.");
  if (!["teacher", "platform-owner"].includes(readString(value, "reviewerRole"))) errors.push("Browser observation adjudication reviewer role is unsupported.");
  if (!["accepted-for-next-gate", "blocked"].includes(readString(value, "decision"))) errors.push("Browser observation adjudication decision is unsupported.");
  if (!isIsoTimestamp(value.adjudicatedAt)) errors.push("Browser observation adjudication adjudicatedAt must be an ISO timestamp.");
  if (readString(value, "reviewerNote").length > 1000) errors.push("Browser observation adjudication reviewer note must be 1000 characters or fewer.");

  const blockedActions = readStringArray(value, "blockedActions");
  if (blockedActions.length === 0) errors.push("Browser observation adjudication must list blocked actions.");
  for (const action of BROWSER_REHEARSAL_ADJUDICATION_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(action)) errors.push(`Browser observation adjudication must block: ${action}.`);
  }
  if (new Set(blockedActions).size !== blockedActions.length) errors.push("Browser observation adjudication blocked actions must be unique.");

  const nextGate = readStringArray(value, "nextGate");
  if (nextGate.length === 0) errors.push("Browser observation adjudication must list the next gate.");
  if (new Set(nextGate).size !== nextGate.length) errors.push("Browser observation adjudication next gate must be unique.");

  if (handoff) {
    for (const field of ["handoffId", "sourceObservationId", "tenantId", "packageId", "launchCode", "unitKey", "studentSessionId"] as const) {
      if (value[field] !== handoff[field]) errors.push(`Browser observation adjudication must preserve handoff ${field}.`);
    }
  }

  const tenantId = readString(value, "tenantId");
  if (!readString(value, "unitKey").startsWith(`${tenantId}:`)) errors.push("Browser observation adjudication unit must remain tenant-scoped.");
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
