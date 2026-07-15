export type UploadTargetMappingStatus = "blocked-preview" | "planned";
export type UploadTargetKind = "draft-package" | "game-asset" | "media-playlist" | "local-bundle";

export interface UploadTargetMappingLane {
  mappingId: string;
  label: string;
  sourceChannelId: string;
  targetKind: UploadTargetKind;
  status: UploadTargetMappingStatus;
  targetRecord: string;
  routePreview: string;
  requiredEvidence: string[];
  allowedPreviewActions: string[];
  blockedShortcuts: string[];
  nextGate: string;
}

export interface UploadTargetMappingPlan {
  planId: string;
  label: string;
  summary: string;
  hardRules: string[];
  lanes: UploadTargetMappingLane[];
}

export const sampleUploadTargetMappingPlan: UploadTargetMappingPlan = {
  planId: "foundation-upload-target-mapping",
  label: "Upload target mapping preview",
  summary:
    "Source-to-target mapping for future uploads. This shows how an upload may later point toward a draft package, Labelled Diagram game asset, media playlist, background-media policy, or local bundle without creating those student-facing targets yet.",
  hardRules: [
    "target_mapping_packet required before any upload promotion.",
    "No route created directly from an uploaded file.",
    "No uploaded file can become a student assignment target.",
    "No upload-to-assignment shortcut.",
    "No folder placement activation for local bundles.",
    "No target activation without activity compatibility, rights, audio, and release gates.",
  ],
  lanes: [
    {
      mappingId: "mapping-pdf-text-to-draft-package",
      label: "PDF/text to teacher draft package",
      sourceChannelId: "source-pdf-text-upload",
      targetKind: "draft-package",
      status: "blocked-preview",
      targetRecord: "teacher_draft_package",
      routePreview: "/teacher/authoring/draft-sample-publisher-l1-u1",
      requiredEvidence: [
        "target_mapping_packet",
        "source_lineage_packet",
        "OCR and unit segmentation review",
        "activity_compatibility_snapshot",
      ],
      allowedPreviewActions: ["Preview draft outline", "List missing audio coverage", "Map source pages to unit sections"],
      blockedShortcuts: ["No automatic PDF-to-game publish", "No direct assignment", "No unreviewed AI draft promotion"],
      nextGate: "Persist target_mapping_packet before OCR-to-draft workflows are connected.",
    },
    {
      mappingId: "mapping-image-to-labelled-diagram",
      label: "Image to Labelled Diagram game asset",
      sourceChannelId: "labelled-diagram-image-upload",
      targetKind: "game-asset",
      status: "blocked-preview",
      targetRecord: "game_asset_manifest",
      routePreview: "No student-facing Labelled Diagram route yet",
      requiredEvidence: [
        "target_mapping_packet",
        "game_asset_manifest",
        "label_anchor_record",
        "font_accessibility_profile",
      ],
      allowedPreviewActions: ["Preview required anchors", "List target-language labels", "Check alt text and touch target policy"],
      blockedShortcuts: ["No student-facing image game", "No auto-generated labels", "No support-language progress trigger"],
      nextGate: "Persist game asset and label anchor records before any image game route is active.",
    },
    {
      mappingId: "mapping-audio-music-to-playlist",
      label: "Audio/music to playlist or background policy",
      sourceChannelId: "audio-music-upload",
      targetKind: "media-playlist",
      status: "blocked-preview",
      targetRecord: "media_playlist_binding",
      routePreview: "/media/playlist-sample-publisher-l1-u1-routines",
      requiredEvidence: [
        "target_mapping_packet",
        "media_manifest",
        "media_playlist_binding",
        "background_media_policy_binding",
      ],
      allowedPreviewActions: ["Preview playlist slot", "Check background-media policy", "Separate learning audio from music"],
      blockedShortcuts: ["No music as mastery trigger", "No autoplay without teacher policy", "No background media overriding learning audio"],
      nextGate: "Persist playlist and background-media policy bindings before live media upload promotion.",
    },
    {
      mappingId: "mapping-video-to-local-bundle",
      label: "Video to playlist or local bundle",
      sourceChannelId: "video-upload",
      targetKind: "local-bundle",
      status: "blocked-preview",
      targetRecord: "local_media_bundle_entry",
      routePreview: "/local/sample-publisher",
      requiredEvidence: [
        "target_mapping_packet",
        "media_manifest",
        "caption_or_transcript_packet",
        "local_media_bundle_entry",
      ],
      allowedPreviewActions: ["Preview optional video slot", "Check caption requirement", "List local bundle checksum requirement"],
      blockedShortcuts: ["No video-only progress", "No uncaptioned production video", "No local folder activation"],
      nextGate: "Persist media manifest and local bundle entry before local package media activation.",
    },
  ],
};
