import type { LocalBundleMediaManifestReconciliation } from "./localBundleMediaManifestReconciliation";

export type LocalBundleMediaReleaseControlDecision = "blocked" | "needs-review" | "evidence-ready";

export interface LocalBundleMediaReleaseControlBinding {
  bindingId: string;
  reconciliationId: string;
  releaseGateId: string;
  tenantId: string;
  packageId: string;
  packageVersion: string;
  storageSelectionPreflightId: string;
  storageSelectionGateId: string;
  storageSelectionMatches: boolean;
  unitScopeMatches: boolean;
  decision: LocalBundleMediaReleaseControlDecision;
  reconciliationStatus: LocalBundleMediaManifestReconciliation["status"];
  releaseGateMediaStatus: "ready" | "needs-review" | "blocked" | "missing";
  releaseBlockingReasons: string[];
  requiredApprovals: string[];
  blockedActions: string[];
  promotionAllowed: false;
  studentFacingAllowed: false;
  localActivationAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

const REQUIRED_BLOCKED_ACTIONS = [
  "media-release",
  "package-publish",
  "package-write",
  "local-activation",
  "student-promotion",
  "qr-mutation",
] as const;

export function deriveLocalBundleMediaReleaseControlBinding(
  reconciliation: LocalBundleMediaManifestReconciliation,
  options: {
    releaseGateId: string;
    releaseGateTenantId: string;
    releaseGatePackageId: string;
    releaseGateMediaStatus: "ready" | "needs-review" | "blocked" | "missing";
    requiredApprovals: string[];
  },
): LocalBundleMediaReleaseControlBinding {
  const releaseBlockingReasons = [
    ...(reconciliation.status === "mismatch" ? reconciliation.mismatchChecks.map((check) => `Media reconciliation mismatch: ${check}.`) : []),
    ...(reconciliation.status === "needs-evidence" ? reconciliation.openEvidenceChecks.map((check) => `Media evidence open: ${check}.`) : []),
    ...(reconciliation.tenantId !== options.releaseGateTenantId ? ["Media evidence tenant does not match the release gate tenant."] : []),
    ...(reconciliation.packageId !== options.releaseGatePackageId ? ["Media evidence package does not match the release gate package."] : []),
    ...(!reconciliation.storageSelectionMatches ? ["Media evidence storage identity does not match the reviewed storage decision."] : []),
    ...(!reconciliation.unitScopeMatches ? ["Media evidence unit scope does not match the declared package scope."] : []),
    ...(options.releaseGateMediaStatus !== "ready" ? [`Release gate media status is ${options.releaseGateMediaStatus}.`] : []),
  ];
  const identityMatches = reconciliation.tenantId === options.releaseGateTenantId && reconciliation.packageId === options.releaseGatePackageId;
  const hasMismatch = reconciliation.status === "mismatch" || !identityMatches || !reconciliation.storageSelectionMatches || !reconciliation.unitScopeMatches;
  const hasOpenReview = reconciliation.status === "needs-evidence" || options.releaseGateMediaStatus !== "ready";
  const decision = hasMismatch ? "blocked" : hasOpenReview ? "needs-review" : "evidence-ready";

  return {
    bindingId: `${options.releaseGateId}:${reconciliation.bindingId}`,
    reconciliationId: reconciliation.reconciliationId,
    releaseGateId: options.releaseGateId,
    tenantId: options.releaseGateTenantId,
    packageId: options.releaseGatePackageId,
    packageVersion: reconciliation.packageVersion,
    storageSelectionPreflightId: reconciliation.storageSelectionPreflightId,
    storageSelectionGateId: reconciliation.storageSelectionGateId,
    storageSelectionMatches: reconciliation.storageSelectionMatches,
    unitScopeMatches: reconciliation.unitScopeMatches,
    decision,
    reconciliationStatus: reconciliation.status,
    releaseGateMediaStatus: options.releaseGateMediaStatus,
    releaseBlockingReasons: [...new Set(releaseBlockingReasons.length > 0 ? releaseBlockingReasons : ["Media evidence is ready for release-control review."])],
    requiredApprovals: [...new Set(options.requiredApprovals.map((approval) => approval.trim()).filter(Boolean))],
    blockedActions: [...new Set([...reconciliation.blockedActions, ...REQUIRED_BLOCKED_ACTIONS])],
    promotionAllowed: false,
    studentFacingAllowed: false,
    localActivationAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validateLocalBundleMediaReleaseControlBinding(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Local bundle media release-control binding must be a JSON object."];
  for (const field of ["bindingId", "reconciliationId", "releaseGateId", "tenantId", "packageId", "packageVersion", "storageSelectionPreflightId", "storageSelectionGateId"] as const) {
    if (!readString(value, field)) errors.push(`Local bundle media release-control binding requires ${field}.`);
  }
  if (typeof value.storageSelectionMatches !== "boolean") errors.push("Media release-control binding requires storage selection match state.");
  if (typeof value.unitScopeMatches !== "boolean") errors.push("Media release-control binding requires unit scope match state.");
  if (value.decision !== "blocked" && (value.storageSelectionMatches !== true || value.unitScopeMatches !== true)) errors.push("Media release-control binding must block a non-blocked decision when storage or unit scope identity is not aligned.");
  if (!(["blocked", "needs-review", "evidence-ready"] as string[]).includes(readString(value, "decision"))) errors.push("Media release-control binding requires a supported decision.");
  if (!(["aligned", "needs-evidence", "mismatch"] as string[]).includes(readString(value, "reconciliationStatus"))) errors.push("Media release-control binding requires reconciliation status.");
  if (!(["ready", "needs-review", "blocked", "missing"] as string[]).includes(readString(value, "releaseGateMediaStatus"))) errors.push("Media release-control binding requires release gate media status.");
  if (value.promotionAllowed !== false || value.studentFacingAllowed !== false || value.localActivationAllowed !== false) errors.push("Media release-control binding must keep promotion, student-facing use, and local activation false.");
  if (readString(value, "mode") !== "review-only" || readString(value, "sideEffect") !== "none") errors.push("Media release-control binding must remain review-only with no side effect.");
  if (readStringArray(value, "releaseBlockingReasons").length === 0) errors.push("Media release-control binding must expose release-blocking reasons.");
  if (readStringArray(value, "requiredApprovals").length === 0) errors.push("Media release-control binding must list required approvals.");
  const blockedActions = readStringArray(value, "blockedActions");
  for (const action of REQUIRED_BLOCKED_ACTIONS) if (!blockedActions.includes(action)) errors.push(`Media release-control binding must block ${action}.`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readString(source: Record<string, any>, key: string): string {
  return typeof source[key] === "string" ? source[key].trim() : "";
}
function readStringArray(source: Record<string, any>, key: string): string[] {
  return Array.isArray(source[key]) ? source[key].filter((value: unknown): value is string => typeof value === "string").map((value: string) => value.trim()).filter(Boolean) : [];
}
