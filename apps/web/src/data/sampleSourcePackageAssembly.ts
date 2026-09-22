import {
  validateSourcePackageAssemblyExtractionPreviewBinding,
  validateSourcePackageAssemblyPacket,
} from "@living-textbook/content-model";
import type { SourcePackageAssemblyPacket } from "@living-textbook/content-model";
import { sampleSourceExtractionPreviews } from "@/data/sampleSourceExtractionPreviews";

export const sampleSourcePackageAssemblyPackets: SourcePackageAssemblyPacket[] = [
  {
    packetId: "assembly-ministar-l1-u1-greetings-v1",
    tenantId: "ministar",
    sourceId: "src-ministar-master-docx",
    targetPackageId: "ministar-l1-u1-greetings-package",
    targetLanguage: "en",
    assistLanguages: ["ja"],
    extractionPacketId: "source-extract-ministar-master-docx-manual-v1",
    extractionPreviewId: "preview-ministar-l1-u1-greetings-v1",
    label: "MiniStar candidate package assembly",
    mode: "review-only",
    status: "draft-candidate",
    sourceChecksum: "sha256:1111111111111111111111111111111111111111111111111111111111111111",
    candidateUnitKeys: ["ministar:ministar-english:L1:U1"],
    candidateMediaAssetIds: ["ministar-l1-u1-greetings-audio", "ministar-l1-u1-greetings-video"],
    approvalLedgerId: "ministar-approval-ledger-preview",
    approvalLedgerLinked: true,
    requiredRecords: [
      "source_extraction_review_packet",
      "teacher_draft_package",
      "teacher_draft_review_handoff",
    ],
    blockers: [
      "Real partner media files and rights proof remain required before package release.",
      "Teacher review handoff remains evidence-only in the foundation scaffold.",
    ],
    sourceLineageReviewed: true,
    extractionReviewAccepted: true,
    mediaRightsReviewed: false,
    targetMappingReviewed: true,
    teacherReviewHandoffPresent: true,
    draftCreationAllowed: false,
    studentFacingPayloadAllowed: false,
    packagePromotionAllowed: false,
    approvalCaptureAllowed: false,
  },
  {
    packetId: "assembly-sample-publisher-l1-u1-routines-v1",
    tenantId: "sample-publisher",
    sourceId: "src-sample-publisher-unit-pdf",
    targetPackageId: "sample-publisher-l1-u1-routines-package",
    targetLanguage: "en",
    assistLanguages: [],
    extractionPacketId: "source-extract-sample-publisher-pdf-ocr-v1",
    extractionPreviewId: "preview-sample-publisher-l1-u1-routines-v1",
    label: "Sample publisher candidate package assembly",
    mode: "review-only",
    status: "blocked",
    sourceChecksum: "sha256:2222222222222222222222222222222222222222222222222222222222222222",
    candidateUnitKeys: ["sample-publisher:partner-textbook-companion:L1:U1"],
    candidateMediaAssetIds: ["sample-publisher-l1-u1-routines-audio", "sample-publisher-l1-u1-routines-video"],
    approvalLedgerId: "sample-publisher-approval-ledger",
    approvalLedgerLinked: true,
    requiredRecords: [
      "source_extraction_review_packet",
      "teacher_draft_package",
      "teacher_draft_review_handoff",
    ],
    blockers: [
      "Real source PDF must be supplied before extraction can be accepted.",
      "Media rights and partner delivery rules are unresolved.",
    ],
    sourceLineageReviewed: false,
    extractionReviewAccepted: false,
    mediaRightsReviewed: false,
    targetMappingReviewed: false,
    teacherReviewHandoffPresent: false,
    draftCreationAllowed: false,
    studentFacingPayloadAllowed: false,
    packagePromotionAllowed: false,
    approvalCaptureAllowed: false,
  },
];

export const sampleSourcePackageAssemblyErrors = sampleSourcePackageAssemblyPackets.flatMap((packet) =>
  [
    ...validateSourcePackageAssemblyPacket(packet),
    ...validateSourcePackageAssemblyExtractionPreviewBinding(
      packet,
      sampleSourceExtractionPreviews.find((preview) => preview.previewId === packet.extractionPreviewId),
    ),
  ].map((error) => `${packet.packetId}: ${error}`),
);
