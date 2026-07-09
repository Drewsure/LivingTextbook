export type AuthoringVerifierStageStatus = "ready" | "needs-review" | "blocked" | "deferred";
export type AuthoringVerifierStageOwner = "ai-draft" | "schema-verifier" | "teacher" | "rights-review" | "platform";

export interface AuthoringVerifierStage {
  stageId: string;
  label: string;
  owner: AuthoringVerifierStageOwner;
  status: AuthoringVerifierStageStatus;
  purpose: string;
  accepts: string[];
  rejects: string[];
  output: string;
}

export interface AuthoringVerifierPlan {
  planId: string;
  label: string;
  summary: string;
  releaseRule: string;
  stages: AuthoringVerifierStage[];
}

export const sampleAuthoringVerifierPlan: AuthoringVerifierPlan = {
  planId: "first-pilot-authoring-verifier-handoff",
  label: "AI authoring and verifier handoff",
  summary:
    "A controlled handoff from source extraction to reviewed unit package data. AI may draft structure, but schema checks, audio coverage checks, media rights checks, support-language review, and teacher approval decide whether the package can move forward.",
  releaseRule:
    "No AI draft, PDF extraction, translation, visual prompt, or media match becomes student-facing until the verifier and teacher review gates are complete.",
  stages: [
    {
      stageId: "stage-source-draft",
      label: "Draft from reviewed source item",
      owner: "ai-draft",
      status: "needs-review",
      purpose:
        "Turn a source queue item into a proposed unit shell with vocabulary, sentence patterns, teacher launch copy, media references, and route candidates.",
      accepts: ["Source queue item", "Tenant id", "Target package id", "Level/unit metadata"],
      rejects: ["Unmapped raw PDF pages", "Unowned media files", "Open-ended student chat prompts"],
      output: "Draft unit payload for schema verification.",
    },
    {
      stageId: "stage-schema-check",
      label: "Schema and pedagogy check",
      owner: "schema-verifier",
      status: "ready",
      purpose:
        "Confirm the payload follows the Living Textbook contract: 8-12 terms, exactly 2 target sentence patterns, valid level, valid game modes, and tenant boundaries.",
      accepts: ["8-12 vocabulary terms", "2 sentence patterns", "Valid game family/mode", "Tenant-safe package metadata"],
      rejects: ["Too many terms", "Missing sentence patterns", "Unknown game mode", "Cross-tenant references"],
      output: "Verifier pass/fail with required corrections.",
    },
    {
      stageId: "stage-audio-support",
      label: "Learner audio coverage check",
      owner: "schema-verifier",
      status: "ready",
      purpose:
        "Ensure vocabulary, sentence prompts, instructions, feedback, and critical controls have audio cue coverage or an approved fallback.",
      accepts: ["Audio cue ids", "Recorded partner audio", "Teacher audio", "Approved text-to-speech fallback"],
      rejects: ["Silent learner instructions", "Text-only early learner controls", "Autoplay-only dependency"],
      output: "Audio coverage report.",
    },
    {
      stageId: "stage-assist-language",
      label: "Assist-language review",
      owner: "teacher",
      status: "needs-review",
      purpose:
        "Review support-language text as learning support only. It cannot trigger progression, unlock games, or replace English target-language actions.",
      accepts: ["Reviewed support text", "Level-appropriate Japanese script rules", "Live AI fallback disabled unless tenant-approved"],
      rejects: ["Support language as progression trigger", "Unreviewed live translation", "Foundation/Bronze/Plus kanji-heavy Japanese"],
      output: "Reviewed assist-language package data.",
    },
    {
      stageId: "stage-media-rights",
      label: "Media rights and manifest check",
      owner: "rights-review",
      status: "blocked",
      purpose:
        "Confirm audio/video files, thumbnails, playlists, and optional background media are owned, licensed, or partner-provided before release.",
      accepts: ["Rights owner", "Usage scope", "Offline bundle permission", "Replacement/fallback plan"],
      rejects: ["Unknown ownership", "Placeholder-only production media", "Unclear local distribution permission"],
      output: "Release-ready media manifest or blocked media report.",
    },
    {
      stageId: "stage-teacher-release",
      label: "Teacher/package approval",
      owner: "teacher",
      status: "deferred",
      purpose:
        "Final human approval that a package is instructionally accurate, safe, route-ready, audio-supported, and assignable.",
      accepts: ["Verifier pass", "Media rights pass", "Teacher sign-off", "Package release notes"],
      rejects: ["Unreviewed AI draft", "Unresolved blockers", "Missing route or audio coverage"],
      output: "Reviewed package release candidate.",
    },
  ],
};

export function countAuthoringVerifierStagesByStatus(
  plan: AuthoringVerifierPlan,
  status: AuthoringVerifierStageStatus,
): number {
  return plan.stages.filter((stage) => stage.status === status).length;
}
