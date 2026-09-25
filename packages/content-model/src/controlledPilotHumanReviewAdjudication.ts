import type { AssistLanguageAudioCatalogReleaseDecisionSnapshotBinding } from "./assistLanguageAudioCatalogReleaseDecisionSnapshotBinding";
import type { AssistLanguageAudioCatalogReleaseReviewBinding } from "./assistLanguageAudioCatalogReleaseReviewBinding";
import type { ControlledPilotHumanReviewPacket } from "./controlledPilotHumanReviewPacket";

export type ControlledPilotHumanReviewAdjudicationDecision = "blocked" | "accepted-for-next-gate";
export type ControlledPilotHumanReviewAdjudicationStatus = "blocked-by-evidence" | "accepted-for-next-gate";
export type ControlledPilotHumanReviewAdjudicationReviewerRole = "teacher" | "publisher-admin" | "school-admin";

export interface ControlledPilotHumanReviewAdjudication {
  recordVersion: 1;
  adjudicationId: string;
  decisionSnapshotBindingId: string;
  releaseReviewBindingId: string;
  packetId: string;
  snapshotId: string;
  decisionId: string;
  readinessId: string;
  tenantId: string;
  packageId: string;
  reviewerRole: ControlledPilotHumanReviewAdjudicationReviewerRole;
  reviewerRef: string;
  decision: ControlledPilotHumanReviewAdjudicationDecision;
  status: ControlledPilotHumanReviewAdjudicationStatus;
  reviewerNote: string;
  recordedAt: string;
  blockingReasons: string[];
  blockedActions: string[];
  nextGate: string[];
  approvalCaptureAllowed: false;
  releaseMutationAllowed: false;
  persistenceWriteAllowed: false;
  packagePromotionAllowed: false;
  studentProductionLaunchAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

const BLOCKED_ACTIONS = [
  "No approval capture",
  "No release mutation",
  "No persistence write",
  "No package promotion",
  "No student production launch",
] as const;

export function createReviewOnlyControlledPilotHumanReviewAdjudication(
  decisionSnapshotBinding: Pick<AssistLanguageAudioCatalogReleaseDecisionSnapshotBinding, "bindingId" | "snapshotId" | "decisionId" | "releaseReadinessId" | "tenantId" | "packageId" | "status" | "scopeDrift">,
  releaseReviewBinding: Pick<AssistLanguageAudioCatalogReleaseReviewBinding, "bindingId" | "tenantId" | "packageId" | "status" | "scopeDrift">,
  packet: Pick<ControlledPilotHumanReviewPacket, "packetId" | "readinessId" | "tenantId" | "packageId" | "status">,
  input: {
    reviewerRole: ControlledPilotHumanReviewAdjudicationReviewerRole;
    reviewerRef: string;
    decision: ControlledPilotHumanReviewAdjudicationDecision;
    reviewerNote: string;
    recordedAt: string;
  },
): ControlledPilotHumanReviewAdjudication {
  const sourceBlockers = [
    ...decisionSnapshotBinding.scopeDrift,
    ...releaseReviewBinding.scopeDrift,
    ...(decisionSnapshotBinding.status === "linked-review-only" ? [] : ["Decision snapshot remains blocked-preview."]),
    ...(releaseReviewBinding.status === "review-ready-after-evidence" ? [] : [`Release review remains ${releaseReviewBinding.status}.`]),
    ...(packet.status === "awaiting-human-review" ? [] : [`Human review packet remains ${packet.status}.`]),
  ];
  const canAccept = sourceBlockers.length === 0;
  const blockingReasons = input.decision === "accepted-for-next-gate" && !canAccept
    ? ["Accepted-for-next-gate cannot be recorded while upstream evidence remains blocked.", ...sourceBlockers]
    : [...sourceBlockers];
  const status: ControlledPilotHumanReviewAdjudicationStatus = input.decision === "accepted-for-next-gate" && canAccept
    ? "accepted-for-next-gate"
    : "blocked-by-evidence";

  const adjudication: ControlledPilotHumanReviewAdjudication = {
    recordVersion: 1,
    adjudicationId: `controlled-pilot-human-review-adjudication-v1:${decisionSnapshotBinding.bindingId}:${input.recordedAt}`,
    decisionSnapshotBindingId: decisionSnapshotBinding.bindingId,
    releaseReviewBindingId: releaseReviewBinding.bindingId,
    packetId: packet.packetId,
    snapshotId: decisionSnapshotBinding.snapshotId,
    decisionId: decisionSnapshotBinding.decisionId,
    readinessId: decisionSnapshotBinding.releaseReadinessId,
    tenantId: decisionSnapshotBinding.tenantId,
    packageId: decisionSnapshotBinding.packageId,
    reviewerRole: input.reviewerRole,
    reviewerRef: input.reviewerRef,
    decision: input.decision,
    status,
    reviewerNote: input.reviewerNote,
    recordedAt: input.recordedAt,
    blockingReasons: [...new Set(blockingReasons)],
    blockedActions: [...BLOCKED_ACTIONS],
    nextGate: status === "accepted-for-next-gate"
      ? ["Proceed to a separately authorized approval-design review; do not activate production."]
      : ["Resolve upstream evidence blockers before human review can advance."],
    approvalCaptureAllowed: false,
    releaseMutationAllowed: false,
    persistenceWriteAllowed: false,
    packagePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };

  const errors = validateControlledPilotHumanReviewAdjudication(adjudication, decisionSnapshotBinding, releaseReviewBinding, packet);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return adjudication;
}

export function validateControlledPilotHumanReviewAdjudication(
  value: unknown,
  decisionSnapshotBinding?: Pick<AssistLanguageAudioCatalogReleaseDecisionSnapshotBinding, "bindingId" | "snapshotId" | "decisionId" | "releaseReadinessId" | "tenantId" | "packageId" | "status" | "scopeDrift">,
  releaseReviewBinding?: Pick<AssistLanguageAudioCatalogReleaseReviewBinding, "bindingId" | "tenantId" | "packageId" | "status" | "scopeDrift">,
  packet?: Pick<ControlledPilotHumanReviewPacket, "packetId" | "readinessId" | "tenantId" | "packageId" | "status">,
): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Controlled-pilot human-review adjudication must be an object."];
  if (value.recordVersion !== 1) errors.push("Controlled-pilot human-review adjudication recordVersion must be 1.");
  for (const field of ["adjudicationId", "decisionSnapshotBindingId", "releaseReviewBindingId", "packetId", "snapshotId", "decisionId", "readinessId", "tenantId", "packageId", "reviewerRef", "reviewerNote", "recordedAt"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Controlled-pilot human-review adjudication ${field} must be non-empty.`);
  }
  if (value.reviewerRole !== "teacher" && value.reviewerRole !== "publisher-admin" && value.reviewerRole !== "school-admin") errors.push("Controlled-pilot human-review adjudication reviewerRole is unsupported.");
  if (value.decision !== "blocked" && value.decision !== "accepted-for-next-gate") errors.push("Controlled-pilot human-review adjudication decision is unsupported.");
  if (value.status !== "blocked-by-evidence" && value.status !== "accepted-for-next-gate") errors.push("Controlled-pilot human-review adjudication status is unsupported.");
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Controlled-pilot human-review adjudication must remain review-only with no side effect.");
  if (Number.isNaN(Date.parse(String(value.recordedAt ?? "")))) errors.push("Controlled-pilot human-review adjudication recordedAt must be a valid timestamp.");
  for (const field of ["approvalCaptureAllowed", "releaseMutationAllowed", "persistenceWriteAllowed", "packagePromotionAllowed", "studentProductionLaunchAllowed"] as const) {
    if (value[field] !== false) errors.push(`Controlled-pilot human-review adjudication ${field} must remain false.`);
  }
  for (const field of ["blockingReasons", "blockedActions", "nextGate"] as const) {
    const items = readStringArray(value, field);
    if (items.length === 0 && !(field === "blockingReasons" && value.status === "accepted-for-next-gate")) errors.push(`Controlled-pilot human-review adjudication ${field} must not be empty.`);
    if (new Set(items).size !== items.length) errors.push(`Controlled-pilot human-review adjudication ${field} must be unique.`);
  }
  if (value.status === "accepted-for-next-gate" && value.decision !== "accepted-for-next-gate") errors.push("Accepted human-review adjudication must preserve its decision.");
  if (value.status === "accepted-for-next-gate" && readStringArray(value, "blockingReasons").length > 0) errors.push("Accepted human-review adjudication cannot retain blocking reasons.");
  for (const action of BLOCKED_ACTIONS) if (!readStringArray(value, "blockedActions").includes(action)) errors.push(`Human-review adjudication must block: ${action}.`);

  if (decisionSnapshotBinding) {
    if (value.decisionSnapshotBindingId !== decisionSnapshotBinding.bindingId) errors.push("Human-review adjudication must preserve decision snapshot binding identity.");
    if (value.snapshotId !== decisionSnapshotBinding.snapshotId || value.decisionId !== decisionSnapshotBinding.decisionId) errors.push("Human-review adjudication must preserve decision snapshot identity.");
    if (value.readinessId !== decisionSnapshotBinding.releaseReadinessId) errors.push("Human-review adjudication must preserve release readiness identity.");
    if (value.tenantId !== decisionSnapshotBinding.tenantId || value.packageId !== decisionSnapshotBinding.packageId) errors.push("Human-review adjudication cannot cross decision snapshot scope.");
  }
  if (releaseReviewBinding) {
    if (value.releaseReviewBindingId !== releaseReviewBinding.bindingId) errors.push("Human-review adjudication must preserve release-review binding identity.");
    if (value.tenantId !== releaseReviewBinding.tenantId || value.packageId !== releaseReviewBinding.packageId) errors.push("Human-review adjudication cannot cross release-review scope.");
  }
  if (packet) {
    if (value.packetId !== packet.packetId || value.readinessId !== packet.readinessId) errors.push("Human-review adjudication must preserve packet identity.");
    if (value.tenantId !== packet.tenantId || value.packageId !== packet.packageId) errors.push("Human-review adjudication cannot cross packet scope.");
  }
  if (value.status === "accepted-for-next-gate") {
    if (decisionSnapshotBinding?.status !== "linked-review-only") errors.push("Accepted human-review adjudication requires a linked decision snapshot.");
    if (releaseReviewBinding?.status !== "review-ready-after-evidence") errors.push("Accepted human-review adjudication requires release-review readiness.");
    if (packet?.status !== "awaiting-human-review") errors.push("Accepted human-review adjudication requires an awaiting human-review packet.");
    if (decisionSnapshotBinding?.scopeDrift.length || releaseReviewBinding?.scopeDrift.length) errors.push("Accepted human-review adjudication cannot use scope-drifted evidence.");
  }
  return [...new Set(errors)];
}

export const CONTROLLED_PILOT_HUMAN_REVIEW_ADJUDICATION_BLOCKED_ACTIONS = BLOCKED_ACTIONS;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function readStringArray(value: Record<string, unknown>, key: string): string[] {
  return Array.isArray(value[key]) ? value[key].filter(isNonEmptyString).map((item) => item.trim()) : [];
}
