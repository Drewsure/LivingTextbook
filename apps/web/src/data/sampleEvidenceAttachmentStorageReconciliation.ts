import {
  createEvidenceAttachmentStorageReconciliation,
  type EvidenceAttachmentStorageReconciliation,
} from "@living-textbook/content-model";
import { sampleEvidenceAttachmentStorageHandoffBinding } from "@/data/sampleEvidenceAttachmentStorageHandoff";
import { samplePersistenceProviderSelectionPreflight } from "@/data/samplePersistenceProviderSelectionPreflight";
import {
  sampleLabelledDiagramAssetEvidencePacket,
  sampleMediaAssetEvidencePacket,
} from "@/data/sampleAssetEvidencePacket";

export const sampleEvidenceAttachmentStorageReconciliation: EvidenceAttachmentStorageReconciliation =
  createEvidenceAttachmentStorageReconciliation({
    tenantId: "sample-publisher",
    packageId: "sample-publisher-l1-u1-routines-package",
    storageBindingId: sampleEvidenceAttachmentStorageHandoffBinding.bindingId,
    storageSelectionPreflightId: samplePersistenceProviderSelectionPreflight.preflightId,
    storageSelectionGateId: samplePersistenceProviderSelectionPreflight.evidenceStorageGateId,
    status: "blocked-preview",
    assetPacketIds: [
      sampleLabelledDiagramAssetEvidencePacket.packetId,
      sampleMediaAssetEvidencePacket.packetId,
    ],
    attachmentIds: [
      ...sampleLabelledDiagramAssetEvidencePacket.attachments.map((attachment) => attachment.attachmentId),
      ...sampleMediaAssetEvidencePacket.attachments.map((attachment) => attachment.attachmentId),
    ],
    candidateIds: sampleEvidenceAttachmentStorageHandoffBinding.candidateIds,
    unresolvedGates: [
      "Select a tenant-approved storage mode",
      "Confirm quarantine and malware-scan retention policy",
      "Confirm rights, deletion, export, and backup responsibility",
      "Pass package release-control and reviewer approval",
    ],
    blockedActions: [
      "No per-asset storage selection",
      "No attachment upload",
      "No attachment download",
      "No asset promotion",
      "No student-facing attachment",
    ],
  });
