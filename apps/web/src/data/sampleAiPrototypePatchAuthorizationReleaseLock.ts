import { sampleAiPrototypeSignedApprovalPreflights } from "@/data/sampleAiPrototypeSignedApprovalPreflight";
import {
  getAiPrototypePatchAuthorizationReleaseLockCollectionWarnings,
  validateAiPrototypePatchAuthorizationReleaseLocks,
  type AiPrototypePatchAuthorizationReleaseLock as SharedAiPrototypePatchAuthorizationReleaseLock,
  type AiPrototypePatchAuthorizationReleaseLockStatus,
} from "@living-textbook/content-model/src/aiPrototypePatchAuthorizationReleaseLock";

export type AiPrototypePatchAuthorizationReleaseLock = SharedAiPrototypePatchAuthorizationReleaseLock;
export type { AiPrototypePatchAuthorizationReleaseLockStatus };

export const sampleAiPrototypePatchAuthorizationReleaseLocks: AiPrototypePatchAuthorizationReleaseLock[] =
  sampleAiPrototypeSignedApprovalPreflights.map((preflight) => {
    const isMiniStar = preflight.tenantId === "ministar";

    return {
      lockId: `ai-prototype-patch-authorization-release-lock-${preflight.requestId}`,
      tenantId: preflight.tenantId,
      requestId: preflight.requestId,
      preflightId: preflight.preflightId,
      label: isMiniStar
        ? "MiniStar patch authorization release lock"
        : "Patch authorization release lock",
      status: "locked",
      summary: isMiniStar
        ? "MiniStar patch authorization remains locked until signed approval, release-control, app file scope, tests, rollback, storage, and hiragana support-only checks are accepted."
        : "Patch authorization remains locked until signed approval, release-control, app file scope, tests, rollback, storage, and white-label checks are accepted.",
      requiredReleaseLocks: [
        "Signed approval preflight accepted",
        "Release-control binding accepted",
        "Patch file scope accepted",
        "Patch test evidence accepted",
        "Route safety release gate accepted",
        "Rollback drill accepted",
        "Storage contract verification accepted",
        "Reviewer identity signature gate accepted",
      ],
      authorizationScope: [
        "Specific request id only",
        "Specific tenant id only",
        "Specific proposed file scope only",
        "Specific route registry scope only",
        "Specific rollback snapshot only",
        "Specific test evidence packet only",
        "Support-language evidence cannot authorize progress",
      ],
      forbiddenUntilUnlocked: [
        "No release-control acceptance",
        "No signed approval record",
        "No accepted patch test evidence",
        "No accepted rollback drill",
        "No accepted route safety gate",
        "No accepted storage verification",
        "No approved app file scope",
        ...(isMiniStar ? ["No accepted hiragana support boundary"] : []),
      ],
      releaseEvidence: [
        "Release-control state before patch",
        "Release-control state after patch",
        "Patch scope checksum",
        "Fixture replay evidence",
        "Route smoke evidence",
        "Rollback rehearsal evidence",
        "Storage verification evidence",
        "Reviewer identity evidence",
      ],
      blockedActions: [
        "No patch authorization",
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
        "Patch authorization release lock storage contract",
        "Signed approval acceptance record",
        "Release-control binding",
        "Accepted patch test evidence packet",
        "Accepted rollback drill record",
        "Accepted route safety release gate",
      ],
    };
  });

export const sampleAiPrototypePatchAuthorizationReleaseLockErrors =
  validateAiPrototypePatchAuthorizationReleaseLocks(sampleAiPrototypePatchAuthorizationReleaseLocks);

export const sampleAiPrototypePatchAuthorizationReleaseLockWarnings =
  getAiPrototypePatchAuthorizationReleaseLockCollectionWarnings(sampleAiPrototypePatchAuthorizationReleaseLocks);

export function filterAiPrototypePatchAuthorizationReleaseLocksByTenant(
  locks: AiPrototypePatchAuthorizationReleaseLock[],
  tenantId: string,
): AiPrototypePatchAuthorizationReleaseLock[] {
  return locks.filter((lock) => lock.tenantId === tenantId);
}
