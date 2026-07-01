import type { TenantConfig } from "./types";

export const ministarTenant: TenantConfig = {
  id: "ministar",
  displayName: "MiniStar English Lab",
  curriculumName: "MiniStar English",
  rewardName: "Star Dust",
  avatarFamilies: ["starter-avatars"],
  languageSettings: {
    targetLanguage: "en",
    defaultUiLanguage: "en",
    assistLanguages: ["ja"],
    studentAssistEnabledByDefault: false,
    liveAiAssistAllowed: false,
  },
  microphonePractice: {
    localRecordReplayEnabled: true,
    teacherApprovalRequired: true,
    aiSpeechScoringEnabled: false,
    aiSpeechScoringPackageTier: "premium",
    privacyNotice: "Local record/replay stays in the browser tab and is not uploaded or stored by the core package.",
    costNotice: "Local record/replay has no API cost. AI transcription or pronunciation scoring is premium and may create API usage costs.",
  },
  featureEntitlements: {
    aiTutor: {
      enabled: false,
      packageTier: "premium",
      allowedLevels: [6, 7, 8],
      allowedModes: ["fix-my-sentence", "role-play", "review-coach"],
      monthlyUsageLimit: 0,
      teacherEnabled: false,
      schoolEnabled: false,
    },
  },
  brand: {
    primary: "#0f172a",
    primaryText: "#ffffff",
    primarySoft: "#e0f2fe",
    accent: "#2563eb",
    accentText: "#ffffff",
    accentSoft: "#dbeafe",
    background: "#f8fafc",
    surface: "#ffffff",
    text: "#0f172a",
    muted: "#64748b",
    border: "#e2e8f0",
  },
};
