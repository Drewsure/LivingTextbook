export type UploadReviewQueueStatus = "blocked-preview" | "needs-review" | "ready-preview";
export type UploadReviewDecisionStatus = "preview-only" | "blocked";

export interface UploadReviewDecisionOption {
  optionId: string;
  label: string;
  status: UploadReviewDecisionStatus;
  detail: string;
}

export interface UploadReviewQueueItem {
  uploadId: string;
  label: string;
  channelId: string;
  fileKind: "pdf-text" | "image" | "audio-music" | "video";
  targetLabel: string;
  status: UploadReviewQueueStatus;
  sourceLineage: string;
  requiredPackets: string[];
  blockedBy: string[];
  allowedPreviewActions: string[];
  notAllowedYet: string[];
  decisionOptions: UploadReviewDecisionOption[];
  nextStep: string;
}

export interface UploadReviewQueue {
  queueId: string;
  label: string;
  summary: string;
  hardRules: string[];
  items: UploadReviewQueueItem[];
}

export const sampleUploadReviewQueue: UploadReviewQueue = {
  queueId: "foundation-upload-review-queue-preview",
  label: "Upload review queue",
  summary:
    "Review queue preview for files that have entered upload intake but are not yet approved for drafts, games, media playlists, local bundles, or student assignment.",
  hardRules: [
    "Student-facing use blocked until source lineage, rights proof, scan and file policy, target mapping, and release gates pass.",
    "No direct game assignment from an upload queue item.",
    "No automatic PDF-to-game publish from extracted textbook source.",
    "No uploaded media as mastery trigger; audio, music, and video can enrich a unit only after policy review.",
  ],
  items: [
    {
      uploadId: "upload-review-pdf-text-l1-u1",
      label: "PDF/text source review",
      channelId: "source-pdf-text-upload",
      fileKind: "pdf-text",
      targetLabel: "Teacher source draft",
      status: "needs-review",
      sourceLineage: "Sample Publisher / Starter English / Level 1 / Unit 1 / source revision 0.1",
      requiredPackets: [
        "Source lineage packet",
        "Scan and file policy packet",
        "Target mapping packet",
        "Rights proof packet",
      ],
      blockedBy: ["OCR quality review", "Unit segmentation review", "Human source approval"],
      allowedPreviewActions: ["Inspect extracted text", "Preview draft package mapping", "Flag missing pages"],
      notAllowedYet: ["Automatic PDF-to-game publish", "Student assignment", "Package approval"],
      decisionOptions: [
        {
          optionId: "approve-pdf-for-draft",
          label: "Approve for draft",
          status: "preview-only",
          detail: "Would allow a reviewed draft package candidate after storage, identity, and audit trail gates exist.",
        },
        {
          optionId: "return-pdf-for-replacement",
          label: "Return for replacement",
          status: "blocked",
          detail: "Needs live messaging, owner identity, and replacement upload storage before use.",
        },
      ],
      nextStep: "Keep as source draft candidate until reviewer identity and handoff storage are live.",
    },
    {
      uploadId: "upload-review-labelled-diagram-image-l1-u1",
      label: "Labelled Diagram image review",
      channelId: "labelled-diagram-image-upload",
      fileKind: "image",
      targetLabel: "Labelled Diagram game mode",
      status: "blocked-preview",
      sourceLineage: "MiniStar / Level 1 / Classroom objects / image asset candidate",
      requiredPackets: [
        "Source lineage packet",
        "Rights proof packet",
        "Scan and file policy packet",
        "Target mapping packet",
      ],
      blockedBy: ["Image safety review", "Alt text review", "Label anchor editor", "Game accessibility review"],
      allowedPreviewActions: ["Inspect image metadata", "Preview target game mode", "List required label anchors"],
      notAllowedYet: ["Student-facing use blocked", "No direct game assignment", "Unreviewed image labels"],
      decisionOptions: [
        {
          optionId: "ready-for-asset-review",
          label: "Ready for asset review",
          status: "preview-only",
          detail: "Would move to an asset-review lane only after storage, rights evidence, and anchor data exist.",
        },
        {
          optionId: "needs-rights-proof-image",
          label: "Needs rights proof",
          status: "blocked",
          detail: "Cannot be used in games, printables, hosted bundles, or local bundles without rights evidence.",
        },
      ],
      nextStep: "Define image asset review and label-anchor storage before building live Labelled Diagram uploads.",
    },
    {
      uploadId: "upload-review-audio-music-l1-u1",
      label: "Audio/music rights review",
      channelId: "audio-music-upload",
      fileKind: "audio-music",
      targetLabel: "Unit playlist and optional game-background media",
      status: "needs-review",
      sourceLineage: "MiniStar / Level 1 / Unit 1 / greetings chant / music revision 0.1",
      requiredPackets: [
        "Source lineage packet",
        "Rights proof packet",
        "Scan and file policy packet",
        "Target mapping packet",
      ],
      blockedBy: ["Playback rights proof", "Background media policy", "Transcript or lyric policy", "Teacher toggle persistence"],
      allowedPreviewActions: ["Preview playlist placement", "Check background-media policy", "Separate learning audio from music"],
      notAllowedYet: ["Music as mastery trigger", "Autoplay without teacher policy", "Raw learner audio in upload storage"],
      decisionOptions: [
        {
          optionId: "approve-audio-for-draft",
          label: "Approve for draft",
          status: "preview-only",
          detail: "Would allow draft playlist placement while keeping required term, sentence, and instruction audio separate.",
        },
        {
          optionId: "needs-rights-proof-audio",
          label: "Needs rights proof",
          status: "blocked",
          detail: "Cannot ship in hosted or local packages without rights and playback terms.",
        },
      ],
      nextStep: "Add media asset review storage before live audio/music upload processing.",
    },
    {
      uploadId: "upload-review-video-l1-u1",
      label: "Video/caption review",
      channelId: "video-upload",
      fileKind: "video",
      targetLabel: "Unit video playlist and local bundle candidate",
      status: "blocked-preview",
      sourceLineage: "Sample Publisher / Starter English / Level 1 / Unit 1 / video asset candidate",
      requiredPackets: [
        "Source lineage packet",
        "Rights proof packet",
        "Scan and file policy packet",
        "Target mapping packet",
      ],
      blockedBy: ["Caption or transcript review", "Poster image review", "Streaming/local bundle policy", "Fallback playback plan"],
      allowedPreviewActions: ["Preview playlist slot", "Inspect caption requirement", "Check local bundle size policy"],
      notAllowedYet: ["Required progress through video only", "Uncaptioned production video", "Video without fallback"],
      decisionOptions: [
        {
          optionId: "ready-video-for-asset-review",
          label: "Ready for asset review",
          status: "preview-only",
          detail: "Would move into asset review after captions, poster, rights, and distribution policy are recorded.",
        },
        {
          optionId: "return-video-for-replacement",
          label: "Return for replacement",
          status: "blocked",
          detail: "Needs live owner messaging and replacement file tracking before use.",
        },
      ],
      nextStep: "Keep video optional to the unit until caption, fallback, and package rights contracts exist.",
    },
  ],
};

export function countUploadReviewItemsByStatus(queue: UploadReviewQueue, status: UploadReviewQueueStatus) {
  return queue.items.filter((item) => item.status === status).length;
}
