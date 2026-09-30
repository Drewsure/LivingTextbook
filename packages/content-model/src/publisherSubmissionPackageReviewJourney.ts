export type PublisherSubmissionReviewJourneyGateStatus = "passed" | "blocked";

export interface PublisherSubmissionReviewJourneyGate {
  gateId: string;
  label: string;
  status: PublisherSubmissionReviewJourneyGateStatus;
  evidence: string;
  nextAction: string;
}

export interface PublisherSubmissionPackageReviewJourney {
  journeyId: string;
  tenantId: string;
  packageId: string;
  manifestId: string;
  reconciliationId: string;
  quarantineId: string;
  evidencePacketId: string;
  packageReviewPacketId: string;
  packageEvidenceReviewId: string;
  sourceChecksumSha256: string;
  evidenceIndexRoute: string;
  evidenceHandoffRoute: string;
  status: "blocked";
  reviewOnly: true;
  sampleDataOnly: true;
  gates: PublisherSubmissionReviewJourneyGate[];
  blockedActions: string[];
  nextGates: string[];
  packageAssemblyAllowed: false;
  promotionAllowed: false;
  qrPrintAllowed: false;
  persistenceActivationAllowed: false;
  studentFacingUseAllowed: false;
}

export function validatePublisherSubmissionPackageReviewJourney(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Publisher submission package review journey must be an object."];
  for (const field of [
    "journeyId", "tenantId", "packageId", "manifestId", "reconciliationId", "quarantineId", "evidencePacketId",
    "packageReviewPacketId", "packageEvidenceReviewId", "sourceChecksumSha256", "evidenceIndexRoute", "evidenceHandoffRoute",
  ] as const) if (!isNonEmptyString(value[field])) errors.push(`Publisher submission review journey ${field} must be non-empty.`);
  if (!isOpaqueQuarantineId(value.quarantineId)) errors.push("Publisher submission review journey quarantineId must be opaque.");
  if (!/^[a-f0-9]{64}$/.test(String(value.sourceChecksumSha256 ?? ""))) errors.push("Publisher submission review journey checksum must be lowercase SHA-256.");
  if (!isInternalPath(value.evidenceIndexRoute) || !isInternalPath(value.evidenceHandoffRoute)) errors.push("Publisher submission review journey evidence routes must be internal.");
  if (value.status !== "blocked") errors.push("Publisher submission review journey must remain blocked.");
  if (value.reviewOnly !== true || value.sampleDataOnly !== true) errors.push("Publisher submission review journey must remain review-only sample data.");
  const gates = Array.isArray(value.gates) ? value.gates : [];
  if (gates.length === 0) errors.push("Publisher submission review journey must include gates.");
  const gateIds = new Set<string>();
  for (const gate of gates) {
    if (!isRecord(gate) || !isNonEmptyString(gate.gateId) || !isNonEmptyString(gate.label) || !isNonEmptyString(gate.evidence) || !isNonEmptyString(gate.nextAction)) errors.push("Publisher submission review journey gates must have bounded identity and review text.");
    if (isRecord(gate) && gateIds.has(String(gate.gateId))) errors.push(`Duplicate publisher submission review journey gate: ${String(gate.gateId)}.`);
    if (isRecord(gate)) gateIds.add(String(gate.gateId));
    if (isRecord(gate) && gate.status !== "passed" && gate.status !== "blocked") errors.push("Publisher submission review journey gate status is unsupported.");
  }
  const blockedActions = Array.isArray(value.blockedActions)
    ? value.blockedActions.filter((action): action is string => typeof action === "string")
    : [];
  if (blockedActions.length === 0) errors.push("Publisher submission review journey must include blocked actions.");
  if (!Array.isArray(value.nextGates) || value.nextGates.length === 0) errors.push("Publisher submission review journey must include next gates.");
  for (const action of ["No package assembly", "No file promotion", "No QR print", "No persistence activation", "No student-facing use"]) if (!blockedActions.includes(action)) errors.push(`Publisher submission review journey must include: ${action}.`);
  for (const field of ["packageAssemblyAllowed", "promotionAllowed", "qrPrintAllowed", "persistenceActivationAllowed", "studentFacingUseAllowed"] as const) if (value[field] !== false) errors.push(`${field} must remain false.`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function isOpaqueQuarantineId(value: unknown): value is string { return typeof value === "string" && /^q-[0-9a-f-]{36}$/.test(value); }
function isInternalPath(value: unknown): value is string { return typeof value === "string" && value.startsWith("/") && !/^(?:\/\/|file:|https?:\/\/|[A-Za-z]:)/i.test(value); }
