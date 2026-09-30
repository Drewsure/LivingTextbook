import {
  createPublisherDeliveryHandoffRecord,
  validatePublisherDeliveryHandoffRecord,
  type PublisherDeliveryHandoffRecord,
} from "@living-textbook/content-model";
import { sampleHostedPersistenceOptInDecisionPacket } from "@/data/sampleHostedPersistenceOptInDecisionPacket";
import { samplePackageReadinessReconciliations } from "@/data/samplePackageReadinessReconciliation";
import { samplePilotDeliveryManifest } from "@/data/samplePilotDeliveryManifest";
import { samplePilotDeliveryReleaseReceipt } from "@/data/samplePilotDeliveryReleaseReceipt";
import { samplePilotQrAliasRegistry } from "@/data/samplePilotQrAliasRegistry";
import { samplePublisherPilotPackagePreview } from "@/data/samplePublisherPilotPackagePreview";

const reconciliation = samplePackageReadinessReconciliations.find(
  (candidate) => candidate.packageId === samplePublisherPilotPackagePreview.packageId,
);

if (!reconciliation) throw new Error("Sample publisher handoff record requires package reconciliation.");

export const samplePublisherDeliveryHandoffRecord: PublisherDeliveryHandoffRecord = createPublisherDeliveryHandoffRecord({
  tenantId: samplePublisherPilotPackagePreview.tenantId,
  quarantineId: sampleHostedPersistenceOptInDecisionPacket.quarantineId,
  packageId: samplePublisherPilotPackagePreview.packageId,
  sourceChecksumSha256: reconciliation.sourceAssemblyChecksum.replace(/^sha256:/, ""),
  selectedMode: "closed-local",
  sourceReviewPassed: false,
  packageReviewPacketId: sampleHostedPersistenceOptInDecisionPacket.reviewPacketId,
  packageReviewPacketReady: false,
  deliveryManifestPreviewId: `${samplePilotDeliveryManifest.manifestId}:preview`,
  releaseReceiptPreviewId: `${samplePilotDeliveryReleaseReceipt.receiptId}:preview`,
  packageIndexPreviewId: `${samplePilotDeliveryManifest.manifestId}:package-index:preview`,
  assemblyRequestPreviewId: `${samplePilotDeliveryManifest.manifestId}:assembly-request-preview`,
  qrRegistryId: `${samplePilotQrAliasRegistry.manifestId}:qr-registry-preview`,
});

export const samplePublisherDeliveryHandoffRecordErrors = validatePublisherDeliveryHandoffRecord(
  samplePublisherDeliveryHandoffRecord,
);
