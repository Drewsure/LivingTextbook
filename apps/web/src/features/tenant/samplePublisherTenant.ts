import type { TenantConfig } from "./types";

export const samplePublisherTenant: TenantConfig = {
  id: "sample-publisher",
  displayName: "Sample Publisher Lab",
  curriculumName: "Partner Textbook Companion",
  rewardName: "Learning Sparks",
  avatarFamilies: ["publisher-starter"],
  languageSettings: {
    targetLanguage: "en",
    defaultUiLanguage: "en",
    assistLanguages: [],
    studentAssistEnabledByDefault: false,
    liveAiAssistAllowed: false,
  },
  microphonePractice: {
    localRecordReplayEnabled: true,
    teacherApprovalRequired: true,
    aiSpeechScoringEnabled: false,
    aiSpeechScoringPackageTier: "premium",
    privacyNotice:
      "Local record/replay stays in the browser tab and is not uploaded or stored by the core package.",
    costNotice:
      "Local record/replay has no API cost. AI transcription or pronunciation scoring is premium and may create API usage costs.",
  },
  featureEntitlements: {
    aiTutor: {
      enabled: false,
      packageTier: "premium",
      allowedLevels: [6, 7, 8],
      allowedModes: ["speak-with-me", "review-coach"],
      monthlyUsageLimit: 0,
      teacherEnabled: false,
      schoolEnabled: false,
    },
  },
  brand: {
    primary: "#123524",
    primaryText: "#ffffff",
    primarySoft: "#dcfce7",
    accent: "#0f766e",
    accentText: "#ffffff",
    accentSoft: "#ccfbf1",
    background: "#f7fbf9",
    surface: "#ffffff",
    text: "#10231c",
    muted: "#5e746b",
    border: "#d7e5de",
  },
};
