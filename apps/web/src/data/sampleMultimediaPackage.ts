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
    please: "お願いします",
    "thank you": "ありがとう",
    yes: "はい",
    no: "いいえ",
    teacher: "先生",
    friend: "友だち",
  },
  sentenceGlosses: ["こんにちは、先生。", "ありがとう、友だち。"],
  instructionGlosses: {
    "Tap each card. Listen and repeat.": "カードをタップして、聞いて、まねして言いましょう。",
    "Great work. Memory Match is unlocked.": "よくできました。メモリーマッチができるようになりました。",
  },
  teacherNotes: [
    "Japanese assist is optional, reviewed sample support for early learners and must not become a platform-wide assumption.",
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
      allowedBackgroundGameModes: ["memory-match"],
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
  averageStarDust: 325,
  teacherReportStreams: [
    "Entry practice completion",
    "Memory Match starts",
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
  ],
};

export const samplePermanentQrPath = getPermanentQrPath(samplePermanentQrRoute.identifier);
export const sampleFrontDoorPath = "/enter/ministar";
export const samplePackageValidationErrors = [
  ...validateContentPackage(sampleMultimediaContentPackage),
  ...validatePermanentQrRoute(samplePermanentQrRoute),
];