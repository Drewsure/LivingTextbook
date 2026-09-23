import type { BrowserRehearsalObservation } from "./browserRehearsalObservation";

export const BROWSER_REHEARSAL_EVIDENCE_LANE_IDS = [
  "browser",
  "privacy",
  "tenant-isolation",
] as const;


export type BrowserRehearsalEvidenceLaneId = (typeof BROWSER_REHEARSAL_EVIDENCE_LANE_IDS)[number];
export type BrowserRehearsalEvidenceLaneStatus = "pending" | "passed" | "failed";

export interface BrowserRehearsalEvidenceLane {
  laneId: BrowserRehearsalEvidenceLaneId;
  evidenceKind: "browser-rehearsal" | "privacy-negative-test" | "tenant-negative-test";
  status: BrowserRehearsalEvidenceLaneStatus;
  sourceRecord: string;
  scope: string[];
  checkIds: string[];
  observedAt: string;
  notes: string;
}

export interface BrowserPrivacyTenantEvidencePacket {
  version: 1;
  packetId: string;
  tenantId: string;
  packageId: string;
  launchCode: string;
  unitKey: string;
  studentSessionId: string;
  observationId: string;
  verificationRunId: string;
  verificationRevision: string;
  verificationReferenceAt: string;
  lanes: BrowserRehearsalEvidenceLane[];
  status: "review-only";
  hostedWriteAllowed: false;
  studentDataCollectionAllowed: false;
  exportAllowed: false;
  releasePromotionAllowed: false;
  blockedActions: string[];
  nextGate: string[];
  note: string;
}

const REQUIRED_CHECKS: Record<BrowserRehearsalEvidenceLaneId, string[]> = {
  browser: ["route-continuity", "student-to-teacher-handoff"],
  privacy: ["raw-audio-exclusion", "transcript-exclusion"],
  "tenant-isolation": ["cross-tenant-read-rejection", "cross-tenant-write-rejection"],
};

const EXPECTED_KINDS: Record<BrowserRehearsalEvidenceLaneId, BrowserRehearsalEvidenceLane["evidenceKind"]> = {
  browser: "browser-rehearsal",
  privacy: "privacy-negative-test",
  "tenant-isolation": "tenant-negative-test",
};

export function createPendingBrowserPrivacyTenantEvidencePacket(args: {
  packetId: string;
  tenantId: string;
  packageId: string;
  launchCode: string;
  unitKey: string;
  studentSessionId: string;
  observationId: string;
  verificationRunId: string;
  verificationRevision: string;
  verificationReferenceAt: string;
}): BrowserPrivacyTenantEvidencePacket {
  const observedAt = args.verificationReferenceAt;
  return {
    version: 1,
    ...args,
    lanes: BROWSER_REHEARSAL_EVIDENCE_LANE_IDS.map((laneId) => ({
      laneId,
      evidenceKind: EXPECTED_KINDS[laneId],
      status: "pending" as const,
      sourceRecord: `pending:${laneId}-rehearsal`,
      scope: REQUIRED_CHECKS[laneId],
      checkIds: REQUIRED_CHECKS[laneId],
      observedAt,
      notes: "Evidence has not been captured; this packet is a review checklist only.",
    })),
    status: "review-only",
    hostedWriteAllowed: false,
    studentDataCollectionAllowed: false,
    exportAllowed: false,
    releasePromotionAllowed: false,
    blockedActions: [
      "No hosted persistence write",
      "No student data collection",
      "No evidence export",
      "No release promotion",
      "No classroom launch",
    ],
    nextGate: [
      "Run the browser rehearsal in the exact tenant and package scope",
      "Record privacy-negative and tenant-negative results",
      "Adjudicate the packet before pilot review",
    ],
    note: "Provider-neutral evidence packet; pending lanes must not be described as verified quality evidence.",
  };
}

export function createBrowserPrivacyTenantEvidencePacketFromObservation(
  observation: BrowserRehearsalObservation,
  args: {
    verificationRunId: string;
    verificationRevision: string;
  },
): BrowserPrivacyTenantEvidencePacket {
  const packet = createPendingBrowserPrivacyTenantEvidencePacket({
    packetId: `browser-privacy-tenant:${observation.observationId}`,
    tenantId: observation.tenantId,
    packageId: observation.packageId,
    launchCode: observation.launchCode,
    unitKey: observation.unitKey,
    studentSessionId: observation.studentSessionId,
    observationId: observation.observationId,
    verificationRunId: args.verificationRunId,
    verificationRevision: args.verificationRevision,
    verificationReferenceAt: observation.observedAt,
  });
  const browserLane = packet.lanes.find((lane) => lane.laneId === "browser");
  const hasBrowserChecks = REQUIRED_CHECKS.browser.every((checkId) => observation.checkIds.includes(checkId));
  if (browserLane && hasBrowserChecks) {
    browserLane.status = "passed";
    browserLane.sourceRecord = `observation:${observation.observationId}`;
    browserLane.scope = [...observation.routePaths];
    browserLane.checkIds = [...observation.checkIds];
    browserLane.observedAt = observation.observedAt;
    browserLane.notes = "Browser continuity and student-to-teacher handoff were observed in the exact local session scope.";
  }
  return packet;
}

export function validateBrowserPrivacyTenantEvidencePacket(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Browser privacy tenant evidence packet must be an object."];

  for (const field of [
    "packetId",
    "tenantId",
    "packageId",
    "launchCode",
    "unitKey",
    "studentSessionId",
    "observationId",
    "verificationRunId",
    "verificationRevision",
    "verificationReferenceAt",
    "note",
  ] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Browser privacy tenant evidence packet ${field} must be non-empty.`);
  }

  if (value.version !== 1) errors.push("Browser privacy tenant evidence packet version is unsupported.");
  if (value.status !== "review-only") errors.push("Browser privacy tenant evidence packet status must remain review-only.");
  for (const field of ["hostedWriteAllowed", "studentDataCollectionAllowed", "exportAllowed", "releasePromotionAllowed"] as const) {
    if (value[field] !== false) errors.push(`Browser privacy tenant evidence packet ${field} must remain false.`);
  }

  const tenantId = readString(value, "tenantId");
  if (!readString(value, "unitKey").startsWith(`${tenantId}:`)) {
    errors.push("Browser privacy tenant evidence packet unit must remain tenant-scoped.");
  }
  if (!isIsoTimestamp(value.verificationReferenceAt)) {
    errors.push("Browser privacy tenant evidence packet verificationReferenceAt must be an ISO timestamp.");
  }

  const blockedActions = readStringArray(value, "blockedActions");
  if (blockedActions.length < 5) errors.push("Browser privacy tenant evidence packet must list all five blocked actions.");
  for (const action of ["No hosted persistence write", "No student data collection", "No evidence export", "No release promotion", "No classroom launch"]) {
    if (!blockedActions.includes(action)) errors.push(`Browser privacy tenant evidence packet must block ${action}.`);
  }
  if (readStringArray(value, "nextGate").length === 0) errors.push("Browser privacy tenant evidence packet must include a next gate.");

  const lanes = value.lanes;
  if (!Array.isArray(lanes) || lanes.length !== BROWSER_REHEARSAL_EVIDENCE_LANE_IDS.length) {
    errors.push("Browser privacy tenant evidence packet must contain exactly three evidence lanes.");
    return [...new Set(errors)];
  }

  const seen = new Set<string>();
  for (const lane of lanes) {
    if (!isRecord(lane)) {
      errors.push("Browser privacy tenant evidence packet lanes must be objects.");
      continue;
    }
    const laneId = readString(lane, "laneId") as BrowserRehearsalEvidenceLaneId;
    if (seen.has(laneId)) errors.push(`Browser privacy tenant evidence lane ${laneId} is duplicated.`);
    seen.add(laneId);
    if (!BROWSER_REHEARSAL_EVIDENCE_LANE_IDS.includes(laneId)) {
      errors.push(`Browser privacy tenant evidence lane ${laneId || "(empty)"} is unsupported.`);
      continue;
    }
    if (readString(lane, "evidenceKind") !== EXPECTED_KINDS[laneId]) {
      errors.push(`Browser privacy tenant evidence lane ${laneId} must use ${EXPECTED_KINDS[laneId]}.`);
    }
    if (!["pending", "passed", "failed"].includes(readString(lane, "status"))) {
      errors.push(`Browser privacy tenant evidence lane ${laneId} status is unsupported.`);
    }
    for (const field of ["sourceRecord", "observedAt", "notes"] as const) {
      if (!isNonEmptyString(lane[field])) errors.push(`Browser privacy tenant evidence lane ${laneId} ${field} must be non-empty.`);
    }
    const scope = readStringArray(lane, "scope");
    const checkIds = readStringArray(lane, "checkIds");
    if (scope.length === 0) errors.push(`Browser privacy tenant evidence lane ${laneId} scope must not be empty.`);
    if (checkIds.length === 0) errors.push(`Browser privacy tenant evidence lane ${laneId} checkIds must not be empty.`);
    if (new Set(scope).size !== scope.length) errors.push(`Browser privacy tenant evidence lane ${laneId} scope must be unique.`);
    if (new Set(checkIds).size !== checkIds.length) errors.push(`Browser privacy tenant evidence lane ${laneId} checkIds must be unique.`);
    for (const checkId of REQUIRED_CHECKS[laneId]) {
      if (!checkIds.includes(checkId)) errors.push(`Browser privacy tenant evidence lane ${laneId} must include ${checkId}.`);
    }
    if (!isIsoTimestamp(lane.observedAt)) errors.push(`Browser privacy tenant evidence lane ${laneId} observedAt must be an ISO timestamp.`);
    if (readString(lane, "status") === "passed" && readString(lane, "sourceRecord").startsWith("pending:")) {
      errors.push(`Browser privacy tenant evidence lane ${laneId} cannot be passed with a pending source record.`);
    }
  }
  for (const laneId of BROWSER_REHEARSAL_EVIDENCE_LANE_IDS) {
    if (!seen.has(laneId)) errors.push(`Browser privacy tenant evidence packet is missing lane ${laneId}.`);
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
  return Array.isArray(record[key]) ? record[key].filter(isNonEmptyString).map((value) => value.trim()) : [];
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && value.includes("T") && !Number.isNaN(Date.parse(value));
}
