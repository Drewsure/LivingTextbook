import {
  createEvidenceAttachmentStorageHandoffBinding,
  type EvidenceAttachmentStorageHandoffBinding,
} from "@living-textbook/content-model";
import { sampleEvidenceStorageAdapterSelectionGate } from "@/data/sampleEvidenceStorageAdapterSelectionGate";
import { sampleEvidenceAttachmentStorageReadinessPlan } from "@/data/sampleEvidenceAttachmentStorageReadiness";
import { samplePilotHandoffPackage } from "@/data/samplePilotHandoffPackage";

export const sampleEvidenceAttachmentStorageHandoffBinding: EvidenceAttachmentStorageHandoffBinding =
  createEvidenceAttachmentStorageHandoffBinding({
    packageId: samplePilotHandoffPackage.packageId,
    tenantId: sampleEvidenceAttachmentStorageReadinessPlan.tenantId,
    planId: sampleEvidenceAttachmentStorageReadinessPlan.planId,
    selectionGateId: sampleEvidenceStorageAdapterSelectionGate.gateId,
    status: "blocked-preview",
    candidateIds: sampleEvidenceAttachmentStorageReadinessPlan.candidates.map((candidate) => candidate.candidateId),
    requiredMetadata: sampleEvidenceAttachmentStorageReadinessPlan.requiredMetadata,
    policyGates: [
      ...sampleEvidenceAttachmentStorageReadinessPlan.storagePolicyGates,
      ...sampleEvidenceStorageAdapterSelectionGate.vendorNeutralRequirements,
    ],
    blockedActions: [
      ...new Set([
        ...sampleEvidenceAttachmentStorageReadinessPlan.blockedStorageActions,
        ...sampleEvidenceStorageAdapterSelectionGate.blockedActions,
      ]),
    ],
  });
