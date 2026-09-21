import type { TenantConfig } from "@living-textbook/content-model";

export const sampleJapaneseTenant: TenantConfig = {
  id: "sample-japanese-school",
  displayName: "Sample Japanese School",
  curriculumName: "Japanese Learning Companion",
  rewardName: "Learning Sparks",
  avatarFamilies: ["school-starter"],
  languageSettings: {
    targetLanguage: "ja",
    defaultUiLanguage: "en",
    assistLanguages: ["en"],
    studentAssistEnabledByDefault: false,
    liveAiAssistAllowed: false,
    targetLanguagePolicy: {
      language: "ja",
      progressionRole: "target",
      scriptPolicy: "hiragana-first",
      segmentationPolicy: "japanese-aware",
      targetLanguageAudioRequired: true,
      supportLanguageProgressAllowed: false,
    },
  },
  brand: {
    primary: "#172554",
    primaryText: "#ffffff",
    primarySoft: "#dbeafe",
    accent: "#be123c",
    accentText: "#ffffff",
    accentSoft: "#ffe4e6",
    background: "#f8fafc",
    surface: "#ffffff",
    text: "#172033",
    muted: "#64748b",
    border: "#dbe2ea",
  },
};
