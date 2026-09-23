import {
  type BrowserPrivacyTenantEvidencePacket,
  validateBrowserPrivacyTenantEvidencePacket,
} from "./browserPrivacyTenantEvidencePacket";

export type BrowserPrivacyTenantEvidenceAdjudicationDecision = "accepted-for-next-gate" | "blocked";
export type BrowserPrivacyTenantEvidenceAdjudicationReviewerRole = "teacher" | "platform-owner";

export interface BrowserPrivacyTenantEvidenceAdjudication {
  version: 1;
  adjudicationId: string;
  packetId: string;
  observationId: string;
  tenantId: string;
  packageId: string;
  launchCode: string;
  unitKey: string;
  studentSessionId: string;
  reviewerRole: BrowserPrivacyTenantEvidenceAdjudicationReviewerRole;
  reviewerRef: string;
  adjudicatedAt: string;
  decision: BrowserPrivacyTenantEvidenceAdjudicationDecision;
  reviewerNote: string;
  status: "review-only";
  hostedWriteAllowed: false;
  studentDataCollectionAllowed: false;
  exportAllowed: false;
  releasePromotionAllowed: false;
  studentProductionLaunchAllowed: false;
  blockedActions: string[];
  nextGate: string[];
}

export const BROWSER_PRIVACY_TENANT_ADJUDICATION_BLOCKED_ACTIONS = [
  "No hosted persistence write",
  "No student data collection",
  "No evidence export",
  "No release promotion",
  "No student production launch",
  "No QR route mutation",
] as const;

export function createBrowserPrivacyTenantEvidenceAdjudication(
  packet: BrowserPrivacyTenantEvidencePacket,
  args: {
    reviewerRole: BrowserPrivacyTenantEvidenceAdjudicationReviewerRole;
    reviewerRef: string;
    decision: BrowserPrivacyTenantEvidenceAdjudicationDecision;
    reviewerNote: string;
    adjudicationId?: string;
    adjudicatedAt?: string;
  },
): BrowserPrivacyTenantEvidenceAdjudication {
  return {
    version: 1,
    adjudicationId: args.adjudicationId?.trim() || `browser-privacy-tenant-adjudication:${packet.packetId}`,
    packetId: packet.packetId,
    observationId: packet.observationId,
    tenantId: packet.tenantId,
    packageId: packet.packageId,
    launchCode: packet.launchCode,
    unitKey: packet.unitKey,
    studentSessionId: packet.studentSessionId,
    reviewerRole: args.reviewerRole,
    reviewerRef: args.reviewerRef.trim(),
    adjudicatedAt: args.adjudicatedAt ?? new Date().toISOString(),
    decision: args.decision,
    reviewerNote: args.reviewerNote.trim(),
    status: "review-only",
    hostedWriteAllowed: false,
    studentDataCollectionAllowed: false,
    exportAllowed: false,
    releasePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
    blockedActions: [...BROWSER_PRIVACY_TENANT_ADJUDICATION_BLOCKED_ACTIONS],
    nextGate: args.decision === "accepted-for-next-gate"
      ? ["Release-control and school-policy review", "Fresh pilot package scope confirmation"]
      : ["Correct the recorded blocker", "Capture fresh scoped evidence", "Repeat packet adjudication"],
  };
}

export function validateBrowserPrivacyTenantEvidenceAdjudication(
  value: unknown,
  packet?: BrowserPrivacyTenantEvidencePacket,
): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Browser privacy tenant evidence adjudication must be an object."];
  for (const field of ["adjudicationId", "packetId", "observationId", "tenantId", "packageId", "launchCode", "unitKey", "studentSessionId", "reviewerRef", "reviewerNote"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Browser privacy tenant evidence adjudication ${field} must be non-empty.`);
  }
  if (value.version !== 1) errors.push("Browser privacy tenant evidence adjudication version is unsupported.");
  if (value.status !== "review-only") errors.push("Browser privacy tenant evidence adjudication must remain review-only.");
  for (const field of ["hostedWriteAllowed", "studentDataCollectionAllowed", "exportAllowed", "releasePromotionAllowed", "studentProductionLaunchAllowed"] as const) {
    if (value[field] !== false) errors.push(`Browser privacy tenant evidence adjudication ${field} must remain false.`);
  }
  if (!["teacher", "platform-owner"].includes(readString(value, "reviewerRole"))) errors.push("Browser privacy tenant evidence adjudication reviewer role is unsupported.");
  if (!["accepted-for-next-gate", "blocked"].includes(readString(value, "decision"))) errors.push("Browser privacy tenant evidence adjudication decision is unsupported.");
  if (!isIsoTimestamp(value.adjudicatedAt)) errors.push("Browser privacy tenant evidence adjudication adjudicatedAt must be an ISO timestamp.");
  if (readString(value, "reviewerNote").length > 1000) errors.push("Browser privacy tenant evidence adjudication reviewer note must be 1000 characters or fewer.");
  const blockedActions = readStringArray(value, "blockedActions");
  for (const action of BROWSER_PRIVACY_TENANT_ADJUDICATION_BLOCKED_ACTIONS) if (!blockedActions.includes(action)) errors.push(`Browser privacy tenant evidence adjudication must block ${action}.`);
  if (new Set(blockedActions).size !== blockedActions.length) errors.push("Browser privacy tenant evidence adjudication blocked actions must be unique.");
  const nextGate = readStringArray(value, "nextGate");
  if (nextGate.length === 0) errors.push("Browser privacy tenant evidence adjudication must include a next gate.");
  if (new Set(nextGate).size !== nextGate.length) errors.push("Browser privacy tenant evidence adjudication next gate must be unique.");
  if (packet) {
    if (validateBrowserPrivacyTenantEvidencePacket(packet).length > 0) errors.push("Browser privacy tenant evidence adjudication source packet is invalid.");
    for (const field of ["packetId", "observationId", "tenantId", "packageId", "launchCode", "unitKey", "studentSessionId"] as const) if (value[field] !== packet[field]) errors.push(`Browser privacy tenant evidence adjudication must preserve packet ${field}.`);
    if (readString(value, "decision") === "accepted-for-next-gate" && packet.lanes.some((lane) => lane.status !== "passed")) errors.push("Browser privacy tenant evidence adjudication cannot accept a packet with pending or failed lanes.");
  }
  const tenantId = readString(value, "tenantId");
  if (!readString(value, "unitKey").startsWith(`${tenantId}:`)) errors.push("Browser privacy tenant evidence adjudication unit must remain tenant-scoped.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function readString(record: Record<string, unknown>, key: string): string { return typeof record[key] === "string" ? record[key].trim() : ""; }
function readStringArray(record: Record<string, unknown>, key: string): string[] { return Array.isArray(record[key]) ? record[key].filter(isNonEmptyString).map((value) => value.trim()) : []; }
function isIsoTimestamp(value: unknown): value is string { return typeof value === "string" && value.includes("T") && !Number.isNaN(Date.parse(value)); }
