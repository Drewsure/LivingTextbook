export type UploadPromotionStatus = "blocked-preview" | "planned";

export interface UploadPromotionLane {
  laneId: string;
  label: string;
  sourceChannelId: string;
  targetKind: "draft-package" | "game-asset" | "media-playlist" | "local-bundle";
  status: UploadPromotionStatus;
  summary: string;
  requiredGates: string[];
  blockedBy: string[];
  allowedPreviewActions: string[];
  notAllowedYet: string[];
  storageRequiredBeforeLive: string[];
  nextStorageContract: string;
}

export interface UploadPromotionReadinessPlan {
  planId: string;
  label: string;
  summary: string;
  hardRules: string[];
  lanes: UploadPromotionLane[];
}

export const sampleUploadPromotionReadinessPlan: UploadPromotionReadinessPlan = {
  planId: "foundation-upload-promotion-readiness",
  label: "Upload promotion readiness",
  summary:
    "Target-specific promotion preview for reviewed uploads. This explains how a file could later become a source draft, Labelled Diagram asset, media playlist item, or local bundle file while all live promotion remains blocked.",
  hardRules: [
    "Promotion is blocked until upload intake and upload review storage records both pass.",
    "Target-specific review required before a reviewed upload can become a draft, game asset, playlist item, or local bundle file.",
    "No student-facing promotion can happen from a queue item, object storage path, local folder, or disabled decision preview.",
    "No direct assignment.",
    "No folder placement promotion.",
    "No reviewed upload bypass.",
  ],
  lanes: [
    {
      laneId: "pdf-text-to-draft-package",
      label: "PDF/text to draft package",
      sourceChannelId: "source-pdf-text-upload",
      targetKind: "draft-package",
      status: "blocked-preview",
      summary:
        "A reviewed PDF/text upload may later create a teacher draft package candidate, but OCR, segmentation, audio coverage, and draft review handoff must remain explicit.",
      requiredGates: [
        "Upload intake record accepted",
        "Upload review decision accepted",
        "OCR and unit segmentation review",
        "Teacher draft package storage",
        "Draft audio coverage preview",
        "Draft review handoff packet",
      ],
      blockedBy: ["Draft package promotion blocked", "OCR quality review", "Source lineage audit", "No automatic PDF-to-game publish"],
      allowedPreviewActions: ["Preview extracted source mapping", "Inspect draft candidate outline", "List missing audio coverage"],
      notAllowedYet: ["Save live draft from upload", "Assign extracted content", "Publish generated games"],
      storageRequiredBeforeLive: ["teacher_draft_package", "teacher_draft_review_handoff", "upload_review_decision"],
      nextStorageContract: "Draft package promotion record before live OCR-to-draft workflows.",
    },
    {
      laneId: "image-to-labelled-diagram-asset",
      label: "Labelled Diagram asset promotion",
      sourceChannelId: "labelled-diagram-image-upload",
      targetKind: "game-asset",
      status: "blocked-preview",
      summary:
        "A reviewed image may later become a Labelled Diagram asset only after rights, safety, alt text, label anchors, and game accessibility are reviewed.",
      requiredGates: [
        "Upload intake record accepted",
        "Upload review decision accepted",
        "Image rights and safety review",
        "Alt text review",
        "Label anchor editor review",
        "Game accessibility review",
      ],
      blockedBy: ["Image asset promotion blocked", "Label anchor storage missing", "Game asset manifest missing", "Accessibility review missing"],
      allowedPreviewActions: ["Preview target Labelled Diagram mode", "List required label anchors", "Inspect image metadata"],
      notAllowedYet: ["Student-facing image game", "Auto-generated labels", "Use image without rights proof"],
      storageRequiredBeforeLive: ["game_asset_manifest", "label_anchor_record", "upload_review_decision"],
      nextStorageContract: "Game asset and label-anchor storage before live Labelled Diagram upload promotion.",
    },
    {
      laneId: "audio-music-to-playlist",
      label: "Audio/music playlist promotion",
      sourceChannelId: "audio-music-upload",
      targetKind: "media-playlist",
      status: "planned",
      summary:
        "Reviewed audio/music may later enrich unit playlists or optional game background media, but learning audio must remain separate and teacher-controlled.",
      requiredGates: [
        "Upload intake record accepted",
        "Upload review decision accepted",
        "Media rights proof",
        "Transcript or lyric policy",
        "Learning audio separation",
        "Teacher background-media toggle persistence",
      ],
      blockedBy: ["Media playlist promotion blocked", "Rights proof missing", "Teacher toggle storage missing", "Background media policy incomplete"],
      allowedPreviewActions: ["Preview playlist placement", "Check background-media fit", "Confirm term/sentence/instruction audio separation"],
      notAllowedYet: ["Music as mastery trigger", "Autoplay without teacher policy", "Replace required learning audio with music"],
      storageRequiredBeforeLive: ["media_manifest", "unit_media_playlist", "teacher_session_settings", "upload_review_decision"],
      nextStorageContract: "Media playlist promotion record before live audio/music upload promotion.",
    },
    {
      laneId: "video-to-playlist-local-bundle",
      label: "Video/local bundle promotion",
      sourceChannelId: "video-upload",
      targetKind: "local-bundle",
      status: "blocked-preview",
      summary:
        "Reviewed video may later become a unit playlist item or local bundle file only after captions, poster, fallback, rights, and package-size policy are accepted.",
      requiredGates: [
        "Upload intake record accepted",
        "Upload review decision accepted",
        "Caption or transcript review",
        "Poster image review",
        "Streaming/local bundle policy",
        "Fallback playback plan",
      ],
      blockedBy: ["Local bundle promotion blocked", "Caption/transcript review missing", "Poster review missing", "Package size budget missing"],
      allowedPreviewActions: ["Preview video playlist slot", "Check caption requirement", "Estimate local bundle size impact"],
      notAllowedYet: ["Video-only progression", "Uncaptioned production video", "Local bundle file without release gate"],
      storageRequiredBeforeLive: ["media_manifest", "local_bundle_manifest", "local_companion_release_gate", "upload_review_decision"],
      nextStorageContract: "Local/media promotion record before live video upload promotion.",
    },
  ],
};
