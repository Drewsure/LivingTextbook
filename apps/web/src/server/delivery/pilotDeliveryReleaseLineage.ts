import type {
  PilotDeliveryManifest,
  UploadQuarantinePackageEvidenceReview,
  UploadQuarantinePackageReviewPacket,
  UploadQuarantineReviewDecisionRecord,
  UploadQuarantineReviewSummary,
  UploadQuarantineDeliveryModeDecision,
  UploadQuarantinePromotionAdapterDecision,
} from "@living-textbook/content-model";
import {
  readQuarantineDeliveryModeDecision,
  readQuarantinePromotionAdapterDecision,
  readQuarantinePackageEvidenceReview,
  readQuarantinePackageReviewPacket,
  readQuarantineReviewDecision,
  readQuarantineUploadRecords,
} from "@/server/uploads/quarantineUploadStore";

export type PilotDeliveryReleaseLineageRecords = {
  summary: UploadQuarantineReviewSummary | null;
  reviewDecision: UploadQuarantineReviewDecisionRecord | null;
  packageEvidenceReview: UploadQuarantinePackageEvidenceReview | null;
  packageReviewPacket: UploadQuarantinePackageReviewPacket | null;
  deliveryModeDecision: UploadQuarantineDeliveryModeDecision | null;
  promotionAdapterDecision: UploadQuarantinePromotionAdapterDecision | null;
  errors: string[];
};

export async function readPilotDeliveryReleaseLineage(manifest: PilotDeliveryManifest, quarantineId: string): Promise<string[]> {
  const [intake, reviewDecisionResult, packageEvidenceResult, packetResult, deliveryModeResult, promotionAdapterResult] = await Promise.all([
    readQuarantineUploadRecords(manifest.tenantId, quarantineId),
    readQuarantineReviewDecision(manifest.tenantId, quarantineId),
    readQuarantinePackageEvidenceReview(manifest.tenantId, quarantineId),
    readQuarantinePackageReviewPacket(manifest.tenantId, quarantineId),
    readQuarantineDeliveryModeDecision(manifest.tenantId, quarantineId),
    readQuarantinePromotionAdapterDecision(manifest.tenantId, quarantineId),
  ]);

  return validatePilotDeliveryReleaseLineage({
    manifest,
    quarantineId,
    summary: intake.records[0] ?? null,
    reviewDecision: reviewDecisionResult.record,
    packageEvidenceReview: packageEvidenceResult.record,
    packageReviewPacket: packetResult.record,
    deliveryModeDecision: deliveryModeResult.record,
    promotionAdapterDecision: promotionAdapterResult.record,
    errors: [...intake.errors, ...reviewDecisionResult.errors, ...packageEvidenceResult.errors, ...packetResult.errors, ...deliveryModeResult.errors, ...promotionAdapterResult.errors],
  });
}

export function validatePilotDeliveryReleaseLineage(records: PilotDeliveryReleaseLineageRecords & { manifest: PilotDeliveryManifest; quarantineId: string }): string[] {
  const errors = [...records.errors];
  const { manifest, quarantineId } = records;
  const summary = records.summary;
  const expectedChecksum = summary ? `sha256:${summary.record.checksumSha256}` : null;

  if (!summary || summary.quarantineId !== quarantineId) errors.push("A tenant-bound quarantine intake record is required before delivery release.");
  if (expectedChecksum && manifest.sourceAssemblyChecksum !== expectedChecksum) errors.push("Delivery manifest sourceAssemblyChecksum does not match the quarantined source checksum.");

  const reviewDecision = records.reviewDecision;
  if (!reviewDecision || reviewDecision.decision !== "accepted-for-package-review") errors.push("An accepted-for-package-review decision is required before delivery release.");
  else if (reviewDecision.tenantId !== manifest.tenantId || reviewDecision.quarantineId !== quarantineId || reviewDecision.packageId !== manifest.packageId || reviewDecision.sourceId !== `quarantine-record:${quarantineId}`) errors.push("Source review decision identity does not match the delivery manifest lineage.");

  const packageEvidenceReview = records.packageEvidenceReview;
  if (!packageEvidenceReview || packageEvidenceReview.status !== "reviewed-package-evidence") errors.push("Complete reviewed multimedia and game evidence is required before delivery release.");
  else {
    if (packageEvidenceReview.tenantId !== manifest.tenantId || packageEvidenceReview.quarantineId !== quarantineId || packageEvidenceReview.packageId !== manifest.packageId) errors.push("Package evidence review identity does not match the delivery manifest lineage.");
    if (summary && packageEvidenceReview.sourceChecksumSha256 !== summary.record.checksumSha256) errors.push("Package evidence review checksum does not match the quarantined source checksum.");
  }

  const packet = records.packageReviewPacket;
  if (!packet || packet.status !== "ready-for-next-gate") errors.push("A ready package review packet is required before delivery release.");
  else {
    if (packet.tenantId !== manifest.tenantId || packet.quarantineId !== quarantineId || packet.packageId !== manifest.packageId) errors.push("Package review packet identity does not match the delivery manifest lineage.");
    if (summary && packet.checksumSha256 !== summary.record.checksumSha256) errors.push("Package review packet checksum does not match the quarantined source checksum.");
    if (packet.reviewDecision !== "accepted-for-package-review") errors.push("Package review packet must preserve the accepted source review decision before delivery release.");
  }

  const deliveryModeDecision = records.deliveryModeDecision;
  if (!deliveryModeDecision || deliveryModeDecision.selectedMode !== manifest.mode) errors.push("The selected delivery mode must match the delivery manifest before delivery release.");
  else if (deliveryModeDecision.tenantId !== manifest.tenantId || deliveryModeDecision.quarantineId !== quarantineId || deliveryModeDecision.packageId !== manifest.packageId) errors.push("Delivery mode decision identity does not match the delivery manifest lineage.");

  const promotionAdapterDecision = records.promotionAdapterDecision;
  const expectedAdapter = manifest.mode === "closed-local" ? "closed-local-package" : manifest.mode === "hosted-pwa" ? "hosted-pwa-package" : manifest.mode === "hybrid" ? "hybrid-package" : null;
  if (!promotionAdapterDecision || promotionAdapterDecision.status !== "selected-review-only") errors.push("A review-only promotion adapter selection is required before delivery release.");
  else {
    if (promotionAdapterDecision.tenantId !== manifest.tenantId || promotionAdapterDecision.quarantineId !== quarantineId || promotionAdapterDecision.packageId !== manifest.packageId) errors.push("Promotion adapter decision identity does not match the delivery manifest lineage.");
    if (summary && promotionAdapterDecision.sourceChecksumSha256 !== summary.record.checksumSha256) errors.push("Promotion adapter decision checksum does not match the quarantined source checksum.");
    if (expectedAdapter && promotionAdapterDecision.selectedAdapter !== expectedAdapter) errors.push("Promotion adapter decision does not match the delivery manifest mode.");
  }

  return [...new Set(errors)];
}
