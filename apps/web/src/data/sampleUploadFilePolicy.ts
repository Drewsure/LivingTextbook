export type UploadFilePolicyStatus = "blocked-preview" | "planned";

export interface UploadFilePolicyProfile {
  profileId: string;
  label: string;
  channelId: string;
  status: UploadFilePolicyStatus;
  acceptedExtensions: string[];
  maximums: string[];
  requiredChecks: string[];
  blockedShortcuts: string[];
  nextGate: string;
}

export interface UploadFilePolicyPlan {
  planId: string;
  label: string;
  summary: string;
  hardRules: string[];
  requiredRecords: string[];
  profiles: UploadFilePolicyProfile[];
}

export const sampleUploadFilePolicyPlan: UploadFilePolicyPlan = {
  planId: "foundation-upload-file-policy",
  label: "Upload file policy profiles",
  summary:
    "File type and size policy for future PDF/text, Labelled Diagram image, audio/music, video, and local-bundle upload controls. This is review metadata only; it does not enable file picker writes.",
  hardRules: [
    "No file picker writes until upload intake persistence and scan policy exist.",
    "Every file requires source lineage, owner, tenant, edition, and revision metadata.",
    "Every file requires MIME type validation, extension validation, checksum capture, and virus/malware scan status.",
    "No upload promotion without file policy acceptance.",
    "No uploaded file becomes student-facing until package release gates pass.",
  ],
  requiredRecords: [
    "upload_intake_asset",
    "scan_and_file_policy_packet",
    "rights_proof_packet",
    "target_mapping_packet",
    "upload_review_decision",
    "upload_promotion_gate",
  ],
  profiles: [
    {
      profileId: "policy-pdf-text-source",
      label: "PDF/text source policy",
      channelId: "source-pdf-text-upload",
      status: "planned",
      acceptedExtensions: ["pdf", "docx", "txt", "md", "csv"],
      maximums: ["Max pages per import batch required", "Max extracted text length required", "OCR quality threshold required"],
      requiredChecks: ["Source lineage review", "Text extraction review", "Unit segmentation review", "Rights proof review"],
      blockedShortcuts: ["No automatic PDF-to-game publish", "No raw PDF as student payload", "No unreviewed OCR assignment"],
      nextGate: "Persist scan_and_file_policy_packet before live PDF/text intake.",
    },
    {
      profileId: "policy-labelled-diagram-image",
      label: "Labelled Diagram image policy",
      channelId: "labelled-diagram-image-upload",
      status: "blocked-preview",
      acceptedExtensions: ["jpg", "jpeg", "png", "webp", "svg"],
      maximums: ["Max image dimensions required", "Compression budget required", "Touch-target label density required"],
      requiredChecks: ["Image safety review", "Image rights proof", "Alt text review", "Label anchor readiness review"],
      blockedShortcuts: ["No student-facing image game", "No unreviewed label anchors", "No image use without alt text"],
      nextGate: "Persist game_asset_manifest and label_anchor_record before live image uploads.",
    },
    {
      profileId: "policy-audio-music",
      label: "Audio/music policy",
      channelId: "audio-music-upload",
      status: "blocked-preview",
      acceptedExtensions: ["mp3", "wav", "m4a", "ogg"],
      maximums: ["Max duration required", "Max file size required", "Loudness and volume normalization policy required"],
      requiredChecks: ["Playback rights proof", "Transcript or lyric policy", "Background-media priority review", "Learning audio separation review"],
      blockedShortcuts: ["No music as mastery trigger", "No autoplay without teacher policy", "No raw learner audio storage"],
      nextGate: "Persist media_manifest and background_media_policy_binding before live audio/music uploads.",
    },
    {
      profileId: "policy-video-local-bundle",
      label: "Video and local-bundle policy",
      channelId: "video-upload",
      status: "blocked-preview",
      acceptedExtensions: ["mp4", "webm", "mov"],
      maximums: ["Max duration required", "Max file size required", "Poster image and caption policy required"],
      requiredChecks: ["Video rights proof", "Caption or transcript review", "Poster image review", "Local bundle checksum review"],
      blockedShortcuts: ["No video-only progress", "No uncaptioned production video", "No local folder activation"],
      nextGate: "Persist media_manifest and local_media_bundle_entry before live video or local-bundle uploads.",
    },
  ],
};
