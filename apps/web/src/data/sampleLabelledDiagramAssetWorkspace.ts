export type LabelledDiagramAssetWorkspaceStatus = "teacher-review-only" | "blocked";

export interface LabelledDiagramAnchorPreview {
  anchorId: string;
  label: string;
  targetLanguageText: string;
  supportLanguageText: string;
  audioCueStatus: string;
  coordinateStatus: string;
  progressRule: string;
}

export interface LabelledDiagramAssetWorkspace {
  workspaceId: string;
  tenantId: string;
  label: string;
  status: LabelledDiagramAssetWorkspaceStatus;
  summary: string;
  sourceUpload: {
    uploadId: string;
    sourceLabel: string;
    targetMappingPacket: string;
    rightsStatus: string;
  };
  manifestPreview: string[];
  anchors: LabelledDiagramAnchorPreview[];
  requiredPackets: string[];
  blockedActions: string[];
  relatedRoutes: Array<{ label: string; href: string }>;
}

export const sampleLabelledDiagramAssetWorkspace: LabelledDiagramAssetWorkspace = {
  workspaceId: "sample-publisher-l1-u1-labelled-diagram",
  tenantId: "sample-publisher",
  label: "Labelled Diagram asset workspace",
  status: "teacher-review-only",
  summary:
    "Teacher-only asset review surface for a future Labelled Diagram image. Manifest and anchors preview data shows the image manifest, reviewed anchors, target-language audio coverage, and release blockers before any student-facing image game exists.",
  sourceUpload: {
    uploadId: "upload-review-labelled-diagram-image-l1-u1",
    sourceLabel: "Daily routine picture upload",
    targetMappingPacket: "target_mapping_packet",
    rightsStatus: "needs image rights proof before pilot",
  },
  manifestPreview: [
    "game_asset_manifest",
    "student_facing_asset_allowed: false",
    "Image rights proof",
    "Alt text required",
    "Image safety review",
    "Release gate status blocked",
  ],
  anchors: [
    {
      anchorId: "anchor-wake-up",
      label: "Wake up label",
      targetLanguageText: "wake up",
      supportLanguageText: "おきる",
      audioCueStatus: "Audio label coverage required",
      coordinateStatus: "Anchor coordinate review required",
      progressRule: "Target-language label text only",
    },
    {
      anchorId: "anchor-eat",
      label: "Eat label",
      targetLanguageText: "eat",
      supportLanguageText: "たべる",
      audioCueStatus: "Audio label coverage required",
      coordinateStatus: "Anchor coordinate review required",
      progressRule: "Support-language labels are support-only",
    },
    {
      anchorId: "anchor-play",
      label: "Play label",
      targetLanguageText: "play",
      supportLanguageText: "あそぶ",
      audioCueStatus: "Audio label coverage required",
      coordinateStatus: "Anchor coordinate review required",
      progressRule: "support_language_progress_allowed: false",
    },
  ],
  requiredPackets: [
    "target_mapping_packet",
    "scan_and_file_policy_packet",
    "rights_proof_packet",
    "activity_compatibility_snapshot",
    "label_anchor_record",
    "audio_coverage_packet",
  ],
  blockedActions: [
    "No live label editor",
    "No coordinate editor",
    "No student-facing image game",
    "No auto-generated labels",
    "No asset promotion without release gate",
    "No support-language progress trigger",
    "No assignment route from uploaded image",
  ],
  relatedRoutes: [
    { label: "Upload workspace", href: "/teacher/uploads/sample-publisher" },
    { label: "Review queue", href: "/teacher/review" },
    { label: "Teacher unit review", href: "/teacher/units/sample-publisher%3Apartner-textbook-companion%3AL1%3AU1" },
  ],
};

export function findLabelledDiagramAssetWorkspace(workspaceId: string): LabelledDiagramAssetWorkspace | undefined {
  return sampleLabelledDiagramAssetWorkspace.workspaceId === workspaceId ? sampleLabelledDiagramAssetWorkspace : undefined;
}
