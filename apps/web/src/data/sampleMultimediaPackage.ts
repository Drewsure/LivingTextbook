import {
  getPermanentQrPath,
  getUnitKey,
  validateContentPackage,
  validatePermanentQrRoute,
} from "@living-textbook/content-model";
import type {
  AudioCue,
  ContentPackage,
  FrontDoorAccessPolicy,
  GameProgressEvent,
  PermanentQrRoute,
  UnitAssistLanguagePlan,
} from "@living-textbook/content-model";
import { levelOneUnitOne } from "./levelOneUnitOne";

const contentPackageId = "ministar-l1-u1-greetings-package";
const sampleUnitKey = getUnitKey(levelOneUnitOne.unitMeta);
const sampleTextbookReference = {
  seriesId: "ministar-english",
  bookId: "level-1",
  unitId: "unit-1",
  activityId: "greetings-entry",
  pageStart: 1,
  pageEnd: 4,
  language: "en",
  edition: "demo-2026",
  version: "0.1",
};

export const sampleFrontDoorEntryCode = "HELLO-101";
export const sampleFrontDoorUserCode = "STUDENT-04";

function toCueIdPart(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const sampleVocabularyAudioCues: AudioCue[] = levelOneUnitOne.pedagogicalPayload.vocabularyTerms.map((term) => ({
  audioCueId: `cue-ministar-l1-u1-term-${toCueIdPart(term)}`,
  tenantId: levelOneUnitOne.unitMeta.tenantId,
  kind: "term",
  text: term,
  language: "en",
  source: "text-to-speech",
  transcript: term,
  unitKey: sampleUnitKey,
  gameMode: "flashcards",
  textbookReference: sampleTextbookReference,
}));

const sampleSentenceAudioCues: AudioCue[] = levelOneUnitOne.pedagogicalPayload.targetSentences.map((sentence, index) => ({
  audioCueId: `cue-ministar-l1-u1-sentence-${index + 1}`,
  tenantId: levelOneUnitOne.unitMeta.tenantId,
  kind: "sentence",
  text: sentence,
  language: "en",
  source: "text-to-speech",
  transcript: sentence,
  unitKey: sampleUnitKey,
  gameMode: "flashcards",
  textbookReference: sampleTextbookReference,
}));

const sampleInstructionAudioCues: AudioCue[] = [
  {
    audioCueId: "cue-ministar-l1-u1-instruction-listen-repeat",
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    kind: "instruction",
    text: "Tap each card. Listen and repeat.",
    language: "en",
    source: "text-to-speech",
    transcript: "Tap each card. Listen and repeat.",
    unitKey: sampleUnitKey,
    gameMode: "flashcards",
    textbookReference: sampleTextbookReference,
  },
  {
    audioCueId: "cue-ministar-l1-u1-instruction-memory-match",
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    kind: "instruction",
    text: "Find the matching greeting cards.",
    language: "en",
    source: "text-to-speech",
    transcript: "Find the matching greeting cards.",
    unitKey: sampleUnitKey,
    gameMode: "memory-match",
    textbookReference: sampleTextbookReference,
  },
  {
    audioCueId: "cue-ministar-l1-u1-instruction-match-up",
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    kind: "instruction",
    text: "Tap a listening prompt. Match it to the greeting word.",
    language: "en",
    source: "text-to-speech",
    transcript: "Tap a listening prompt. Match it to the greeting word.",
    unitKey: sampleUnitKey,
    gameMode: "match-up",
    textbookReference: sampleTextbookReference,
  },
  {
    audioCueId: "cue-ministar-l1-u1-instruction-quiz",
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    kind: "instruction",
    text: "Listen to the prompt. Tap an answer choice to hear it, then submit.",
    language: "en",
    source: "text-to-speech",
    transcript: "Listen to the prompt. Tap an answer choice to hear it, then submit.",
    unitKey: sampleUnitKey,
    gameMode: "quiz",
    textbookReference: sampleTextbookReference,
  },
  {
    audioCueId: "cue-ministar-l1-u1-instruction-true-false",
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    kind: "instruction",
    text: "Listen to the word. Tap true if the greeting card matches.",
    language: "en",
    source: "text-to-speech",
    transcript: "Listen to the word. Tap true if the greeting card matches.",
    unitKey: sampleUnitKey,
    gameMode: "true-false",
    textbookReference: sampleTextbookReference,
  },
  {
    audioCueId: "cue-ministar-l1-u1-instruction-balloon-pop",
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    kind: "instruction",
    text: "Listen to the word. Pop the matching greeting balloon.",
    language: "en",
    source: "text-to-speech",
    transcript: "Listen to the word. Pop the matching greeting balloon.",
    unitKey: sampleUnitKey,
    gameMode: "balloon-pop",
    textbookReference: sampleTextbookReference,
  },
  {
    audioCueId: "cue-ministar-l1-u1-instruction-sentence-builder",
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    kind: "instruction",
    text: "Tap the words in order. Listen before you submit.",
    language: "en",
    source: "text-to-speech",
    transcript: "Tap the words in order. Listen before you submit.",
    unitKey: sampleUnitKey,
    gameMode: "sentence-builder",
    textbookReference: sampleTextbookReference,
  },
  {
    audioCueId: "cue-ministar-l1-u1-instruction-speak-it",
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    kind: "instruction",
    text: "Listen, say it out loud, then tap I said it.",
    language: "en",
    source: "text-to-speech",
    transcript: "Listen, say it out loud, then tap I said it.",
    unitKey: sampleUnitKey,
    gameMode: "speak-it",
    textbookReference: sampleTextbookReference,
  },
];

const sampleFeedbackAudioCues: AudioCue[] = [
  {
    audioCueId: "cue-ministar-l1-u1-feedback-great-work",
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    kind: "feedback",
    text: "Great work. Memory Match is unlocked.",
    language: "en",
    source: "text-to-speech",
    transcript: "Great work. Memory Match is unlocked.",
    unitKey: sampleUnitKey,
    gameMode: "flashcards",
    textbookReference: sampleTextbookReference,
  },
  {
    audioCueId: "cue-ministar-l1-u1-feedback-try-again",
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    kind: "feedback",
    text: "Try again. Listen one more time.",
    language: "en",
    source: "text-to-speech",
    transcript: "Try again. Listen one more time.",
    unitKey: sampleUnitKey,
    gameMode: "memory-match",
    textbookReference: sampleTextbookReference,
  },
  {
    audioCueId: "cue-ministar-l1-u1-feedback-match-up-try-again",
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    kind: "feedback",
    text: "Try again. Listen and choose the greeting word.",
    language: "en",
    source: "text-to-speech",
    transcript: "Try again. Listen and choose the greeting word.",
    unitKey: sampleUnitKey,
    gameMode: "match-up",
    textbookReference: sampleTextbookReference,
  },
  {
    audioCueId: "cue-ministar-l1-u1-feedback-quiz-next",
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    kind: "feedback",
    text: "Correct. Next question.",
    language: "en",
    source: "text-to-speech",
    transcript: "Correct. Next question.",
    unitKey: sampleUnitKey,
    gameMode: "quiz",
    textbookReference: sampleTextbookReference,
  },
  {
    audioCueId: "cue-ministar-l1-u1-feedback-true-false-next",
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    kind: "feedback",
    text: "Correct. Next true or false card.",
    language: "en",
    source: "text-to-speech",
    transcript: "Correct. Next true or false card.",
    unitKey: sampleUnitKey,
    gameMode: "true-false",
    textbookReference: sampleTextbookReference,
  },
  {
    audioCueId: "cue-ministar-l1-u1-feedback-balloon-pop-try-again",
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    kind: "feedback",
    text: "Try again. Listen and pop the matching greeting word.",
    language: "en",
    source: "text-to-speech",
    transcript: "Try again. Listen and pop the matching greeting word.",
    unitKey: sampleUnitKey,
    gameMode: "balloon-pop",
    textbookReference: sampleTextbookReference,
  },
  {
    audioCueId: "cue-ministar-l1-u1-feedback-sentence-correct",
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    kind: "feedback",
    text: "Correct sentence. Great work.",
    language: "en",
    source: "text-to-speech",
    transcript: "Correct sentence. Great work.",
    unitKey: sampleUnitKey,
    gameMode: "sentence-builder",
    textbookReference: sampleTextbookReference,
  },
];

const sampleAudioCues = [
  ...sampleVocabularyAudioCues,
  ...sampleSentenceAudioCues,
  ...sampleInstructionAudioCues,
  ...sampleFeedbackAudioCues,
];

export const sampleJapaneseAssistPlan: UnitAssistLanguagePlan = {
  unitKey: sampleUnitKey,
  targetLanguage: "en",
  assistLanguage: "ja",
  source: "human-reviewed",
  reviewStatus: "reviewed",
  studentVisibility: "student-toggle",
  vocabularyGlosses: {
    hello: "こんにちは",
    goodbye: "さようなら",
    please: "おねがいします",
    "thank you": "ありがとう",
    yes: "はい",
    no: "いいえ",
    teacher: "せんせい",
    friend: "ともだち",
  },
  sentenceGlosses: ["こんにちは、せんせい。", "ありがとう、ともだち。"],
  instructionGlosses: {
    "Tap each card. Listen and repeat.": "ことばをおして、きいて、まねしていいましょう。",
    "Great work. Memory Match is unlocked.": "よくできました。つぎのげえむができます。",
  },
  teacherNotes: [
    "Japanese assist is optional, reviewed sample support for early learners and must not become a platform-wide assumption.",
    "English target-language practice is the progression trigger; Japanese assist is comprehension support only.",
    "Foundation, Bronze, and Plus Japanese support must be written in hiragana only. Silver and later packages may introduce kanji and katakana after review.",
  ],
  allowLiveAiFallback: false,
};

export const sampleMultimediaContentPackage: ContentPackage = {
  meta: {
    packageId: contentPackageId,
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    curriculumId: levelOneUnitOne.unitMeta.curriculumId,
    sourceType: "manual",
    reviewStatus: "reviewed",
    createdAt: "2026-06-28T00:00:00.000Z",
    sourceDocumentName: "MiniStar Level 1 Unit 1 sample package",
    textbookReference: sampleTextbookReference,
  },
  units: [
    {
      ...levelOneUnitOne,
      unitMeta: {
        ...levelOneUnitOne.unitMeta,
        contentPackageId,
        textbookReference: sampleTextbookReference,
      },
    },
  ],
  mediaAssets: [
    {
      mediaAssetId: "media-ministar-l1-u1-greetings-chant",
      tenantId: levelOneUnitOne.unitMeta.tenantId,
      title: "Greetings Chant",
      type: "chant",
      kind: "audio",
      rightsStatus: "partner-provided",
      sourceUri: "/media/demo/ministar/l1-u1/greetings-chant.mp3",
      localBundlePath: "content/ministar/level-1/unit-1/audio/greetings-chant.mp3",
      durationSeconds: 48,
      ownerName: "MiniStar sample tenant",
      language: "en",
      unitKey: sampleUnitKey,
      textbookReference: {
        ...sampleTextbookReference,
        activityId: "greetings-chant",
      },
    },
    {
      mediaAssetId: "media-ministar-l1-u1-greetings-video",
      tenantId: levelOneUnitOne.unitMeta.tenantId,
      title: "Hello Friends Video",
      type: "lesson-video",
      kind: "video",
      rightsStatus: "partner-provided",
      sourceUri: "/media/demo/ministar/l1-u1/hello-friends.mp4",
      localBundlePath: "content/ministar/level-1/unit-1/video/hello-friends.mp4",
      posterImageUri: "/media/demo/ministar/l1-u1/hello-friends-poster.jpg",
      transcriptUri: "/media/demo/ministar/l1-u1/hello-friends-transcript.vtt",
      durationSeconds: 92,
      ownerName: "MiniStar sample tenant",
      language: "en",
      unitKey: sampleUnitKey,
      textbookReference: {
        ...sampleTextbookReference,
        activityId: "hello-friends-video",
      },
    },
  ],
  audioCues: sampleAudioCues,
  audioSupportPlans: [
    {
      unitKey: sampleUnitKey,
      required: true,
      vocabularyAudioCueIds: sampleVocabularyAudioCues.map((cue) => cue.audioCueId),
      sentenceAudioCueIds: sampleSentenceAudioCues.map((cue) => cue.audioCueId),
      instructionAudioCueIds: sampleInstructionAudioCues.map((cue) => cue.audioCueId),
      feedbackAudioCueIds: sampleFeedbackAudioCues.map((cue) => cue.audioCueId),
      gameModeAudioCueIds: {
        flashcards: [
          ...sampleVocabularyAudioCues.map((cue) => cue.audioCueId),
          ...sampleSentenceAudioCues.map((cue) => cue.audioCueId),
          "cue-ministar-l1-u1-instruction-listen-repeat",
          "cue-ministar-l1-u1-feedback-great-work",
        ],
        "memory-match": [
          ...sampleVocabularyAudioCues.map((cue) => cue.audioCueId),
          "cue-ministar-l1-u1-instruction-memory-match",
          "cue-ministar-l1-u1-feedback-try-again",
        ],
        "match-up": [
          ...sampleVocabularyAudioCues.map((cue) => cue.audioCueId),
          "cue-ministar-l1-u1-instruction-match-up",
          "cue-ministar-l1-u1-feedback-match-up-try-again",
        ],
        quiz: [
          ...sampleVocabularyAudioCues.map((cue) => cue.audioCueId),
          ...sampleSentenceAudioCues.map((cue) => cue.audioCueId),
          "cue-ministar-l1-u1-instruction-quiz",
          "cue-ministar-l1-u1-feedback-quiz-next",
        ],
        "true-false": [
          ...sampleVocabularyAudioCues.map((cue) => cue.audioCueId),
          "cue-ministar-l1-u1-instruction-true-false",
          "cue-ministar-l1-u1-feedback-true-false-next",
        ],
        "balloon-pop": [
          ...sampleVocabularyAudioCues.map((cue) => cue.audioCueId),
          "cue-ministar-l1-u1-instruction-balloon-pop",
          "cue-ministar-l1-u1-feedback-balloon-pop-try-again",
        ],
        "sentence-builder": [
          ...sampleSentenceAudioCues.map((cue) => cue.audioCueId),
          "cue-ministar-l1-u1-instruction-sentence-builder",
          "cue-ministar-l1-u1-feedback-sentence-correct",
        ],
        "speak-it": [
          ...sampleVocabularyAudioCues.map((cue) => cue.audioCueId),
          ...sampleSentenceAudioCues.map((cue) => cue.audioCueId),
          "cue-ministar-l1-u1-instruction-speak-it",
        ],
      },
      fallbackVoice: "tenant-default-child-friendly-en",
    },
  ],
  assistLanguagePlans: [sampleJapaneseAssistPlan],
  playlists: [
    {
      playlistId: "playlist-ministar-l1-u1-greetings",
      tenantId: levelOneUnitOne.unitMeta.tenantId,
      title: "Unit 1 Greetings Media",
      unitKey: sampleUnitKey,
      mediaAssetIds: ["media-ministar-l1-u1-greetings-chant", "media-ministar-l1-u1-greetings-video"],
      usageRole: "primary",
      playbackContext: "student-practice",
      textbookReference: sampleTextbookReference,
    },
  ],
  multimediaPlans: [
    {
      unitKey: sampleUnitKey,
      primaryPlaylistId: "playlist-ministar-l1-u1-greetings",
      backgroundMediaAssetId: "media-ministar-l1-u1-greetings-chant",
      allowedBackgroundGameModes: ["match-up", "memory-match", "balloon-pop"],
      backgroundEnabledByDefault: false,
      defaultVolumePercent: 35,
      requiresTeacherEnablement: true,
    },
  ],
  aiTutorPlans: [
    {
      unitKey: sampleUnitKey,
      enabled: false,
      entitlementRequired: "premium",
      minimumLevel: 6,
      allowedModes: [],
      sourceScope: "current-unit-only",
      teacherReviewRequired: true,
      studentAudioInput: false,
      studentAudioOutput: false,
      maxResponseSentences: 4,
    },
  ],
};

export const samplePermanentQrRoute: PermanentQrRoute = {
  qrId: "qr-ministar-l1-u1-front-door",
  identifier: {
    tenantId: levelOneUnitOne.unitMeta.tenantId,
    seriesId: "ministar-english",
    bookId: "level-1",
    unitId: "unit-1",
    activityId: "front-door",
    language: "en",
    edition: "demo-2026",
    version: "0.1",
  },
  targetType: "front-door",
  targetId: "enter:ministar:greetings-demo",
  preferredDeployment: "hosted-web",
  fallbackPath: "/enter/ministar",
  updatedAt: "2026-06-28T00:00:00.000Z",
};

export const sampleFrontDoorAccessPolicy: FrontDoorAccessPolicy = {
  tenantId: levelOneUnitOne.unitMeta.tenantId,
  entryCodeRequired: true,
  userCodeRequired: true,
  reportProgressToTeacher: true,
  allowAnonymousPractice: false,
};

export interface TeacherProgressSummaryConcept {
  unitKey: string;
  launchCode: string;
  entryCode: string;
  studentCount: number;
  flashcardCompletions: number;
  memoryMatchStarts: number;
  mediaStarts: number;
  mediaPauses: number;
  mediaCompletions: number;
  backgroundMediaOptIns: number;
  trainingRecommendations: number;
  trainingCompletions: number;
  trainingReturns: number;
  recoveryStarDust: number;
  averageStarDust: number;
  teacherReportStreams: string[];
  sampleEvents: GameProgressEvent[];
}

export const sampleTeacherProgressSummaryConcept: TeacherProgressSummaryConcept = {
  unitKey: sampleUnitKey,
  launchCode: "demo-unit-1",
  entryCode: sampleFrontDoorEntryCode,
  studentCount: 12,
  flashcardCompletions: 10,
  memoryMatchStarts: 8,
  mediaStarts: 9,
  mediaPauses: 3,
  mediaCompletions: 6,
  backgroundMediaOptIns: 4,
  trainingRecommendations: 2,
  trainingCompletions: 1,
  trainingReturns: 1,
  recoveryStarDust: 100,
  averageStarDust: 325,
  teacherReportStreams: [
    "Entry practice completion",
    "Memory Match starts",
    "Training Academy recovery events",
    "Playlist/media engagement",
    "Media pause and resume engagement",
    "Optional background media use",
    "Audio cue engagement for learner-facing text",
    "Reviewed assist-language support",
    "Star Dust progress",
  ],
  sampleEvents: [
    {
      type: "entry_practice_completed",
      unitKey: sampleUnitKey,
      gameMode: "flashcards",
      launchCode: "demo-unit-1",
      studentSessionId: "demo-unit-1:student-04",
      occurredAt: "2026-06-28T00:05:00.000Z",
    },
    {
      type: "media_started",
      unitKey: sampleUnitKey,
      gameMode: "flashcards",
      launchCode: "demo-unit-1",
      studentSessionId: "demo-unit-1:student-04",
      occurredAt: "2026-06-28T00:06:00.000Z",
      metadata: {
        mediaAssetId: "media-ministar-l1-u1-greetings-chant",
      },
    },
    {
      type: "media_paused",
      unitKey: sampleUnitKey,
      gameMode: "flashcards",
      launchCode: "demo-unit-1",
      studentSessionId: "demo-unit-1:student-04",
      occurredAt: "2026-06-28T00:07:00.000Z",
      metadata: {
        mediaAssetId: "media-ministar-l1-u1-greetings-chant",
      },
    },
    {
      type: "background_media_enabled",
      unitKey: sampleUnitKey,
      gameMode: "memory-match",
      launchCode: "demo-unit-1",
      studentSessionId: "demo-unit-1:student-04",
      occurredAt: "2026-06-28T00:08:00.000Z",
      metadata: {
        mediaAssetId: "media-ministar-l1-u1-greetings-chant",
        volumePercent: 35,
      },
    },
    {
      type: "training_recommended",
      unitKey: sampleUnitKey,
      gameMode: "flashcards",
      launchCode: "demo-unit-1",
      studentSessionId: "demo-unit-1:student-04",
      occurredAt: "2026-06-28T00:09:00.000Z",
      metadata: {
        trainingEventType: "training_recommended",
        focusType: "vocabulary-review",
        sourceGameMode: "memory-match",
        recommendedGameMode: "flashcards",
        returnPath: "/launch/demo-unit-1",
        teacherAssigned: false,
        reason: "Review a small set of greeting words before returning to the normal unit path.",
        targetTermCount: 4,
      },
    },
    {
      type: "training_recommended",
      unitKey: sampleUnitKey,
      gameMode: "flashcards",
      launchCode: "demo-unit-1",
      studentSessionId: "demo-unit-1:student-04",
      occurredAt: "2026-06-28T00:10:00.000Z",
      metadata: {
        trainingEventType: "training_completed",
        focusType: "vocabulary-review",
        sourceGameMode: "memory-match",
        recommendedGameMode: "flashcards",
        returnPath: "/launch/demo-unit-1",
        teacherAssigned: false,
        earnedStarDust: 100,
        practicedTermCount: 4,
      },
    },
    {
      type: "training_recommended",
      unitKey: sampleUnitKey,
      gameMode: "flashcards",
      launchCode: "demo-unit-1",
      studentSessionId: "demo-unit-1:student-04",
      occurredAt: "2026-06-28T00:11:00.000Z",
      metadata: {
        trainingEventType: "training_returned_to_unit",
        focusType: "vocabulary-review",
        sourceGameMode: "memory-match",
        recommendedGameMode: "flashcards",
        returnPath: "/launch/demo-unit-1",
        teacherAssigned: false,
        completed: true,
      },
    },
  ],
};

export const samplePermanentQrPath = getPermanentQrPath(samplePermanentQrRoute.identifier);
export const sampleFrontDoorPath = "/enter/ministar";
export const samplePackageValidationErrors = [
  ...validateContentPackage(sampleMultimediaContentPackage),
  ...validatePermanentQrRoute(samplePermanentQrRoute),
];
