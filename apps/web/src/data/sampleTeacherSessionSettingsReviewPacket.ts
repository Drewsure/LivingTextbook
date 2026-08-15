import {
  getTeacherSessionPersistenceWarnings,
  getTeacherSessionSettingsReviewPacketWarnings,
  validateTeacherSessionSettings,
  validateTeacherSessionSettingsReviewPacket,
  type TeacherSessionSettingsReviewPacket,
} from "@living-textbook/content-model";
import { resolveSampleLaunchContext } from "./sampleLaunchResolver";

function createTeacherSessionSettingsReviewPacket(launchCode: string): TeacherSessionSettingsReviewPacket {
  const context = resolveSampleLaunchContext(launchCode);
  const settings = context.sessionSettings;
  const isMiniStar = context.tenant.id === "ministar";
  const safetyErrors = validateTeacherSessionSettings(settings);
  const persistenceWarnings = getTeacherSessionPersistenceWarnings(settings);

  return {
    packetId: `teacher-session-settings-review:${settings.launchCode}`,
    launchCode: settings.launchCode,
    tenantId: settings.tenantId,
    status: safetyErrors.length > 0 ? "blocked" : "review-only",
    sourceOfTruth: "TeacherSessionSettings plus launch-session context",
    summary:
      "This review packet shows the teacher/school choices that must become durable before a real classroom launch. It is review-only and cannot save settings, collect learner data, export reports, or activate premium services.",
    settingsSnapshot: settings,
    safetySignals: [
      "Learner-facing audio remains required for vocabulary, sentences, instructions, feedback, and critical controls.",
      "Target-language activity is the only progress trigger for unlocks, mastery, Star Dust, and completion.",
      "Assist language can support comprehension but cannot unlock, score, or satisfy completion.",
      ...(isMiniStar
        ? ["Foundation Japanese assist remains hiragana-only, teacher-controlled, and support-only."]
        : ["Assist language remains tenant-configurable and support-only for this white-label package."]),
      "Background media must pause, duck, or mute for tap-to-speak learning audio.",
      "Core reporting excludes raw learner audio, transcripts, and ungated AI Tutor state.",
    ],
    persistenceWarnings,
    policyAndCostGates: [
      "Microphone practice requires teacher or school approval before classroom use.",
      "No raw microphone audio upload is part of the core session settings package.",
      "AI Tutor remains optional paid package behavior and is disabled for this Level 1 core session.",
      "Report export requires accepted school or tenant privacy, retention, access, and export policy.",
      "Background media is optional and cannot override learning audio or become progress evidence.",
      "Hosted and local deployments must preserve the same settings snapshot fields.",
    ],
    blockedActions: [
      "No live classroom launch from this review packet",
      "No student event storage from this review packet",
      "No report export from this review packet",
      "No raw microphone audio upload from this review packet",
      "No AI Tutor activation from this review packet",
      "No support-language progress from this review packet",
      "No background-media mastery from this review packet",
      "No teacher setting save from this review packet",
    ],
    requiredBeforePilot: [
      "Persist teacher launch-session settings across student devices.",
      "Accept school or tenant privacy and reporting policy.",
      "Bind settings revision to launch session, assignment, and report policy.",
      "Verify target-language audio coverage for every assigned game mode.",
      "Confirm microphone, AI Tutor, and background media opt-ins per tenant package.",
      "Run foundation verification after settings persistence is implemented.",
    ],
    updatedAt: "2026-08-15T00:00:00.000Z",
  };
}

export const sampleTeacherSessionSettingsReviewPackets: TeacherSessionSettingsReviewPacket[] = [
  createTeacherSessionSettingsReviewPacket("demo-unit-1"),
  createTeacherSessionSettingsReviewPacket("partner-demo-unit-1"),
];

export const sampleTeacherSessionSettingsReviewPacketErrors =
  sampleTeacherSessionSettingsReviewPackets.flatMap((packet) => validateTeacherSessionSettingsReviewPacket(packet));

export const sampleTeacherSessionSettingsReviewPacketWarnings =
  sampleTeacherSessionSettingsReviewPackets.flatMap((packet) => getTeacherSessionSettingsReviewPacketWarnings(packet));
