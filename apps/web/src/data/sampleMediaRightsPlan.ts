export type MediaRightsStatus = "cleared-for-demo" | "needs-proof" | "blocked";
export type MediaRightsUseCase = "student-playback" | "teacher-preview" | "game-background" | "offline-bundle";

export interface MediaRightsRecord {
  mediaAssetId: string;
  tenantId: string;
  label: string;
  kind: "audio" | "video" | "poster" | "transcript";
  status: MediaRightsStatus;
  ownerName: string;
  sourceReference: string;
  allowedUseCases: MediaRightsUseCase[];
  missingProof: string[];
  fallbackPlan: string;
}

export interface MediaRightsPlan {
  planId: string;
  label: string;
  summary: string;
  releaseRule: string;
  records: MediaRightsRecord[];
}

export const sampleMediaRightsPlan: MediaRightsPlan = {
  planId: "first-pilot-media-rights-readiness",
  label: "Media rights readiness",
  summary:
    "Rights and ownership review for audio, video, posters, transcripts, optional background media, and local/offline bundle use.",
  releaseRule:
    "Media can appear in demos with clear placeholder messaging, but production pilots and printed QR releases require owner, use scope, local/offline permission, and fallback/replacement decisions.",
  records: [
    {
      mediaAssetId: "media-ministar-l1-u1-greetings-chant",
      tenantId: "ministar",
      label: "MiniStar Greetings Chant",
      kind: "audio",
      status: "cleared-for-demo",
      ownerName: "MiniStar sample tenant",
      sourceReference: "/media/demo/ministar/l1-u1/greetings-chant.mp3",
      allowedUseCases: ["student-playback", "teacher-preview", "game-background"],
      missingProof: ["Production file is still placeholder/missing in the scaffold.", "Offline distribution proof is not attached."],
      fallbackPlan: "Use reviewed text-to-speech cues for learner-critical audio if the chant file is unavailable.",
    },
    {
      mediaAssetId: "media-ministar-l1-u1-greetings-video",
      tenantId: "ministar",
      label: "MiniStar Hello Friends Video",
      kind: "video",
      status: "cleared-for-demo",
      ownerName: "MiniStar sample tenant",
      sourceReference: "/media/demo/ministar/l1-u1/hello-friends.mp4",
      allowedUseCases: ["student-playback", "teacher-preview"],
      missingProof: ["Production file is still placeholder/missing in the scaffold.", "Poster and transcript files need real assets."],
      fallbackPlan: "Keep video optional; games and learner audio must remain usable without it.",
    },
    {
      mediaAssetId: "media-sample-publisher-u1-morning-song",
      tenantId: "sample-publisher",
      label: "Sample Publisher Morning Song",
      kind: "audio",
      status: "needs-proof",
      ownerName: "Sample publisher owner not confirmed",
      sourceReference: "Unit 1 audio folder",
      allowedUseCases: ["teacher-preview"],
      missingProof: [
        "Rights owner not confirmed.",
        "Student playback permission not confirmed.",
        "Game background use not confirmed.",
        "Local/offline bundle permission not confirmed.",
      ],
      fallbackPlan: "Use teacher-provided replacement audio or platform-generated TTS for required learner cues.",
    },
    {
      mediaAssetId: "media-sample-publisher-u1-routine-video",
      tenantId: "sample-publisher",
      label: "Sample Publisher Routine Video",
      kind: "video",
      status: "blocked",
      ownerName: "Unknown",
      sourceReference: "Unit 1 video folder",
      allowedUseCases: [],
      missingProof: [
        "No file in repository.",
        "No owner proof.",
        "No distribution scope.",
        "No offline bundle policy.",
      ],
      fallbackPlan: "Block production video playback until partner supplies files and rights, or replace with owned/licensed media.",
    },
  ],
};

export function countMediaRightsByStatus(plan: MediaRightsPlan, status: MediaRightsStatus): number {
  return plan.records.filter((record) => record.status === status).length;
}
