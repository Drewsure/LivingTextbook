import {
  createPublisherSourceToPackageEvidenceBridge,
  validatePublisherSourceToPackageEvidenceBridge,
  type PublisherSourceToPackageEvidenceBridge,
} from "@living-textbook/content-model";
import { sampleMinistarSourceDerivedUnitReview } from "./sampleMinistarSourceDerivedUnitReview";
import { sampleMinistarUnitAuthoringProposal } from "./sampleMinistarUnitAuthoringProposal";
import { sampleSourceExtractionPreviews } from "./sampleSourceExtractionPreviews";
import { sampleSourceExtractionReviewPackets } from "./sampleSourceExtractionReviewPackets";

const extractionPreview = sampleSourceExtractionPreviews.find((candidate) => candidate.previewId === "preview-ministar-l1-u1-greetings-v1");
const extractionPacket = sampleSourceExtractionReviewPackets.find((candidate) => candidate.packetId === "source-extract-ministar-master-docx-manual-v1");
if (!extractionPreview || !extractionPacket) throw new Error("MiniStar source-to-package bridge requires extraction evidence.");

export const sampleMinistarSourceToPackageEvidenceBridge: PublisherSourceToPackageEvidenceBridge = createPublisherSourceToPackageEvidenceBridge({
  tenantId: sampleMinistarSourceDerivedUnitReview.tenantId,
  unitKey: sampleMinistarSourceDerivedUnitReview.unitKey,
  sourceReviewId: sampleMinistarSourceDerivedUnitReview.reviewId,
  extractionPreviewId: extractionPreview.previewId,
  extractionPacketId: extractionPacket.packetId,
  authoringProposalId: sampleMinistarUnitAuthoringProposal.proposalId,
  sourceChecksum: sampleMinistarSourceDerivedUnitReview.sourceChecksum,
  sourceTermsReviewed: false,
  sentenceApprovalRecorded: false,
  audioEvidenceReady: false,
});

export const sampleMinistarSourceToPackageEvidenceBridgeErrors = validatePublisherSourceToPackageEvidenceBridge(sampleMinistarSourceToPackageEvidenceBridge);
