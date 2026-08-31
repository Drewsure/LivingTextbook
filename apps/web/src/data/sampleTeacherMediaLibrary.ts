import { sampleMediaRightsPlan } from "./sampleMediaRightsPlan";

export type TeacherMediaLibraryStageStatus = "preview-only" | "blocked";

export interface TeacherMediaLibraryStage {
  stageId: string;
  label: string;
  status: TeacherMediaLibraryStageStatus;
  detail: string;
}

export interface TeacherMediaLibraryPreview {
  tenantId: string;
  label: string;
  summary: string;
  assetOwnershipLabel: string;
  targetRecords: string[];
  stages: TeacherMediaLibraryStage[];
  blockedActions: string[];
}

export const sampleTeacherMediaLibraryPreviews: TeacherMediaLibraryPreview[] = [
  {
    tenantId: "ministar",
    label: "MiniStar teacher media library",
    summary:
      "Media maintenance preview for the flagship MiniStar tenant. Teachers can review Level 1 audio-first learner cues, chants, video placeholders, hiragana support notes, playlist bindings, background-media rules, and local bundle readiness before live upload or replacement tools exist.",
    assetOwnershipLabel: "MiniStar-owned assets",
    targetRecords: ["media_manifest", "media_playlist_binding", "background_media_policy_binding", "local_media_bundle_entry"],
    stages: [
      {
        stageId: "ministar-rights-proof-review",
        label: "Rights proof review",
        status: "preview-only",
        detail:
          "MiniStar media must show owner, classroom use, student playback, optional game-background, and local/offline permission before production use.",
      },
      {
        stageId: "ministar-learning-audio-review",
        label: "Learning audio priority review",
        status: "preview-only",
        detail:
          "Target-language learner cues remain required in every game; chants, videos, and support-language narration cannot replace answer, result, or mastery events.",
      },
      {
        stageId: "ministar-support-language-review",
        label: "Hiragana support review",
        status: "preview-only",
        detail:
          "Foundation, Bronze, and Plus Japanese support text must stay hiragana-only and support-only. English remains the progress trigger for MiniStar English units.",
      },
      {
        stageId: "ministar-playlist-binding-review",
        label: "Playlist binding review",
        status: "preview-only",
        detail:
          "Songs, chants, and videos can be attached to unit playlists only after optional playback and non-mastery policy are preserved.",
      },
      {
        stageId: "ministar-background-media-review",
        label: "Background media policy review",
        status: "preview-only",
        detail: "Game background media needs teacher controls and must pause, duck, or mute when learning audio plays.",
      },
      {
        stageId: "ministar-local-bundle-review",
        label: "Local bundle media review",
        status: "preview-only",
        detail:
          "Closed packages need checksums, relative paths, rights proof, update rules, and release gates before local activation.",
      },
      {
        stageId: "ministar-live-upload-block",
        label: "Upload still blocked",
        status: "blocked",
        detail: "This preview does not upload, transcode, store, replace, publish, or activate media files.",
      },
    ],
    blockedActions: [
      "No live media upload",
      "No automatic transcode-to-publish",
      "No media-only progress",
      "No background music overriding learning audio",
      "No required progress through video only",
      "No Japanese support-language unlock",
      "Local folder activation blocked",
    ],
  },
  {
    tenantId: "sample-publisher",
    label: "Teacher media library",
    summary:
      "Media maintenance preview for a white-label textbook companion. Teachers and publisher owners can review audio, music, video, poster, playlist, background-media, and local bundle readiness before live upload tools exist.",
    assetOwnershipLabel: "Partner-owned assets",
    targetRecords: ["media_manifest", "media_playlist_binding", "background_media_policy_binding", "local_media_bundle_entry"],
    stages: [
      {
        stageId: "rights-proof-review",
        label: "Rights proof review",
        status: "preview-only",
        detail: "Publisher media must show owner, classroom use, student playback, game-background, and local/offline permission before production use.",
      },
      {
        stageId: "playlist-binding-review",
        label: "Playlist binding review",
        status: "preview-only",
        detail: "Songs, chants, and videos can be attached to unit playlists only after optional playback and non-mastery policy are preserved.",
      },
      {
        stageId: "background-media-review",
        label: "Background media policy review",
        status: "preview-only",
        detail: "Game background media needs teacher controls and must pause, duck, or mute when learning audio plays.",
      },
      {
        stageId: "local-bundle-review",
        label: "Local bundle media review",
        status: "preview-only",
        detail: "Closed packages need checksums, relative paths, rights proof, update rules, and release gates before local activation.",
      },
      {
        stageId: "live-upload-block",
        label: "Upload still blocked",
        status: "blocked",
        detail: "This preview does not upload, transcode, store, replace, publish, or activate media files.",
      },
    ],
    blockedActions: [
      "No live media upload",
      "No automatic transcode-to-publish",
      "No media-only progress",
      "No background music overriding learning audio",
      "No required progress through video only",
      "Local folder activation blocked",
    ],
  },
];

export function findTeacherMediaLibraryPreview(tenantId: string): TeacherMediaLibraryPreview | undefined {
  return sampleTeacherMediaLibraryPreviews.find((preview) => preview.tenantId === tenantId);
}

export function getTeacherMediaRightsRecords(tenantId: string) {
  return sampleMediaRightsPlan.records.filter((record) => record.tenantId === tenantId);
}
