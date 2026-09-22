import type { QrAliasRuntimeRequest, TextbookReference, UnitPayload } from "@living-textbook/content-model";
import { getPermanentQrPath } from "@living-textbook/content-model";

export interface PrintableQrAliasPreview {
  request: QrAliasRuntimeRequest;
  targetPath: string;
  fallbackPath: string;
  hasPermanentTextbookIdentity: boolean;
}

export function createPrintableQrAliasPreview({
  contentPackageId,
  tenantId,
  unit,
  fallbackPath,
}: {
  contentPackageId: string;
  tenantId: string;
  unit: UnitPayload;
  fallbackPath: string;
}): PrintableQrAliasPreview {
  const reference = unit.unitMeta.textbookReference;
  const hasPermanentTextbookIdentity = hasPermanentIdentity(reference);
  const targetPath = hasPermanentTextbookIdentity
    ? getPermanentQrPath({
      tenantId,
      seriesId: reference.seriesId,
      bookId: reference.bookId,
      unitId: reference.unitId,
      activityId: reference.activityId,
      language: reference.language,
      edition: reference.edition,
      version: reference.version,
    })
    : fallbackPath;
  const aliasId = `${tenantId}-${contentPackageId}-${unit.unitMeta.unit}-print-review`;
  const releaseId = `${contentPackageId}-print-review-release`;

  return {
    targetPath,
    fallbackPath,
    hasPermanentTextbookIdentity,
    request: {
      aliasId,
      printedQrId: `qr-${aliasId}`,
      tenantId,
      packageId: contentPackageId,
      releaseId,
      currentVersion: reference?.version ?? "review",
      status: "draft",
      deploymentTarget: "hybrid",
      targetPath,
      fallbackPath,
      releaseApproved: false,
      persistenceReady: false,
      localFallbackReady: false,
      qrMutationRequested: false,
      studentFacingActivationRequested: false,
      rollback: {
        rollbackId: `${aliasId}-rollback-preview`,
        tenantId,
        aliasId,
        currentReleaseId: releaseId,
        previousReleaseId: `${contentPackageId}-previous-review-release`,
        fallbackTarget: fallbackPath,
        reason: "Printed QR preview is review-only until package, release, persistence, rights, and fallback evidence are accepted.",
        approvalState: "review-only",
        routeMutationAllowed: false,
        rollbackExecutionAllowed: false,
        learnerDataMutationAllowed: false,
      },
    },
  };
}

function hasPermanentIdentity(reference: TextbookReference | undefined): reference is TextbookReference & {
  seriesId: string;
  bookId: string;
  unitId: string;
  activityId: string;
} {
  return Boolean(
    reference?.seriesId?.trim()
      && reference.bookId?.trim()
      && reference.unitId?.trim()
      && reference.activityId?.trim(),
  );
}
