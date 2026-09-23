import {
  deriveAssetManifestPreviews,
  deriveAssetManifestReleaseControlBinding,
  type AssetEvidencePacket,
  type AssetManifestPreview,
  type AssetManifestReleaseControlBinding,
} from "@living-textbook/content-model";

const attachmentBlocks = [
  "No attachment upload",
  "No object storage write",
  "No attachment download",
  "No student-facing attachment",
] as const;

const packetBlocks = [
  "No evidence upload",
  "No object storage write",
  "No asset promotion",
  "No student-facing attachment",
] as const;

export const sampleLabelledDiagramAssetEvidencePacket: AssetEvidencePacket = {
  packetId: "asset-evidence-sample-publisher-labelled-diagram",
  tenantId: "sample-publisher",
  packageId: "sample-publisher-l1-u1-routines-package",
  reviewStatus: "review-only",
  attachments: [
    {
      attachmentId: "asset-attachment-sample-publisher-labelled-diagram",
      tenantId: "sample-publisher",
      assetId: "sample-publisher-l1-u1-labelled-diagram-image",
      sourceLineageRef: "sample-publisher-l1-u1-textbook-source",
      file: { kind: "image", mimeType: "image/png", sizeBytes: 184320 },
      checksum: "sha256:sample-labelled-diagram-image",
      status: "metadata-captured",
      storageWriteAllowed: false,
      downloadAllowed: false,
      studentFacingAllowed: false,
      blockedActions: [...attachmentBlocks],
    },
  ],
  missingEvidence: ["image rights proof", "alt-text review", "label anchor review", "release approval"],
  blockedActions: [...packetBlocks],
};

export const sampleMediaAssetEvidencePacket: AssetEvidencePacket = {
  packetId: "asset-evidence-sample-publisher-media",
  tenantId: "sample-publisher",
  packageId: "sample-publisher-l1-u1-routines-package",
  reviewStatus: "review-only",
  attachments: [
    {
      attachmentId: "asset-attachment-sample-publisher-greetings-audio",
      tenantId: "sample-publisher",
      assetId: "sample-publisher-l1-u1-greetings-audio",
      sourceLineageRef: "sample-publisher-l1-u1-media-source",
      file: { kind: "audio", mimeType: "audio/mpeg", sizeBytes: 524288 },
      checksum: "sha256:sample-greetings-audio",
      status: "metadata-captured",
      storageWriteAllowed: false,
      downloadAllowed: false,
      studentFacingAllowed: false,
      blockedActions: [...attachmentBlocks],
    },
    {
      attachmentId: "asset-attachment-sample-publisher-routines-video",
      tenantId: "sample-publisher",
      assetId: "sample-publisher-l1-u1-routines-video",
      sourceLineageRef: "sample-publisher-l1-u1-media-source",
      file: { kind: "video", mimeType: "video/mp4", sizeBytes: 8388608 },
      checksum: "sha256:sample-routines-video",
      status: "metadata-captured",
      storageWriteAllowed: false,
      downloadAllowed: false,
      studentFacingAllowed: false,
      blockedActions: [...attachmentBlocks],
    },
  ],
  missingEvidence: ["media rights proof", "caption/transcript packet", "poster/fallback review", "release approval"],
  blockedActions: [...packetBlocks],
};

export const sampleLabelledDiagramAssetManifestPreviews: AssetManifestPreview[] = deriveAssetManifestPreviews(
  sampleLabelledDiagramAssetEvidencePacket,
  {
    releaseGateId: "sample-publisher-l1-u1-release-gate",
    target: "game-asset-manifest",
    targetMappingReviewed: false,
    rightsEvidenceReady: false,
    accessibilityEvidenceReady: false,
    releaseGateReady: false,
  },
);

export const sampleMediaAssetManifestPreviews: AssetManifestPreview[] = deriveAssetManifestPreviews(
  sampleMediaAssetEvidencePacket,
  {
    releaseGateId: "sample-publisher-l1-u1-release-gate",
    target: "media-manifest",
    targetMappingReviewed: false,
    rightsEvidenceReady: false,
    accessibilityEvidenceReady: false,
    releaseGateReady: false,
  },
);

const sampleAssetReleaseControlOptions = {
  packageVersion: "1.0.0",
  deploymentMode: "hybrid" as const,
  releaseDecision: "blocked" as const,
  releaseBlockingReasons: ["Package approval and media rights review are open."],
  requiredApprovals: ["Tenant approver", "Publisher or school media owner"],
  deploymentPolicyReviewed: false,
  hostedStorageReviewed: false,
  localBundleReviewed: false,
};

export const sampleLabelledDiagramAssetReleaseControlBindings: AssetManifestReleaseControlBinding[] = sampleLabelledDiagramAssetManifestPreviews.map((preview) =>
  deriveAssetManifestReleaseControlBinding(preview, sampleAssetReleaseControlOptions),
);

export const sampleMediaAssetReleaseControlBindings: AssetManifestReleaseControlBinding[] = sampleMediaAssetManifestPreviews.map((preview) =>
  deriveAssetManifestReleaseControlBinding(preview, sampleAssetReleaseControlOptions),
);
