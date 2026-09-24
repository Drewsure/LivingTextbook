import {
  validateLocalBundleProviderApprovalPacket,
  type LocalBundleProviderApprovalPacket,
} from "./localBundleProviderApproval";
import {
  validateLocalBundleRecoveryPacket,
  type LocalBundleRecoveryPacket,
} from "./localBundleRecoveryPacket";

export type LocalBundleRecoveryReconciliationStatus = "aligned" | "needs-evidence" | "mismatch";

export interface LocalBundleRecoveryReconciliation {
  approvalId: string;
  recoveryPacketId: string;
  tenantId: string;
  bundleId: string;
  packageId: string;
  status: LocalBundleRecoveryReconciliationStatus;
  identityMatches: boolean;
  approvalErrors: string[];
  recoveryErrors: string[];
  openApprovalChecks: string[];
  openRecoveryLanes: string[];
  blockedActions: string[];
  executionAllowed: false;
  sideEffect: "none";
  reasons: string[];
}

const REQUIRED_BLOCKED_ACTIONS = [
  "provider-activation",
  "backup-execution",
  "restore-execution",
  "export-execution",
  "package-write",
  "student-promotion",
  "route-mutation",
] as const;

export function reconcileLocalBundleRecoveryEvidence(
  approval: LocalBundleProviderApprovalPacket,
  recovery: LocalBundleRecoveryPacket,
): LocalBundleRecoveryReconciliation {
  const approvalErrors = validateLocalBundleProviderApprovalPacket(approval);
  const recoveryErrors = validateLocalBundleRecoveryPacket(recovery);
  const identityMatches = ["tenantId", "bundleId", "packageId", "storageSelectionPreflightId", "storageSelectionGateId"] .every(
    (field) => approval[field as keyof typeof approval] === recovery[field as keyof typeof recovery],
  );
  const openApprovalChecks = approval.checks.filter((check) => check.status !== "passed").map((check) => check.checkId);
  const openRecoveryLanes = (["backup", "restore", "export", "retention"] as const).filter(
    (lane) => recovery[lane].status !== "passed",
  );
  const blockedActions = [...new Set([
    ...approval.blockedActions,
    ...recovery.blockedActions,
    ...REQUIRED_BLOCKED_ACTIONS,
  ])];
  const reasons = [
    ...approvalErrors,
    ...recoveryErrors,
    ...(identityMatches ? [] : ["Provider approval and recovery packet storage and package identities must match." ]),
    ...(openApprovalChecks.length > 0 ? [`Provider approval evidence remains open: ${openApprovalChecks.join(", ")}.`] : []),
    ...(openRecoveryLanes.length > 0 ? [`Recovery evidence remains open or blocked: ${openRecoveryLanes.join(", ")}.`] : []),
    "Provider activation, recovery execution, package writes, student promotion, and route mutation remain blocked.",
  ];
  const hasMismatch = approvalErrors.length > 0 || recoveryErrors.length > 0 || !identityMatches;
  const status = hasMismatch ? "mismatch" : openApprovalChecks.length > 0 || openRecoveryLanes.length > 0 ? "needs-evidence" : "aligned";

  return {
    approvalId: approval.approvalId,
    recoveryPacketId: recovery.packetId,
    tenantId: recovery.tenantId,
    bundleId: recovery.bundleId,
    packageId: recovery.packageId,
    status,
    identityMatches,
    approvalErrors,
    recoveryErrors,
    openApprovalChecks,
    openRecoveryLanes,
    blockedActions,
    executionAllowed: false,
    sideEffect: "none",
    reasons: [...new Set(reasons)],
  };
}
