export type UploadChannelKind = "source-file" | "game-asset" | "media-asset";
export type UploadChannelStatus = "planned" | "blocked-preview" | "policy-required";

export interface UploadChannelRequirement {
  requirementId: string;
  label: string;
  status: "required" | "blocked" | "future";
  detail: string;
}

export interface UploadChannelTarget {
  targetId: string;
  label: string;
  targetType: "unit-source" | "game-mode" | "media-playlist" | "local-bundle";
  requiredReview: string[];
}

export interface UploadChannel {
  channelId: string;
  label: string;
  kind: UploadChannelKind;
  status: UploadChannelStatus;
  acceptedTypes: string[];
  maxFilePolicy: string;
  targets: UploadChannelTarget[];
  requirements: UploadChannelRequirement[];
  blockedBy: string[];
  notAllowedYet: string[];
}

export interface UploadChannelReadinessPlan {
  planId: string;
  label: string;
  summary: string;
  foundationRule: string;
  channels: UploadChannel[];
}

export const sampleUploadChannelReadinessPlan: UploadChannelReadinessPlan = {
  planId: "foundation-upload-channel-readiness",
  label: "Upload channel readiness",
  summary:
    "Foundation map for controlled uploads of PDFs, text, images, audio, music, and video before they can become reviewed unit sources, game assets, media playlists, or local bundle files.",
  foundationRule:
    "Uploads are intake records first. No uploaded file becomes student-facing until source lineage, rights, scan/size/type policy, review status, audio coverage, route mapping, and package release gates pass.",
  channels: [
    {
      channelId: "source-pdf-text-upload",
      label: "PDF and text source intake",
      kind: "source-file",
      status: "planned",
      acceptedTypes: ["pdf", "docx", "txt", "md", "csv"],
      maxFilePolicy: "Per-tenant size limit required before live upload; large textbooks should become reviewed package drafts, not direct student payloads.",
      targets: [
        {
          targetId: "unit-source-draft",
          label: "Teacher source draft",
          targetType: "unit-source",
          requiredReview: ["Text extraction review", "Unit segmentation review", "No automatic student publish"],
        },
      ],
      requirements: [
        {
          requirementId: "source-lineage",
          label: "Source lineage required",
          status: "required",
          detail: "Every source upload must preserve owner, tenant, edition, unit, revision, and extracted text lineage.",
        },
        {
          requirementId: "human-review",
          label: "Human review required",
          status: "required",
          detail: "PDF/text extraction may create drafts only; it cannot create student-facing games or assignments automatically.",
        },
      ],
      blockedBy: ["Durable upload record required", "File scan policy required", "Source review workflow required"],
      notAllowedYet: ["Automatic PDF-to-game publish", "Raw PDF as student payload", "Unreviewed OCR text assignment"],
    },
    {
      channelId: "labelled-diagram-image-upload",
      label: "Image upload for Labelled Diagram",
      kind: "game-asset",
      status: "blocked-preview",
      acceptedTypes: ["jpg", "jpeg", "png", "webp", "svg"],
      maxFilePolicy: "Image dimensions, compression, alt text, and classroom-safe content checks required before pilot use.",
      targets: [
        {
          targetId: "labelled-diagram-mode",
          label: "Labelled Diagram game mode",
          targetType: "game-mode",
          requiredReview: ["Image rights review", "Alt text review", "Label anchor review", "Game accessibility review"],
        },
      ],
      requirements: [
        {
          requirementId: "image-rights",
          label: "Image rights required",
          status: "required",
          detail: "Teacher or publisher must confirm ownership or license for student playback, print, and local/offline bundle use.",
        },
        {
          requirementId: "label-anchor-review",
          label: "Label anchors required",
          status: "blocked",
          detail: "Image upload must include reviewed label anchor data before a Labelled Diagram game can be assigned.",
        },
      ],
      blockedBy: ["Asset storage required", "Image safety review required", "Label anchor editor required"],
      notAllowedYet: ["Student-facing image upload", "Unreviewed image labels", "Image use without rights proof"],
    },
    {
      channelId: "audio-music-upload",
      label: "Audio and music upload",
      kind: "media-asset",
      status: "policy-required",
      acceptedTypes: ["mp3", "wav", "m4a", "ogg"],
      maxFilePolicy: "Audio duration, file size, transcript/lyrics policy, background-loop rules, and local bundle rights required before production use.",
      targets: [
        {
          targetId: "unit-playlist",
          label: "Unit media playlist",
          targetType: "media-playlist",
          requiredReview: ["Playback rights", "Background media policy", "Learner-critical audio fallback"],
        },
        {
          targetId: "game-background-audio",
          label: "Optional game background media",
          targetType: "game-mode",
          requiredReview: ["Teacher toggle", "No mastery effect", "Volume and mute controls"],
        },
      ],
      requirements: [
        {
          requirementId: "learner-audio-separation",
          label: "Learning audio separation",
          status: "required",
          detail: "Uploaded songs can enrich a unit, but learner-critical term, sentence, and instruction audio must remain separately reviewable.",
        },
        {
          requirementId: "background-toggle",
          label: "Background media toggle",
          status: "required",
          detail: "Teacher must be able to disable background music without disabling required tap-to-speak learning audio.",
        },
      ],
      blockedBy: ["Rights proof required", "Audio storage required", "Teacher media toggle persistence required"],
      notAllowedYet: ["Music as mastery trigger", "Autoplay without teacher policy", "Raw learner audio in core storage"],
    },
    {
      channelId: "video-upload",
      label: "Video upload",
      kind: "media-asset",
      status: "policy-required",
      acceptedTypes: ["mp4", "webm", "mov"],
      maxFilePolicy: "Video size, poster, captions, transcript, streaming/local bundle policy, and rights proof required before pilot use.",
      targets: [
        {
          targetId: "unit-video-playlist",
          label: "Unit video playlist",
          targetType: "media-playlist",
          requiredReview: ["Video rights", "Captions/transcript", "Poster image", "Optional playback fallback"],
        },
        {
          targetId: "local-video-bundle",
          label: "Closed/local companion bundle",
          targetType: "local-bundle",
          requiredReview: ["Offline distribution rights", "Checksum manifest", "Storage size budget"],
        },
      ],
      requirements: [
        {
          requirementId: "captions-transcript",
          label: "Captions or transcript required",
          status: "required",
          detail: "Video needs accessibility and teacher-review support before student playback.",
        },
        {
          requirementId: "optional-playback",
          label: "Optional playback required",
          status: "required",
          detail: "Games and required learning audio must still function if the video is unavailable or blocked.",
        },
      ],
      blockedBy: ["Video storage required", "Rights proof required", "Caption/transcript policy required"],
      notAllowedYet: ["Required progress through video only", "Uncaptioned production video", "Video without fallback"],
    },
  ],
};
