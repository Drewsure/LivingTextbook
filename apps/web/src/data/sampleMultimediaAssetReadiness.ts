export type MultimediaAssetStatus = "blocked-preview" | "planned";

export interface MultimediaAssetLane {
  laneId: string;
  label: string;
  targetRecord: string;
  detail: string;
}

export interface MultimediaAssetGate {
  gateId: string;
  label: string;
  status: MultimediaAssetStatus;
  detail: string;
}

export interface MultimediaAssetReadinessPlan {
  planId: string;
  label: string;
  summary: string;
  manifestShape: string[];
  lanes: MultimediaAssetLane[];
  gates: MultimediaAssetGate[];
  blockedShortcuts: string[];
  storageNames: string[];
}

export const sampleMultimediaAssetReadinessPlan: MultimediaAssetReadinessPlan = {
  planId: "foundation-multimedia-asset-readiness",
  label: "Multimedia asset readiness",
  summary:
    "Target asset preview for uploaded audio, music, video, posters, captions, playlists, game background media, and local bundle media. This defines review and storage expectations before media uploads can become active unit assets.",
  manifestShape: [
    "media_manifest",
    "media_playlist_binding",
    "background_media_policy_binding",
    "local_media_bundle_entry",
    "Asset id, tenant id, source upload id, source lineage, rights proof, checksum, duration, language, captions, poster, playback role, review status, release gate status",
    "Learning audio separation",
    "Optional playback required",
    "Captions or transcript required",
    "Background media cannot override learning audio",
    "No media-only progress",
  ],
  lanes: [
    {
      laneId: "term-sentence-audio",
      label: "Learner audio cues",
      targetRecord: "media_manifest",
      detail:
        "Vocabulary, sentence, and instruction audio remain reviewed learning assets; they can support progress only when tied to target-language text and accepted game events.",
    },
    {
      laneId: "music-playlist",
      label: "Music and chant playlists",
      targetRecord: "media_playlist_binding",
      detail:
        "Songs, chants, and music videos can enrich a unit or playlist, but listening alone cannot mark mastery or unlock the next game.",
    },
    {
      laneId: "lesson-video",
      label: "Lesson video and poster",
      targetRecord: "media_manifest",
      detail:
        "Videos need poster, caption/transcript, fallback activity, rights, and optional playback rules before they can appear in a unit.",
    },
    {
      laneId: "game-background-media",
      label: "Game background media",
      targetRecord: "background_media_policy_binding",
      detail:
        "Background music or video can be attached to a game only when teacher controls, mute/duck behavior, and learning-audio priority are preserved.",
    },
    {
      laneId: "local-bundle-media",
      label: "Local bundle media",
      targetRecord: "local_media_bundle_entry",
      detail:
        "Closed textbook packages need checksums, rights proof, relative paths, and update rules so media survives local installation without becoming active by folder placement.",
    },
  ],
  gates: [
    {
      gateId: "rights-gate",
      label: "Media rights proof required",
      status: "blocked-preview",
      detail: "Uploaded audio, music, video, captions, posters, and backgrounds remain blocked until rights and usage scope are reviewed.",
    },
    {
      gateId: "learning-audio-gate",
      label: "Learning audio separation required",
      status: "blocked-preview",
      detail: "Music and video cannot replace required term, sentence, instruction, or label audio for young learners.",
    },
    {
      gateId: "caption-fallback-gate",
      label: "Caption and fallback required",
      status: "blocked-preview",
      detail: "Video assets need captions or transcript policy and a non-video fallback so progress does not depend on passive watching.",
    },
    {
      gateId: "background-priority-gate",
      label: "Background media policy required",
      status: "blocked-preview",
      detail: "Background media must pause, duck, or mute for tap-to-speak and other learner-critical audio.",
    },
    {
      gateId: "local-bundle-gate",
      label: "Local bundle checksum required",
      status: "blocked-preview",
      detail: "Closed/local deployments need checksums, relative paths, update rules, and release-gate state before handoff.",
    },
  ],
  blockedShortcuts: [
    "No media-only progress",
    "No background music overriding learning audio",
    "No required progress through video only",
    "No unlicensed media",
    "No raw learner audio storage",
    "No automatic transcode-to-publish",
    "No local folder activation",
  ],
  storageNames: ["media_manifest", "media_playlist_binding", "background_media_policy_binding", "local_media_bundle_entry"],
};
