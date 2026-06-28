import type { UnitPayload } from "@living-textbook/content-model";

export const levelOneUnitOne: UnitPayload = {
  unitMeta: {
    tenantId: "ministar",
    curriculumId: "ministar-english",
    level: 1,
    module: 1,
    unit: 1,
    theme: "Greetings",
    gameMode: "flashcards",
    gameFamily: "vocabulary-matching",
    engineId: "selection",
  },
  pedagogicalPayload: {
    vocabularyTerms: ["hello", "goodbye", "please", "thank you", "yes", "no", "teacher", "friend"],
    targetSentences: ["Hello, teacher.", "Thank you, friend."],
  },
  visualRules: {
    avatarFamily: "ministar-starter",
    characterFocus: "A student avatar begins a friendly classroom practice session.",
    blacklistCheck: {
      passed: true,
      notes: "No restricted MiniStar visual motifs are present in this static sample.",
    },
  },
  teacherLaunchProtocol: {
    hook: "Today we are opening our first English practice mission. Listen, repeat, and help your classmates remember the greeting words.",
    activity: "Students scan the launch code, practice the 8 greeting words with flashcards, then unlock the next classroom game.",
    review: "Ask a partner to say one greeting and one polite word before leaving the activity.",
  },
};
