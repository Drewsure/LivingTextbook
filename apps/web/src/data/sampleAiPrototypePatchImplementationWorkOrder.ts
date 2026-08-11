import { sampleAiPrototypePatchAuthorizationReleaseLocks } from "@/data/sampleAiPrototypePatchAuthorizationReleaseLock";

export type AiPrototypePatchImplementationWorkOrderStatus =
  | "blocked"
  | "review-only"
  | "ready-for-work-order-review";

export interface AiPrototypePatchImplementationWorkOrder {
  workOrderId: string;
  tenantId: string;
  requestId: string;
  lockId: string;
  label: string;
  status: AiPrototypePatchImplementationWorkOrderStatus;
  summary: string;
  requiredBeforeWork: string[];
  allowedFutureFileGroups: string[];
  dryRunVerificationOrder: string[];
  rollbackPlan: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const sampleAiPrototypePatchImplementationWorkOrders: AiPrototypePatchImplementationWorkOrder[] =
  sampleAiPrototypePatchAuthorizationReleaseLocks.map((lock) => {
    const isMiniStar = lock.tenantId === "ministar";

    return {
      workOrderId: `ai-prototype-patch-implementation-work-order-${lock.requestId}`,
      tenantId: lock.tenantId,
      requestId: lock.requestId,
      lockId: lock.lockId,
      label: isMiniStar
        ? "MiniStar patch implementation work order"
        : "Patch implementation work order",
      status: "blocked",
      summary: isMiniStar
        ? "MiniStar patch work remains blocked. This work order names future file groups, dry-run checks, rollback proof, and hiragana support-only boundaries before any code work can start."
        : "Patch work remains blocked. This work order names future file groups, dry-run checks, rollback proof, and white-label boundaries before any code work can start.",
      requiredBeforeWork: [
        "Signed approval acceptance record",
        "Patch authorization release lock accepted",
        "Release-control binding accepted",
        "Accepted patch test evidence packet",
        "Accepted route safety release gate",
        "Accepted rollback drill record",
        "Accepted storage contract verification",
        "Reviewer identity signature accepted",
        ...(isMiniStar ? ["Foundation Japanese support boundary accepted"] : []),
      ],
      allowedFutureFileGroups: [
        "One removable wrapper adapter file",
        "One reviewed fixture mapping file",
        "One standard event replay test file",
        "One audio coverage assertion file",
        "One mobile accessibility smoke-check file",
        "One rollback map update",
      ],
      dryRunVerificationOrder: [
        "Confirm current branch and release-control state",
        "Confirm patch scope matches approval record",
        "Replay reviewed fixture input",
        "Replay standard progress events",
        "Verify target-language audio coverage",
        "Verify mobile layout and tap targets",
        "Verify deterministic scoring only",
        "Verify rollback map before any commit",
        ...(isMiniStar ? ["Verify English remains the only progress trigger"] : []),
      ],
      rollbackPlan: [
        "Pre-write snapshot required",
        "Patch scope checksum required",
        "Route registry unchanged unless explicitly authorized",
        "Audio manifest unchanged unless explicitly authorized",
        "Rollback command rehearsal required",
        "Post-rollback route smoke required",
        "Decision register entry required",
      ],
      blockedActions: [
        "No work order execution",
        "No app file write",
        "No app patch generation",
        "No test execution",
        "No Playwright run",
        "No route mutation",
        "No student-facing route",
        "No scoring or reward mutation",
        "No audio manifest mutation",
        "No package promotion",
        "No assignment",
        "No support-language progress trigger",
      ],
      nextRequiredRecords: [
        "Patch implementation work order storage contract",
        "Signed approval acceptance record",
        "Release-control binding acceptance",
        "Accepted patch test evidence packet",
        "Accepted route safety release gate",
        "Accepted rollback drill record",
      ],
    };
  });

export function filterAiPrototypePatchImplementationWorkOrdersByTenant(
  workOrders: AiPrototypePatchImplementationWorkOrder[],
  tenantId: string,
): AiPrototypePatchImplementationWorkOrder[] {
  return workOrders.filter((workOrder) => workOrder.tenantId === tenantId);
}
