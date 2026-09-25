import type { ControlledPilotHumanReviewAdjudication } from "./controlledPilotHumanReviewAdjudication";

export type ControlledPilotHumanReviewNextGateHandoffStatus = "blocked" | "ready-for-next-gate";

export interface ControlledPilotHumanReviewNextGateHandoff {
  recordVersion: 1;
  handoffId: string;
  adjudicationId: string;
  decisionSnapshotBindingId: string;
  releaseReviewBindingId: string;
  packetId: string;
  readinessId: string;
  tenantId: string;
  packageId: string;
  reviewerRef: string;
  recipientRole: "publisher-admin" | "school-admin";
  status: ControlledPilotHumanReviewNextGateHandoffStatus;
  sourceDecision: ControlledPilotHumanReviewAdjudication["decision"];
  evidenceReferences: string[];
  blockingReasons: string[];
  requiredNextRecords: string[];
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

export function createControlledPilotHumanReviewNextGateHandoff(
  adjudication: ControlledPilotHumanReviewAdjudication,
  input: {
    recipientRole: "publisher-admin" | "school-admin";
  },
): ControlledPilotHumanReviewNextGateHandoff {
  const ready = adjudication.status === "accepted-for-next-gate" && adjudication.blockingReasons.length === 0;
  const status: ControlledPilotHumanReviewNextGateHandoffStatus = ready ? "ready-for-next-gate" : "blocked";
  const blockingReasons = ready
    ? []
    : adjudication.blockingReasons.length > 0
      ? [...adjudication.blockingReasons]
      : ["Human-review adjudication did not accept the evidence for the next gate."];

  const handoff: ControlledPilotHumanReviewNextGateHandoff = {
    recordVersion: 1,
    handoffId: `controlled-pilot-human-review-next-gate-handoff-v1:${adjudication.adjudicationId}:${input.recipientRole}`,
    adjudicationId: adjudication.adjudicationId,
    decisionSnapshotBindingId: adjudication.decisionSnapshotBindingId,
    releaseReviewBindingId: adjudication.releaseReviewBindingId,
    packetId: adjudication.packetId,
    readinessId: adjudication.readinessId,
    tenantId: adjudication.tenantId,
    packageId: adjudication.packageId,
    reviewerRef: adjudication.reviewerRef,
    recipientRole: input.recipientRole,
    status,
    sourceDecision: adjudication.decision,
    evidenceReferences: [
      adjudication.adjudicationId,
      adjudication.decisionSnapshotBindingId,
      adjudication.releaseReviewBindingId,
      adjudication.packetId,
      adjudication.readinessId,
    ],
    blockingReasons,
    requiredNextRecords: ready
      ? ["Separately authorized approval-design review record", "Named approval scope and revocation record"]
      : ["Resolved controlled-pilot evidence adjudication"],
    nextGate: ready
      ? [
          "Open a separately authorized approval-design review; this handoff is not approval.",
          "Reconfirm tenant, package, storage, and reviewer identity before any future approval design.",
        ]
      : ["Resolve the adjudication blockers before this handoff can advance to another review gate."],
    approvalCaptureAllowed: false,
    releaseMutationAllowed: false,
    persistenceWriteAllowed: false,
    packagePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };

  const errors = validateControlledPilotHumanReviewNextGateHandoff(handoff, adjudication);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return handoff;
}

export function validateControlledPilotHumanReviewNextGateHandoff(
  value: unknown,
  adjudication?: Pick<ControlledPilotHumanReviewAdjudication, "adjudicationId" | "decisionSnapshotBindingId" | "releaseReviewBindingId" | "packetId" | "readinessId" | "tenantId" | "packageId" | "reviewerRef" | "decision" | "status" | "blockingReasons">,
): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Controlled-pilot next-gate handoff must be an object."];
  if (value.recordVersion !== 1) errors.push("Controlled-pilot next-gate handoff recordVersion must be 1.");
  for (const field of [
    "handoffId",
    "adjudicationId",
    "decisionSnapshotBindingId",
    "releaseReviewBindingId",
    "packetId",
    "readinessId",
    "tenantId",
    "packageId",
    "reviewerRef",
  ] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Controlled-pilot next-gate handoff ${field} must be non-empty.`);
  }
  if (value.recipientRole !== "publisher-admin" && value.recipientRole !== "school-admin") errors.push("Controlled-pilot next-gate handoff recipientRole is unsupported.");
  if (value.status !== "blocked" && value.status !== "ready-for-next-gate") errors.push("Controlled-pilot next-gate handoff status is unsupported.");
  if (value.sourceDecision !== "blocked" && value.sourceDecision !== "accepted-for-next-gate") errors.push("Controlled-pilot next-gate handoff sourceDecision is unsupported.");
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Controlled-pilot next-gate handoff must remain review-only with no side effect.");
  for (const field of ["approvalCaptureAllowed", "releaseMutationAllowed", "persistenceWriteAllowed", "packagePromotionAllowed", "studentProductionLaunchAllowed"] as const) {
    if (value[field] !== false) errors.push(`Controlled-pilot next-gate handoff ${field} must remain false.`);
  }

  for (const field of ["evidenceReferences", "blockingReasons", "requiredNextRecords", "nextGate"] as const) {
    const items = readStringArray(value, field);
    if (items.length === 0 && !(field === "blockingReasons" && value.status === "ready-for-next-gate")) errors.push(`Controlled-pilot next-gate handoff ${field} must not be empty.`);
    if (new Set(items).size !== items.length) errors.push(`Controlled-pilot next-gate handoff ${field} must be unique.`);
  }
  for (const field of ["adjudicationId", "decisionSnapshotBindingId", "releaseReviewBindingId", "packetId", "readinessId"] as const) {
    if (!readStringArray(value, "evidenceReferences").includes(String(value[field] ?? ""))) errors.push(`Controlled-pilot next-gate handoff evidence must include ${field}.`);
  }
  if (value.status === "ready-for-next-gate" && (value.sourceDecision !== "accepted-for-next-gate" || readStringArray(value, "blockingReasons").length > 0)) {
    errors.push("Ready-for-next-gate handoff requires an accepted adjudication with no blockers.");
  }
  if (value.status === "blocked" && readStringArray(value, "blockingReasons").length === 0) errors.push("Blocked next-gate handoff must retain blocking reasons.");

  if (adjudication) {
    for (const field of ["adjudicationId", "decisionSnapshotBindingId", "releaseReviewBindingId", "packetId", "readinessId", "tenantId", "packageId", "reviewerRef", "decision"] as const) {
      if (value[field] !== adjudication[field]) errors.push(`Controlled-pilot next-gate handoff must preserve adjudication ${field}.`);
    }
    const expectedStatus = adjudication.status === "accepted-for-next-gate" && adjudication.blockingReasons.length === 0 ? "ready-for-next-gate" : "blocked";
    if (value.status !== expectedStatus) errors.push("Controlled-pilot next-gate handoff status must be derived from the adjudication.");
    if (expectedStatus === "blocked" && !readStringArray(value, "blockingReasons").some((reason) => adjudication.blockingReasons.includes(reason))) errors.push("Blocked next-gate handoff must retain an adjudication blocker.");
  }
  return [...new Set(errors)];
}

export const CONTROLLED_PILOT_HUMAN_REVIEW_NEXT_GATE_HANDOFF_BLOCKED_ACTIONS = BLOCKED_ACTIONS;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function readStringArray(value: Record<string, unknown>, key: string): string[] {
  return Array.isArray(value[key]) ? value[key].filter(isNonEmptyString).map((item) => item.trim()) : [];
}
