import {
  validateAiPrototypeReturnedPackageAlignment,
  validateAiPrototypeReturnedPackageIntakeAlignment,
  type AiPrototypeIntakeQueueReference,
  type AiPrototypeReturnChecklistReference,
} from "@living-textbook/content-model/src/aiPrototypeReturnedPackageAlignment";
import {
  AI_PROTOTYPE_RETURNED_BLOCKED_ACTIONS,
  validateAiPrototypeReturnedPackageManifest,
  type AiPrototypeReturnedPackageManifest,
} from "@living-textbook/content-model/src/aiPrototypeReturnedPackageManifest";
import { samplePrototypeReturnPackageChecklists } from "@/data/samplePrototypeReturnPackageChecklist";
import { samplePrototypeIntakeQueue } from "@/data/samplePrototypeIntakeQueue";

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
    targetSurface: checklist.targetSurface === "Phaser wrapper candidate" ? "phaser" : "dom-reference",
    artifacts: [],
    blockedActions: [...AI_PROTOTYPE_RETURNED_BLOCKED_ACTIONS],
  }));

export const sampleAiPrototypeReturnedPackageManifestErrors =
  sampleAiPrototypeReturnedPackageManifests.flatMap((manifest) =>
    validateAiPrototypeReturnedPackageManifest(manifest).map(
      (error) => manifest.manifestId + ": " + error,
    ),
  );

const checklistReferences: AiPrototypeReturnChecklistReference[] = samplePrototypeReturnPackageChecklists.map(
  (checklist) => ({
    checklistId: checklist.checklistId,
    tenantId: checklist.tenantId,
    queueItemId: checklist.queueItemId,
    status: checklist.status,
    sourceRepository: checklist.sourceRepo,
    targetMode: checklist.targetMode,
    parentEngine: checklist.parentEngine,
    targetSurface: checklist.targetSurface === "Phaser wrapper candidate" ? "phaser" : "dom-reference",
  }),
);

export const sampleAiPrototypeReturnedPackageAlignmentErrors = sampleAiPrototypeReturnedPackageManifests.flatMap(
  (manifest) => {
    const checklist = checklistReferences.find((candidate) => candidate.queueItemId === manifest.queueItemId);
    if (!checklist) {
      return [`${manifest.manifestId}: no return checklist reference exists.`];
    }
    return validateAiPrototypeReturnedPackageAlignment(manifest, checklist).map(
      (error) => `${manifest.manifestId}: ${error}`,
    );
  },
);

const intakeReferences: AiPrototypeIntakeQueueReference[] = samplePrototypeIntakeQueue.map((item) => ({
  itemId: item.itemId,
  tenantId: item.tenantId,
  sourceRepository: item.sourceRepo,
  targetMode: item.gameMode,
  parentEngine: item.parentEngine,
  targetSurface: item.targetSurface,
}));

export const sampleAiPrototypeReturnedPackageIntakeAlignmentErrors = sampleAiPrototypeReturnedPackageManifests.flatMap(
  (manifest) => {
    const intake = intakeReferences.find((candidate) => candidate.itemId === manifest.queueItemId);
    if (!intake) {
      return [`${manifest.manifestId}: no intake queue reference exists.`];
    }
    return validateAiPrototypeReturnedPackageIntakeAlignment(manifest, intake).map(
      (error) => `${manifest.manifestId}: ${error}`,
    );
  },
);
