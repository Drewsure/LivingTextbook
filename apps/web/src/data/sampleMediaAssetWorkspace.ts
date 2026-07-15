export type MediaAssetWorkspaceStatus = "teacher-review-only" | "blocked";

export interface MediaAssetBindingPreview {
  bindingId: string;
  label: string;
  targetRecord: string;
  policy: string;
}

export interface MediaAssetWorkspace {
  workspaceId: string;
  tenantId: string;
  label: string;
  status: MediaAssetWorkspaceStatus;
  summary: string;
  sourceUpload: {
    uploadId: string;
    sourceLabel: string;
    targetMappingPacket: string;
    rightsStatus: string;
  };
  manifestPreview: string[];
  bindings: MediaAssetBindingPreview[];
  requiredPackets: string[];
  blockedActions: string[];
  relatedRoutes: Array<{ label: string; href: string }>;
}

export const sampleMediaAssetWorkspace: MediaAssetWorkspace = {
  workspaceId: "sample-publisher-l1-u1-routines-media",
  tenantId: "sample-publisher",
  label: "Media asset workspace",
  status: "teacher-review-only",
  summary:
    "Teacher-only media review surface for a future audio, music, video, playlist, background-media, or local-bundle asset. It keeps optional playback, learning-audio priority, captions, rights, checksums, and route boundaries visible before live media upload tools exist.",
  sourceUpload: {
    uploadId: "upload-review-audio-music-l1-u1",
    sourceLabel: "Daily routines chant and video upload",
    targetMappingPacket: "target_mapping_packet",
    rightsStatus: "needs rights proof before hosted or local pilot use",
  },
  manifestPreview: [
    "media_manifest",
    "media_asset_id",
    "checksum capture",
    "duration and language metadata",
    "captions or transcript policy",
    "poster or fallback required",
    "optional_playback_required: true",
  ],
  bindings: [
    {
      bindingId: "playlist-binding",
      label: "Unit playlist binding",
      targetRecord: "media_playlist_binding",
      policy: "No media-only progress",
    },
    {
      bindingId: "background-policy",
      label: "Game background media policy",
      targetRecord: "background_media_policy_binding",
      policy: "Learning audio priority required",
    },
    {
      bindingId: "local-bundle-entry",
      label: "Closed/local bundle entry",
      targetRecord: "local_media_bundle_entry",
      policy: "Checksum and relative path required",
    },
  ],
  requiredPackets: [
    "target_mapping_packet",
    "rights_proof_packet",
    "scan_and_file_policy_packet",
    "media_manifest",
    "media_playlist_binding",
    "background_media_policy_binding",
    "local_media_bundle_entry",
  ],
  blockedActions: [
    "No live media upload",
    "No automatic transcode-to-publish",
    "No media-only progress",
    "No background music overriding learning audio",
    "No required progress through video only",
    "No local folder activation",
    "No playlist route from uploaded media",
  ],
  relatedRoutes: [
    { label: "Media library", href: "/teacher/media/sample-publisher" },
    { label: "Upload workspace", href: "/teacher/uploads/sample-publisher" },
    { label: "Student playlist preview", href: "/media/playlist-sample-publisher-l1-u1-routines" },
  ],
};

export function findMediaAssetWorkspace(workspaceId: string): MediaAssetWorkspace | undefined {
  return sampleMediaAssetWorkspace.workspaceId === workspaceId ? sampleMediaAssetWorkspace : undefined;
}
