import type { PublisherSubmissionLiveReviewJourney } from "./publisherSubmissionLiveReviewJourney";
import type { UploadQuarantineDeliveryManifestPreview } from "./uploadQuarantineDeliveryManifestPreview";
import type { UploadQuarantinePackageAssemblyPreflight } from "./uploadQuarantinePackageAssemblyPreflight";
import type { UploadQuarantinePackageIndexPreview } from "./uploadQuarantinePackageIndexPreview";
import type { UploadQuarantineReleasePreflight } from "./uploadQuarantineReleasePreflight";
import type { UploadQuarantineReleaseReceiptPreview } from "./uploadQuarantineReleaseReceiptPreview";

export type PublisherDeliveryOperatorActionStatus = "complete" | "current" | "blocked" | "not-started";

export interface PublisherDeliveryOperatorAction {
  actionId: string;
  order: number;
  label: string;
  status: PublisherDeliveryOperatorActionStatus;
  evidence: string;
  nextAction: string;
  protectedActions: string[];
}

export interface PublisherDeliveryOperatorHandoff {
  recordVersion: 1;
  planId: string;
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceId: string;
  checksumSha256: string;
  status: "blocked";
  reviewOnly: true;
  actions: PublisherDeliveryOperatorAction[];
  nextActionIds: string[];
  blockedActions: string[];
  packageAssemblyAllowed: false;
  releaseWriteAllowed: false;
  qrPrintAllowed: false;
  persistenceActivationAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export function createPublisherDeliveryOperatorHandoff(input: {
  journey: PublisherSubmissionLiveReviewJourney;
  packetRecorded: boolean;
  assemblyPreflight: UploadQuarantinePackageAssemblyPreflight | null;
  deliveryManifestPreview: UploadQuarantineDeliveryManifestPreview | null;
  releaseReceiptPreview: UploadQuarantineReleaseReceiptPreview | null;
  packageIndexPreview: UploadQuarantinePackageIndexPreview | null;
  releasePreflight: UploadQuarantineReleasePreflight | null;
}): PublisherDeliveryOperatorHandoff {
  const gateStatus = new Map(input.journey.gates.map((gate) => [gate.gateId, gate.status]));
  const statusFor = (gateIds: string[]): PublisherDeliveryOperatorActionStatus => {
    const statuses = gateIds.map((gateId) => gateStatus.get(gateId) ?? "blocked");
    if (statuses.every((status) => status === "passed")) return "complete";
    if (gateIds.some((gateId) => input.journey.nextGateIds[0] === gateId)) return "current";
    if (statuses.some((status) => status === "open")) return "not-started";
    return "blocked";
  };
  const actions: PublisherDeliveryOperatorAction[] = [
    {
      actionId: "source-and-content-review",
      order: 1,
      label: "Confirm source and content evidence",
      status: statusFor(["source-admitted", "source-review-decision", "package-evidence"]),
      evidence: "Confirm the publisher source, unit mapping, rights, accessibility, target language, and reviewed game/media evidence.",
      nextAction: "Resolve source and package evidence findings before the package review packet is treated as complete.",
      protectedActions: ["No payload promotion", "No student-facing content"],
    },
    {
      actionId: "record-review-packet",
      order: 2,
      label: "Record the package review packet",
      status: input.packetRecorded ? "complete" : statusFor(["package-review-packet"]),
      evidence: input.packetRecorded ? "A quarantine-bound review packet is available to reconcile downstream package identities." : "The package review packet has not been recorded for this submission.",
      nextAction: input.packetRecorded ? "Reconcile delivery, release, QR, and recovery evidence against the packet." : "Record the packet only after the accepted source and package evidence decisions exist.",
      protectedActions: ["No package assembly", "No release approval"],
    },
    {
      actionId: "select-delivery-and-adapter",
      order: 3,
      label: "Confirm delivery mode and promotion adapter",
      status: statusFor(["delivery-mode", "promotion-adapter"]),
      evidence: input.deliveryManifestPreview ? `The delivery preview is bound to ${input.deliveryManifestPreview.selectedMode}.` : "No delivery manifest preview is available yet.",
      nextAction: "Confirm closed-local, hosted, or hybrid policy, cost, recovery, and owner evidence.",
      protectedActions: ["No promotion", "No hosted persistence activation"],
    },
    {
      actionId: "release-and-qr-review",
      order: 4,
      label: "Complete release and QR authorization",
      status: statusFor(["release-and-qr"]),
      evidence: input.releasePreflight ? "Release preflight identities are available, but the release boundary remains independently blocked." : "Release and QR preflight is not available for this submission.",
      nextAction: "A named human reviewer must confirm release receipt, rollback reference, QR registry, and print authorization.",
      protectedActions: ["No release receipt write", "No production QR printing"],
    },
    {
      actionId: "assemble-and-integrity-check",
      order: 5,
      label: "Assemble the approved package and read back integrity",
      status: "blocked",
      evidence: input.assemblyPreflight?.status === "ready-for-manual-assembly" ? "The metadata preflight describes a possible manual assembly, but the writer remains separately gated." : "Assembly preflight is blocked or not yet available.",
      nextAction: "Only after release approval may the separately gated package writer assemble files and emit the integrity ledger.",
      protectedActions: ["No package file write", "No route or playlist write", "No local bundle write"],
    },
    {
      actionId: "teacher-rehearsal",
      order: 6,
      label: "Run teacher-led QR and student rehearsal",
      status: statusFor(["teacher-rehearsal"]),
      evidence: input.packageIndexPreview ? "A package-index preview exists for review; it is not a released classroom package." : "No released package index is available for rehearsal.",
      nextAction: "After release, rehearse QR entry, audio, English-triggered progression, reports, fallback, and rollback.",
      protectedActions: ["No student assignment", "No learner records", "No persistence activation"],
    },
  ];
  const nextActionIds = actions.filter((action) => action.status === "current").map((action) => action.actionId);
  return {
    recordVersion: 1,
    planId: `${input.journey.packageId}:${input.journey.quarantineId}:operator-handoff`,
    tenantId: input.journey.tenantId,
    quarantineId: input.journey.quarantineId,
    packageId: input.journey.packageId,
    sourceId: input.journey.sourceId,
    checksumSha256: input.journey.checksumSha256,
    status: "blocked",
    reviewOnly: true,
    actions,
    nextActionIds: nextActionIds.length > 0 ? nextActionIds : ["source-and-content-review"],
    blockedActions: [
      "No package assembly",
      "No release receipt write",
      "No QR print",
      "No hosted persistence activation",
      "No student-facing use",
    ],
    packageAssemblyAllowed: false,
    releaseWriteAllowed: false,
    qrPrintAllowed: false,
    persistenceActivationAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validatePublisherDeliveryOperatorHandoff(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Publisher delivery operator handoff must be an object."];
  if (value.recordVersion !== 1) errors.push("Publisher delivery operator handoff recordVersion must be 1.");
  for (const field of ["planId", "tenantId", "quarantineId", "packageId", "sourceId"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Publisher delivery operator handoff ${field} must be non-empty.`);
  }
  if (!/^[a-f0-9]{64}$/.test(String(value.checksumSha256 ?? ""))) errors.push("Publisher delivery operator handoff checksum must be lowercase SHA-256.");
  if (value.status !== "blocked" || value.reviewOnly !== true || value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Publisher delivery operator handoff must remain blocked, review-only, and side-effect-free.");
  if (!Array.isArray(value.actions) || value.actions.length !== 6) errors.push("Publisher delivery operator handoff must contain six ordered actions.");
  const actionIds = new Set<string>();
  for (const action of Array.isArray(value.actions) ? value.actions : []) {
    if (!isRecord(action)) { errors.push("Publisher delivery operator actions must be objects."); continue; }
    if (!isNonEmptyString(action.actionId) || actionIds.has(String(action.actionId))) errors.push("Publisher delivery operator action ids must be unique and non-empty.");
    actionIds.add(String(action.actionId));
    if (!Number.isSafeInteger(action.order) || Number(action.order) < 1) errors.push("Publisher delivery operator action order must be a positive integer.");
    for (const field of ["label", "evidence", "nextAction"] as const) if (!isNonEmptyString(action[field])) errors.push(`Publisher delivery operator action ${field} must be non-empty.`);
    if (!["complete", "current", "blocked", "not-started"].includes(String(action.status))) errors.push("Publisher delivery operator action status is unsupported.");
    if (!Array.isArray(action.protectedActions) || action.protectedActions.length === 0) errors.push("Publisher delivery operator action protectedActions must be non-empty.");
  }
  if (!Array.isArray(value.nextActionIds) || value.nextActionIds.length === 0 || value.nextActionIds.some((id) => typeof id !== "string" || !actionIds.has(id))) errors.push("Publisher delivery operator nextActionIds must reference known actions.");
  if (!Array.isArray(value.blockedActions) || value.blockedActions.length === 0) errors.push("Publisher delivery operator blockedActions must be non-empty.");
  for (const field of ["packageAssemblyAllowed", "releaseWriteAllowed", "qrPrintAllowed", "persistenceActivationAllowed", "studentFacingUseAllowed"] as const) if (value[field] !== false) errors.push(`${field} must remain false.`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
