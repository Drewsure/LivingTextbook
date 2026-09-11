import {
  AI_PROTOTYPE_RETURNED_BLOCKED_ACTIONS,
  validateAiPrototypeReturnedPackageManifest,
  type AiPrototypeReturnedPackageManifest,
} from "@living-textbook/content-model/src/aiPrototypeReturnedPackageManifest";
import { samplePrototypeReturnPackageChecklists } from "@/data/samplePrototypeReturnPackageChecklist";

export const sampleAiPrototypeReturnedPackageManifests: AiPrototypeReturnedPackageManifest[] =
  samplePrototypeReturnPackageChecklists.map((checklist) => ({
    manifestId: `returned-package-manifest-${checklist.queueItemId}`,
    tenantId: checklist.tenantId,
    requestId: `return-package-preview-${checklist.queueItemId}`,
    queueItemId: checklist.queueItemId,
    status: "not-returned",
    sourceRepository: checklist.sourceRepo,
    sourceSnapshotId: "not-returned",
    prototypeFolder: "not-returned",
    targetMode: checklist.targetMode,
    parentEngine: checklist.parentEngine,
    artifacts: [],
    blockedActions: [...AI_PROTOTYPE_RETURNED_BLOCKED_ACTIONS],
  }));

export const sampleAiPrototypeReturnedPackageManifestErrors =
  sampleAiPrototypeReturnedPackageManifests.flatMap((manifest) =>
    validateAiPrototypeReturnedPackageManifest(manifest).map(
      (error) => manifest.manifestId + ": " + error,
    ),
  );
