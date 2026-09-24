import type { BrowserPrivacyTenantEvidenceReleaseBinding } from "./browserPrivacyTenantEvidenceReleaseBinding";
import type { PilotReviewDecision } from "./pilotReviewDecision";
import type { PersistenceProviderSelectionPreflight } from "./persistenceProviderSelectionPreflight";
import type { WhiteLabelReleaseReadiness } from "./whiteLabelReleaseReadiness";

export type ControlledPilotApprovalReadinessStatus =
  | "blocked-by-composite-evidence"
  | "blocked-by-release-control"
  | "blocked-by-reviewer-gate"
  | "ready-for-human-review";

export interface ControlledPilotReviewerGateEvidence {
  gateId: string;
  tenantId: string;
  identityReady: boolean;
  signaturePolicyReady: boolean;
  approvalCaptureReady: boolean;
  blockedActions: string[];
}

export interface ControlledPilotApprovalReadiness {
  recordVersion: 1;
  readinessId: string;
  releaseBindingId: string;
  pilotDecisionId: string;
  reviewerGateId: string;
  storageSelectionPreflightId: string;
  storageSelectionGateId: string;
  storageSelectionStatus: "blocked";
  storageSelectionAllowed: false;
  tenantId: string;
  packageId: string;
  status: ControlledPilotApprovalReadinessStatus;
  mode: "review-only";
  approvalCaptureAllowed: false;
  releaseMutationAllowed: false;
  studentLaunchAllowed: false;
  blockingReasons: string[];
  requiredHumanRecords: string[];
  nextGate: string;
}

export interface ControlledPilotApprovalReadinessInputs {
  readiness: Pick<WhiteLabelReleaseReadiness, "readinessId" | "tenantId" | "packageId" | "releaseControlEvidence">;
  releaseBinding: Pick<BrowserPrivacyTenantEvidenceReleaseBinding, "bindingId" | "tenantId" | "packageId" | "storageSelectionPreflightId" | "storageSelectionGateId" | "storageSelectionStatus" | "storageSelectionAllowed" | "status">;
  pilotDecision: Pick<PilotReviewDecision, "decisionId" | "tenantId" | "packageId" | "storageSelectionPreflightId" | "storageSelectionGateId" | "storageSelectionStatus" | "storageSelectionAllowed" | "status">;
  reviewerGate: ControlledPilotReviewerGateEvidence;
  storageSelection: Pick<PersistenceProviderSelectionPreflight, "preflightId" | "evidenceStorageGateId" | "tenantId" | "packageId" | "status">;
}

export function createControlledPilotApprovalReadiness(
  inputs: ControlledPilotApprovalReadinessInputs,
): ControlledPilotApprovalReadiness {
  const blockingReasons: string[] = [];
  const control = inputs.readiness.releaseControlEvidence;
  const scopeMismatch = inputs.releaseBinding.tenantId !== inputs.readiness.tenantId
    || inputs.releaseBinding.packageId !== inputs.readiness.packageId
    || inputs.pilotDecision.tenantId !== inputs.readiness.tenantId
    || inputs.pilotDecision.packageId !== inputs.readiness.packageId
    || inputs.reviewerGate.tenantId !== inputs.readiness.tenantId
    || inputs.storageSelection.tenantId !== inputs.readiness.tenantId
    || inputs.storageSelection.packageId !== inputs.readiness.packageId
    || inputs.releaseBinding.storageSelectionPreflightId !== inputs.storageSelection.preflightId
    || inputs.releaseBinding.storageSelectionGateId !== inputs.storageSelection.evidenceStorageGateId
    || inputs.pilotDecision.storageSelectionPreflightId !== inputs.storageSelection.preflightId
    || inputs.pilotDecision.storageSelectionGateId !== inputs.storageSelection.evidenceStorageGateId;

  if (inputs.releaseBinding.tenantId !== inputs.readiness.tenantId || inputs.releaseBinding.packageId !== inputs.readiness.packageId) {
    blockingReasons.push("Composite evidence release binding scope does not match readiness scope.");
  }
  if (inputs.pilotDecision.tenantId !== inputs.readiness.tenantId || inputs.pilotDecision.packageId !== inputs.readiness.packageId) {
    blockingReasons.push("Canonical pilot decision scope does not match readiness scope.");
  }
  if (inputs.reviewerGate.tenantId !== inputs.readiness.tenantId) {
    blockingReasons.push("Reviewer gate tenant scope does not match readiness scope.");
  }
  if (inputs.storageSelection.tenantId !== inputs.readiness.tenantId || inputs.storageSelection.packageId !== inputs.readiness.packageId) {
    blockingReasons.push("Storage selection review scope does not match readiness scope.");
  }
  if (inputs.releaseBinding.storageSelectionPreflightId !== inputs.storageSelection.preflightId || inputs.releaseBinding.storageSelectionGateId !== inputs.storageSelection.evidenceStorageGateId) {
    blockingReasons.push("Composite evidence release binding storage identity does not match the storage selection review.");
  }
  if (inputs.pilotDecision.storageSelectionPreflightId !== inputs.storageSelection.preflightId || inputs.pilotDecision.storageSelectionGateId !== inputs.storageSelection.evidenceStorageGateId) {
    blockingReasons.push("Canonical pilot decision storage identity does not match the storage selection review.");
  }
  if (inputs.releaseBinding.storageSelectionStatus !== "blocked" || inputs.releaseBinding.storageSelectionAllowed !== false) {
    blockingReasons.push("Composite evidence release binding storage selection is not safely blocked.");
  }
  if (inputs.pilotDecision.storageSelectionStatus !== "blocked" || inputs.pilotDecision.storageSelectionAllowed !== false) {
    blockingReasons.push("Canonical pilot decision storage selection is not safely blocked.");
  }
  if (inputs.storageSelection.status !== "blocked") {
    blockingReasons.push(`Storage selection review remains ${inputs.storageSelection.status}.`);
  }
  if (inputs.releaseBinding.status !== "accepted-for-release-review") {
    blockingReasons.push(`Composite evidence release binding remains ${inputs.releaseBinding.status}.`);
  }
  if (inputs.pilotDecision.status !== "pilot-ready") {
    blockingReasons.push(`Canonical pilot decision remains ${inputs.pilotDecision.status}.`);
  }
  if (control.status !== "pilot-ready" || control.blockingGateCount > 0 || control.openApprovalCount > 0) {
    blockingReasons.push(
      `Release control remains ${control.status} with ${control.blockingGateCount} open gate(s) and ${control.openApprovalCount} open approval(s).`,
    );
  }
  if (!inputs.reviewerGate.identityReady) blockingReasons.push("Authenticated reviewer identity is not ready.");
  if (!inputs.reviewerGate.signaturePolicyReady) blockingReasons.push("Tenant signature policy is not ready.");
  if (!inputs.reviewerGate.approvalCaptureReady) blockingReasons.push("Approval capture is not ready for implementation.");
  blockingReasons.push(...inputs.reviewerGate.blockedActions.map((action) => `${action} remains blocked.`));

  const status: ControlledPilotApprovalReadinessStatus =
    inputs.releaseBinding.status !== "accepted-for-release-review"
      ? "blocked-by-composite-evidence"
      : scopeMismatch || inputs.storageSelection.status !== "blocked" || control.status !== "pilot-ready" || control.blockingGateCount > 0 || control.openApprovalCount > 0 || inputs.pilotDecision.status !== "pilot-ready"
        ? "blocked-by-release-control"
        : !inputs.reviewerGate.identityReady || !inputs.reviewerGate.signaturePolicyReady || !inputs.reviewerGate.approvalCaptureReady
          ? "blocked-by-reviewer-gate"
          : "ready-for-human-review";

  return {
    recordVersion: 1,
    readinessId: inputs.readiness.readinessId,
    releaseBindingId: inputs.releaseBinding.bindingId,
    pilotDecisionId: inputs.pilotDecision.decisionId,
    reviewerGateId: inputs.reviewerGate.gateId,
    storageSelectionPreflightId: inputs.storageSelection.preflightId,
    storageSelectionGateId: inputs.storageSelection.evidenceStorageGateId,
    storageSelectionStatus: "blocked",
    storageSelectionAllowed: false,
    tenantId: inputs.readiness.tenantId,
    packageId: inputs.readiness.packageId,
    status,
    mode: "review-only",
    approvalCaptureAllowed: false,
    releaseMutationAllowed: false,
    studentLaunchAllowed: false,
    blockingReasons: [...new Set(blockingReasons)],
    requiredHumanRecords: [
      "authenticated reviewer identity record",
      "tenant role and approval scope record",
      "evidence packet version record",
      "package version and release candidate record",
      "retention, revocation, and audit policy record",
      "storage provider selection and school policy record",
    ],
    nextGate: status === "ready-for-human-review"
      ? "A separately authorized human approval workflow may be designed after release, storage, and school policy acceptance."
      : "Resolve the listed evidence, release-control, and reviewer-gate blockers before human approval review.",
  };
}

export function validateControlledPilotApprovalReadiness(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Controlled pilot approval readiness must be a JSON object."];
  if (value.recordVersion !== 1) errors.push("Controlled pilot approval readiness recordVersion must be 1.");
  for (const field of ["readinessId", "releaseBindingId", "pilotDecisionId", "reviewerGateId", "storageSelectionPreflightId", "storageSelectionGateId", "tenantId", "packageId", "nextGate"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Controlled pilot approval readiness ${field} must be non-empty.`);
  }
  if (!["blocked-by-composite-evidence", "blocked-by-release-control", "blocked-by-reviewer-gate", "ready-for-human-review"].includes(readString(value, "status"))) {
    errors.push("Controlled pilot approval readiness status is unsupported.");
  }
  if (readString(value, "mode") !== "review-only") errors.push("Controlled pilot approval readiness must remain review-only.");
  if (readString(value, "storageSelectionStatus") !== "blocked") errors.push("Controlled pilot approval readiness storage selection must remain blocked.");
  if (value.storageSelectionAllowed !== false) errors.push("Controlled pilot approval readiness storage selection must remain false.");
  for (const field of ["approvalCaptureAllowed", "releaseMutationAllowed", "studentLaunchAllowed"] as const) {
    if (value[field] !== false) errors.push(`Controlled pilot approval readiness ${field} must remain false.`);
  }
  const blockers = readStringArray(value, "blockingReasons");
  if (blockers.length === 0 && readString(value, "status") !== "ready-for-human-review") errors.push("Controlled pilot approval readiness must list blocking reasons while blocked.");
  if (blockers.length > 0 && readString(value, "status") === "ready-for-human-review") errors.push("Ready-for-human-review readiness cannot retain blocking reasons.");
  if (new Set(blockers).size !== blockers.length) errors.push("Controlled pilot approval readiness blockers must be unique.");
  const records = readStringArray(value, "requiredHumanRecords");
  if (records.length === 0) errors.push("Controlled pilot approval readiness must list required human records.");
  if (new Set(records).size !== records.length) errors.push("Controlled pilot approval readiness required human records must be unique.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: Record<string, unknown>, key: string): string {
  return typeof value[key] === "string" ? value[key].trim() : "";
}

function readStringArray(value: Record<string, unknown>, key: string): string[] {
  return Array.isArray(value[key]) ? value[key].filter((item): item is string => isNonEmptyString(item)).map((item) => item.trim()) : [];
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
