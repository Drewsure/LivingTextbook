import {
  validateAiPrototypeReturnedPackageManifest,
  type AiPrototypeReturnedPackageManifest,
} from "./aiPrototypeReturnedPackageManifest";

export type AiPrototypeReturnChecklistStatus = "not-returned" | "evidence-needed" | "ready-for-return-review";

export interface AiPrototypeReturnChecklistReference {
  checklistId: string;
  tenantId: string;
  queueItemId: string;
  status: AiPrototypeReturnChecklistStatus;
  sourceRepository: string;
  targetMode: string;
  parentEngine: string;
  targetSurface: string;
}

export interface AiPrototypeIntakeQueueReference {
  itemId: string;
  tenantId: string;
  sourceRepository: string;
  targetMode: string;
  parentEngine: string;
  targetSurface: string;
}

export function validateAiPrototypeReturnedPackageAlignment(
  manifest: AiPrototypeReturnedPackageManifest,
  checklist: AiPrototypeReturnChecklistReference,
): string[] {
  const errors = validateAiPrototypeReturnedPackageManifest(manifest);

  if (manifest.tenantId !== checklist.tenantId) {
    errors.push("Returned package manifest tenantId does not match the return checklist.");
  }
  if (manifest.queueItemId !== checklist.queueItemId) {
    errors.push("Returned package manifest queueItemId does not match the return checklist.");
  }
  if (manifest.sourceRepository !== checklist.sourceRepository) {
    errors.push("Returned package manifest sourceRepository does not match the return checklist.");
  }
  if (manifest.targetMode !== checklist.targetMode) {
    errors.push("Returned package manifest targetMode does not match the return checklist.");
  }
  if (manifest.parentEngine !== checklist.parentEngine) {
    errors.push("Returned package manifest parentEngine does not match the return checklist.");
  }
  if (manifest.targetSurface !== checklist.targetSurface) {
    errors.push("Returned package manifest targetSurface does not match the return checklist.");
  }
  if (manifest.status === "review-only" && checklist.status !== "ready-for-return-review") {
    errors.push("A review-only returned package requires a return checklist ready-for-return-review status.");
  }

  return errors;
}

export function validateAiPrototypeReturnedPackageIntakeAlignment(
  manifest: AiPrototypeReturnedPackageManifest,
  intake: AiPrototypeIntakeQueueReference,
): string[] {
  const errors = validateAiPrototypeReturnedPackageManifest(manifest);

  if (manifest.tenantId !== intake.tenantId) {
    errors.push("Returned package manifest tenantId does not match the intake queue.");
  }
  if (manifest.queueItemId !== intake.itemId) {
    errors.push("Returned package manifest queueItemId does not match the intake queue item.");
  }
  if (manifest.sourceRepository !== intake.sourceRepository) {
    errors.push("Returned package manifest sourceRepository does not match the intake queue.");
  }
  if (manifest.targetMode !== intake.targetMode) {
    errors.push("Returned package manifest targetMode does not match the intake queue.");
  }
  if (manifest.parentEngine !== intake.parentEngine) {
    errors.push("Returned package manifest parentEngine does not match the intake queue.");
  }
  if (manifest.targetSurface !== intake.targetSurface) {
    errors.push("Returned package manifest targetSurface does not match the intake queue.");
  }

  return errors;
}
