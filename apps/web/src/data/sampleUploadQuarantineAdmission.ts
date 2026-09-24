import {
  createUploadQuarantineIntakeRecord,
  deriveUploadQuarantineAdmissionPreview,
  createUploadQuarantineAdmissionHandoffBinding,
  type UploadQuarantineAdmissionPreview,
  type UploadQuarantineAdmissionHandoffBinding,
  type UploadQuarantineEvidenceInput,
} from "@living-textbook/content-model";

const sampleIntake = createUploadQuarantineIntakeRecord({
  intakeId: "q-00000000-0000-4000-8000-000000000001",
  tenantId: "sample-publisher",
  channelId: "source-pdf-text-upload",
  unitKey: "sample-publisher:partner-textbook-companion:L1:U1",
  fileName: "unit-1-source.pdf",
  mimeType: "application/pdf",
  sizeBytes: 128000,
  checksumSha256: "a".repeat(64),
});

const awaitingEvidence: UploadQuarantineEvidenceInput = {
  scanStatus: "pending",
  rightsStatus: "unknown",
  sourceReviewStatus: "unreviewed",
  targetMappingReviewed: false,
  accessibilityReviewed: false,
  releaseApproved: false,
  evidencePacketId: "evidence-packet-sample-publisher-unit-1-pending",
};

const completeEvidenceForReview: UploadQuarantineEvidenceInput = {
  scanStatus: "passed",
  rightsStatus: "licensed",
  sourceReviewStatus: "approved",
  targetMappingReviewed: true,
  accessibilityReviewed: true,
  releaseApproved: true,
  evidencePacketId: "evidence-packet-sample-publisher-unit-1-complete",
};

export const sampleUploadQuarantineAdmissionPreviews: UploadQuarantineAdmissionPreview[] = [
  deriveUploadQuarantineAdmissionPreview(sampleIntake, awaitingEvidence),
  deriveUploadQuarantineAdmissionPreview(sampleIntake, completeEvidenceForReview),
];

export const sampleUploadQuarantineAdmissionHandoffBindings: UploadQuarantineAdmissionHandoffBinding[] =
  sampleUploadQuarantineAdmissionPreviews.map((preview) =>
    createUploadQuarantineAdmissionHandoffBinding(preview, {
      sourceId: "upload-evidence-source",
      packageId: "sample-publisher-l1-u1-routines-package",
    }),
  );
