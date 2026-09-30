export type PublisherSubmissionLiveReviewGateStatus = "passed" | "open" | "blocked";

export interface PublisherSubmissionLiveReviewJourneyGate {
  gateId: string;
  label: string;
  status: PublisherSubmissionLiveReviewGateStatus;
  evidence: string;
  nextAction: string;
}

export interface PublisherSubmissionLiveReviewJourneyInput {
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceId: string;
  unitKey: string | null;
  checksumSha256: string;
  sourceReviewDecision: "accepted-for-package-review" | "changes-required" | null;
  packageEvidenceReviewed: boolean;
  reviewPacketRecorded: boolean;
  deliveryModeSelected: boolean;
  promotionAdapterSelected: boolean;
  releaseBlockers: string[];
}

export interface PublisherSubmissionLiveReviewJourney {
  journeyId: string;
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceId: string;
  unitKey: string | null;
  checksumSha256: string;
  status: "blocked";
  reviewOnly: true;
  gates: PublisherSubmissionLiveReviewJourneyGate[];
  blockedActions: string[];
  nextGateIds: string[];
  nextGates: string[];
  packageAssemblyAllowed: false;
  promotionAllowed: false;
  qrPrintAllowed: false;
  persistenceActivationAllowed: false;
  studentFacingUseAllowed: false;
}

export function createPublisherSubmissionLiveReviewJourney(
  input: PublisherSubmissionLiveReviewJourneyInput,
): PublisherSubmissionLiveReviewJourney {
  const sourceDecisionStatus: PublisherSubmissionLiveReviewGateStatus =
    input.sourceReviewDecision === "accepted-for-package-review"
      ? "passed"
      : input.sourceReviewDecision === "changes-required"
        ? "blocked"
        : "open";

  const gates: PublisherSubmissionLiveReviewJourneyGate[] = [
    {
      gateId: "source-admitted",
      label: "Source admitted to quarantine",
      status: "passed",
      evidence: "The tenant-scoped quarantine record and checksum are available to the authorized review session.",
      nextAction: "Continue through the source review decision gate.",
    },
    {
      gateId: "source-review-decision",
      label: "Source review decision",
      status: sourceDecisionStatus,
      evidence: input.sourceReviewDecision === "accepted-for-package-review"
        ? "An immutable accepted-for-package-review decision is recorded for this source."
        : input.sourceReviewDecision === "changes-required"
          ? "The reviewer requested changes; package gates must remain closed until a new decision is recorded."
          : "No accepted-for-package-review decision is recorded for this source.",
      nextAction: input.sourceReviewDecision === "accepted-for-package-review"
        ? "Review the complete content, game, media, accessibility, and rights evidence."
        : "Record an accepted-for-package-review decision after the source fields are checked.",
    },
    {
      gateId: "package-evidence",
      label: "Multimedia and game evidence",
      status: input.packageEvidenceReviewed ? "passed" : "open",
      evidence: input.packageEvidenceReviewed
        ? "All declared content, game, audio, video, image, font, accessibility, and rights lanes have a review record."
        : "The package evidence lanes are not yet complete for this submission.",
      nextAction: input.packageEvidenceReviewed
        ? "Preserve the evidence in the immutable package review packet."
        : "Review every declared lane and attach bounded evidence references.",
    },
    {
      gateId: "package-review-packet",
      label: "Immutable package review packet",
      status: input.reviewPacketRecorded ? "passed" : "open",
      evidence: input.reviewPacketRecorded
        ? "A tenant- and checksum-bound package review packet has been recorded."
        : "The package review packet has not been recorded for this source.",
      nextAction: input.reviewPacketRecorded
        ? "Reconcile delivery and release inputs without treating the packet as approval."
        : "Record the review packet after source and package evidence decisions are complete.",
    },
    {
      gateId: "delivery-mode",
      label: "Delivery mode selection",
      status: input.deliveryModeSelected ? "passed" : "open",
      evidence: input.deliveryModeSelected
        ? "A review-only hosted, closed-local, or hybrid delivery choice is recorded."
        : "No delivery mode has been selected for this publisher package.",
      nextAction: input.deliveryModeSelected
        ? "Complete the delivery-specific policy, recovery, and cost evidence."
        : "Choose a delivery mode with a named publisher or school owner.",
    },
    {
      gateId: "promotion-adapter",
      label: "Promotion adapter decision",
      status: input.promotionAdapterSelected ? "passed" : "open",
      evidence: input.promotionAdapterSelected
        ? "A checksum-bound promotion adapter choice is recorded without enabling promotion."
        : "No promotion adapter has been selected for the reviewed package.",
      nextAction: input.promotionAdapterSelected
        ? "Run the release and QR preflight against the same package identity."
        : "Select the adapter that matches the approved delivery shape.",
    },
    {
      gateId: "release-and-qr",
      label: "Release and QR authorization",
      status: "blocked",
      evidence: input.releaseBlockers.length > 0
        ? input.releaseBlockers.join(" ")
        : "Release approval, rollback evidence, and QR print authorization are not recorded.",
      nextAction: "Complete human release review before any package writer or QR printer is enabled.",
    },
    {
      gateId: "teacher-rehearsal",
      label: "Teacher-led student rehearsal",
      status: "blocked",
      evidence: "A teacher rehearsal can only use the approved package, routes, media, and QR fallback after release gates close.",
      nextAction: "Run the teacher-led QR, audio, progression, report, and fallback rehearsal after release review.",
    },
  ];

  const unresolvedGates = gates.filter((gate) => gate.status !== "passed");

  return {
    journeyId: `${input.packageId}:${input.quarantineId}:live-review-journey`,
    tenantId: input.tenantId,
    quarantineId: input.quarantineId,
    packageId: input.packageId,
    sourceId: input.sourceId,
    unitKey: input.unitKey,
    checksumSha256: input.checksumSha256,
    status: "blocked",
    reviewOnly: true,
    gates,
    blockedActions: [
      "No package assembly",
      "No file promotion",
      "No QR print",
      "No persistence activation",
      "No student-facing use",
    ],
    nextGateIds: unresolvedGates.map((gate) => gate.gateId),
    nextGates: unresolvedGates.map((gate) => `${gate.label}: ${gate.nextAction}`),
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    qrPrintAllowed: false,
    persistenceActivationAllowed: false,
    studentFacingUseAllowed: false,
  };
}

export function validatePublisherSubmissionLiveReviewJourney(
  value: unknown,
): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Publisher submission live review journey must be an object."];
  for (const field of ["journeyId", "tenantId", "quarantineId", "packageId", "sourceId", "checksumSha256"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Publisher submission live review journey ${field} must be non-empty.`);
  }
  if (!/^[a-f0-9]{64}$/.test(String(value.checksumSha256 ?? ""))) errors.push("Publisher submission live review journey checksum must be lowercase SHA-256.");
  if (value.status !== "blocked" || value.reviewOnly !== true) errors.push("Publisher submission live review journey must remain blocked and review-only.");
  if (!Array.isArray(value.gates) || value.gates.length < 8) errors.push("Publisher submission live review journey must include all review gates.");
  const gateIds = new Set<string>();
  for (const gate of Array.isArray(value.gates) ? value.gates : []) {
    if (!isRecord(gate)) {
      errors.push("Publisher submission live review journey gates must be objects.");
      continue;
    }
    if (!isNonEmptyString(gate.gateId) || !isNonEmptyString(gate.label) || !isNonEmptyString(gate.evidence) || !isNonEmptyString(gate.nextAction)) errors.push("Publisher submission live review journey gates must contain bounded review text.");
    if (isNonEmptyString(gate.gateId) && gateIds.has(gate.gateId)) errors.push(`Duplicate publisher submission live review journey gate: ${gate.gateId}.`);
    if (isNonEmptyString(gate.gateId)) gateIds.add(gate.gateId);
    if (!["passed", "open", "blocked"].includes(String(gate.status))) errors.push("Publisher submission live review journey gate status is unsupported.");
  }
  const requiredGates = ["source-admitted", "source-review-decision", "package-evidence", "package-review-packet", "delivery-mode", "promotion-adapter", "release-and-qr", "teacher-rehearsal"];
  for (const gateId of requiredGates) if (!gateIds.has(gateId)) errors.push(`Publisher submission live review journey is missing gate ${gateId}.`);
  if (!Array.isArray(value.blockedActions) || value.blockedActions.length === 0) errors.push("Publisher submission live review journey must include blocked actions.");
  if (!Array.isArray(value.nextGates) || value.nextGates.length === 0) errors.push("Publisher submission live review journey must include next gates.");
  if (!Array.isArray(value.nextGateIds) || value.nextGateIds.length === 0) errors.push("Publisher submission live review journey must include unresolved next gate ids.");
  const knownGateIds = new Set(gateIds);
  const nextGateIds = Array.isArray(value.nextGateIds) ? value.nextGateIds : [];
  if (nextGateIds.some((gateId) => typeof gateId !== "string" || !knownGateIds.has(gateId))) errors.push("Publisher submission live review journey next gate ids must reference known gates.");
  if (new Set(nextGateIds).size !== nextGateIds.length) errors.push("Publisher submission live review journey next gate ids must be unique.");
  for (const field of ["packageAssemblyAllowed", "promotionAllowed", "qrPrintAllowed", "persistenceActivationAllowed", "studentFacingUseAllowed"] as const) if (value[field] !== false) errors.push(`${field} must remain false.`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
