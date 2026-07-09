export type SourceReviewStatus = "received" | "triage" | "needs-owner" | "ready-for-extraction" | "blocked";
export type SourceReviewKind = "textbook-pdf" | "curriculum-docx" | "media-audio" | "media-video" | "teacher-notes";

export interface SourceReviewItem {
  sourceId: string;
  tenantId: string;
  tenantName: string;
  kind: SourceReviewKind;
  label: string;
  status: SourceReviewStatus;
  owner: "tenant" | "platform" | "teacher" | "rights-review";
  targetPackageId: string;
  sourceReference: string;
  extractionPlan: string;
  reviewNeeds: string[];
  blockedBy: string[];
  outputCandidate: string;
}

export interface SourceReviewQueue {
  queueId: string;
  label: string;
  summary: string;
  hardRules: string[];
  items: SourceReviewItem[];
}

export const sampleSourceReviewQueue: SourceReviewQueue = {
  queueId: "first-pilot-source-review-queue",
  label: "First pilot source review queue",
  summary:
    "A review-first handoff lane for PDF, DOCX, audio, video, and teacher notes before they become canonical unit payloads, media manifests, QR targets, or student-facing game content.",
  hardRules: [
    "Original source files are preserved and never overwritten by generated package data.",
    "AI extraction can propose structure, but a reviewed package release is the only student-facing source of truth.",
    "Media files require rights/ownership notes before pilot assignment.",
    "Support-language text is reviewed content support only and cannot unlock progression by itself.",
    "Every source item must map to a package, route, media manifest, or teacher-only note before release.",
  ],
  items: [
    {
      sourceId: "src-ministar-master-docx",
      tenantId: "ministar",
      tenantName: "MiniStar English Lab",
      kind: "curriculum-docx",
      label: "MiniStar master curriculum DOCX",
      status: "ready-for-extraction",
      owner: "teacher",
      targetPackageId: "ministar-l1-u1-greetings-package",
      sourceReference: "MINISTAR ENGLISH 8 LEVELS x 40 UNITS.docx",
      extractionPlan:
        "Extract canonical level/unit theme, 8 default vocabulary terms, 2 sentence patterns, teacher launch copy, and assist-language review needs.",
      reviewNeeds: [
        "Confirm the extracted vocabulary is the canonical unit vocabulary.",
        "Confirm target sentences remain age-appropriate.",
        "Confirm Japanese support text uses hiragana for Foundation/Bronze/Plus levels.",
      ],
      blockedBy: [],
      outputCandidate: "Reviewed unit payload plus teacher launch protocol.",
    },
    {
      sourceId: "src-sample-publisher-unit-pdf",
      tenantId: "sample-publisher",
      tenantName: "Sample Publisher Lab",
      kind: "textbook-pdf",
      label: "Partner textbook sample unit PDF",
      status: "triage",
      owner: "platform",
      targetPackageId: "sample-publisher-l1-u1-routines-package",
      sourceReference: "Partner Textbook Sample Unit.pdf",
      extractionPlan:
        "Create a reviewed unit shell with page/unit/activity metadata, candidate vocabulary, sentence patterns, media callouts, and stable QR aliases.",
      reviewNeeds: [
        "Confirm page references and activity ids.",
        "Confirm what is textbook content versus teacher-only guidance.",
        "Confirm whether music/video assets are owned, licensed, or partner-provided.",
      ],
      blockedBy: ["Real source PDF must be supplied for production pilot."],
      outputCandidate: "White-label package draft with route and media manifest candidates.",
    },
    {
      sourceId: "src-sample-publisher-audio-folder",
      tenantId: "sample-publisher",
      tenantName: "Sample Publisher Lab",
      kind: "media-audio",
      label: "Unit audio and chant folder",
      status: "needs-owner",
      owner: "rights-review",
      targetPackageId: "sample-publisher-l1-u1-routines-package",
      sourceReference: "Unit 1 audio folder",
      extractionPlan:
        "Index audio tracks by unit/activity, identify text support cues, and mark which tracks may be optional background media during games.",
      reviewNeeds: [
        "Confirm rights owner and classroom/pilot usage permission.",
        "Confirm which audio is instruction, vocabulary, sentence, chant, or background.",
        "Confirm fallback text-to-speech plan if a track is missing.",
      ],
      blockedBy: ["Rights proof and real files are not present in the scaffold."],
      outputCandidate: "Media manifest entries plus optional game-background media settings.",
    },
    {
      sourceId: "src-sample-publisher-video-folder",
      tenantId: "sample-publisher",
      tenantName: "Sample Publisher Lab",
      kind: "media-video",
      label: "Unit video folder",
      status: "needs-owner",
      owner: "rights-review",
      targetPackageId: "sample-publisher-l1-u1-routines-package",
      sourceReference: "Unit 1 video folder",
      extractionPlan:
        "Index videos by unit/activity, poster image, classroom use case, offline bundle size, and QR target eligibility.",
      reviewNeeds: [
        "Confirm rights owner and distribution limit.",
        "Confirm whether video is teacher-led, student self-play, or optional review.",
        "Confirm local/offline delivery requirements.",
      ],
      blockedBy: ["Rights proof and bundle strategy are unresolved."],
      outputCandidate: "Video manifest entries plus route registry candidates.",
    },
  ],
};

export function countSourceReviewItemsByStatus(queue: SourceReviewQueue, status: SourceReviewStatus): number {
  return queue.items.filter((item) => item.status === status).length;
}
