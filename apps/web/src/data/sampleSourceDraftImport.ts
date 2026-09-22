import {
  validateSourceDraftImportPreview,
  validateSourceDraftImportPreviewBinding,
  type SourceDraftImportPreview,
} from "@living-textbook/content-model";
import { sampleSourceExtractionPreviews } from "@/data/sampleSourceExtractionPreviews";
import { sampleSourcePackageAssemblyPackets } from "@/data/sampleSourcePackageAssembly";
import { sampleTeacherDraftPackages } from "@/data/sampleTeacherDraftPackage";

const assembly = sampleSourcePackageAssemblyPackets.find((packet) => packet.packetId === "assembly-sample-publisher-l1-u1-routines-v1");
const extractionPreview = sampleSourceExtractionPreviews.find((preview) => preview.previewId === "preview-sample-publisher-l1-u1-routines-v1");
const draft = sampleTeacherDraftPackages.find((candidate) => candidate.draftId === "draft-sample-publisher-l1-u1");

export const sampleSourceDraftImportPreviews: SourceDraftImportPreview[] = [
  {
    importPreviewId: "source-draft-import-sample-publisher-l1-u1-v1",
    tenantId: "sample-publisher",
    sourceId: "src-sample-publisher-unit-pdf",
    targetPackageId: "sample-publisher-l1-u1-routines-package",
    assemblyPacketId: "assembly-sample-publisher-l1-u1-routines-v1",
    extractionPreviewId: "preview-sample-publisher-l1-u1-routines-v1",
    draftId: "draft-sample-publisher-l1-u1",
    candidateUnitKey: "sample-publisher:partner-textbook-companion:L1:U1",
    sourceChecksum: `sha256:${"2".repeat(64)}`,
    mode: "review-only",
    status: "blocked",
    requiredRecords: [
      "source_package_assembly_packet",
      "source_extraction_review_packet",
      "teacher_draft_package_preview",
      "teacher_draft_review_handoff",
    ],
    blockers: [
      "Extraction review is not accepted, so no teacher draft may be created from this preview.",
      "Storage write, assignment, and package promotion remain blocked in the foundation scaffold.",
    ],
    draftCreationAllowed: false,
    storageWriteAllowed: false,
    studentFacingPayloadAllowed: false,
    assignmentAllowed: false,
  },
];

export const sampleSourceDraftImportErrors = sampleSourceDraftImportPreviews.flatMap((preview) => [
  ...validateSourceDraftImportPreview(preview),
  ...validateSourceDraftImportPreviewBinding(preview, assembly, extractionPreview, draft),
].map((error) => `${preview.importPreviewId}: ${error}`));
