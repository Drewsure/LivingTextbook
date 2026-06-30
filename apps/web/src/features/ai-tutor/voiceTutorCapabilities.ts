import type { AiTutorModeId, UnitAiTutorPlan } from "@living-textbook/content-model";

export type VoiceTutorCapabilityId =
  | "record-replay"
  | "speech-to-text"
  | "expected-text-match"
  | "pronunciation-feedback"
  | "fluency-pacing"
  | "bounded-conversation";

export type VoiceTutorBuildPhase = "ready-now" | "foundation-next" | "premium-later";

export interface VoiceTutorCapability {
  id: VoiceTutorCapabilityId;
  label: string;
  mode?: AiTutorModeId;
  buildPhase: VoiceTutorBuildPhase;
  processingPreference: "browser" | "local-first" | "server-verified" | "hybrid";
  costControl: string;
  safetyBoundary: string;
  openSourceResearch?: string;
}

export const voiceTutorCapabilityCatalog: VoiceTutorCapability[] = [
  {
    id: "record-replay",
    label: "Record and replay",
    mode: "speak-with-me",
    buildPhase: "foundation-next",
    processingPreference: "browser",
    costControl: "No model call required for the first capture/replay prototype.",
    safetyBoundary: "No raw audio persistence by default; teacher and school consent rules apply before storage.",
  },
  {
    id: "speech-to-text",
    label: "Speech to text",
    mode: "speak-with-me",
    buildPhase: "premium-later",
    processingPreference: "local-first",
    costControl: "Prefer replaceable local or metered speech providers so tenants can choose cost and privacy posture.",
    safetyBoundary: "Transcript generation must stay scoped to the assigned unit text.",
    openSourceResearch: "whisper.cpp",
  },
  {
    id: "expected-text-match",
    label: "Expected text match",
    mode: "speak-with-me",
    buildPhase: "premium-later",
    processingPreference: "hybrid",
    costControl: "Use deterministic matching before model-generated coaching.",
    safetyBoundary: "Feedback is limited to assigned vocabulary and sentence patterns.",
  },
  {
    id: "pronunciation-feedback",
    label: "Pronunciation feedback",
    mode: "speak-with-me",
    buildPhase: "premium-later",
    processingPreference: "server-verified",
    costControl: "Introduce only for premium tenants because scoring requires extra QA and speech infrastructure.",
    safetyBoundary: "Feedback must be encouraging, age-appropriate, and teacher-reviewable.",
    openSourceResearch: "Montreal Forced Aligner",
  },
  {
    id: "fluency-pacing",
    label: "Fluency and pacing",
    mode: "review-coach",
    buildPhase: "premium-later",
    processingPreference: "hybrid",
    costControl: "Start with duration and pause metrics before adding AI scoring.",
    safetyBoundary: "Do not rank children against each other; report individual practice signals only.",
  },
  {
    id: "bounded-conversation",
    label: "Bounded conversation",
    mode: "role-play",
    buildPhase: "premium-later",
    processingPreference: "server-verified",
    costControl: "Requires tenant entitlement, usage limits, moderation, and approved source scope.",
    safetyBoundary: "No open-ended child chatbot; conversation must stay inside approved curriculum tasks.",
  },
];

export interface VoiceTutorReadiness {
  plannedCount: number;
  nextCount: number;
  premiumCount: number;
  speechInputPlanned: boolean;
  speechOutputPlanned: boolean;
  allowedModeCount: number;
  statusLabel: string;
}

export function getVoiceTutorReadiness(plan?: UnitAiTutorPlan): VoiceTutorReadiness {
  const nextCount = voiceTutorCapabilityCatalog.filter((capability) => capability.buildPhase === "foundation-next").length;
  const premiumCount = voiceTutorCapabilityCatalog.filter((capability) => capability.buildPhase === "premium-later").length;

  return {
    plannedCount: voiceTutorCapabilityCatalog.length,
    nextCount,
    premiumCount,
    speechInputPlanned: Boolean(plan?.studentAudioInput),
    speechOutputPlanned: Boolean(plan?.studentAudioOutput),
    allowedModeCount: plan?.allowedModes.length ?? 0,
    statusLabel: plan?.enabled ? "Premium enabled" : "Premium planned",
  };
}
