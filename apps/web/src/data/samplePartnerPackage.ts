import {
  createLaunchSession,
  getInitialStudentProgression,
  getPermanentQrPath,
  getUnitKey,
  validateContentPackage,
  validatePermanentQrRoute,
} from "@living-textbook/content-model";
import type {
  AudioCue,
  ContentPackage,
  FrontDoorAccessPolicy,
  LaunchSession,
  PermanentQrRoute,
  UnitPayload,
} from "@living-textbook/content-model";

const tenantId = "sample-publisher";
const curriculumId = "partner-textbook-companion";
const contentPackageId = "sample-publisher-l1-u1-routines-package";

const samplePartnerTextbookReference = {
  seriesId: "sample-partner-series",
  bookId: "starter-book",
  unitId: "unit-1",
  activityId: "daily-routines-entry",
  pageStart: 6,
  pageEnd: 9,
  language: "en",
  edition: "pilot-2026",
  version: "0.1",
};

export const samplePartnerLaunchCode = "partner-demo-unit-1";
export const samplePartnerFrontDoorLaunchCode = "partner-front-door-demo-unit-1";
export const samplePartnerFrontDoorEntryCode = "ROUTINE-101";
export const samplePartnerFrontDoorUserCode = "LEARNER-07";

export const samplePartnerUnitOne: UnitPayload = {
  unitMeta: {
    tenantId,
    curriculumId,
    level: 1,
    module: 1,
    unit: 1,
    theme: "Daily Routines",
    gameMode: "flashcards",
    gameFamily: "vocabulary-matching",
    engineId: "selection",
    contentPackageId,
    textbookReference: samplePartnerTextbookReference,
  },
  pedagogicalPayload: {
    vocabularyTerms: ["wake up", "wash", "eat", "drink", "go", "play", "read", "sleep"],
    targetSentences: ["I wake up in the morning.", "I read before I sleep."],
  },
  visualRules: {
    avatarFamily: "publisher-starter",
    characterFocus:
      "A tenant-configurable learner avatar moves through a simple daily routine scene with clear textbook-linked prompts.",
    blacklistCheck: {
      passed: true,
      notes: "No MiniStar-only mascot, pirate motif, or tenant-specific character rule is hard-coded into this sample.",
    },
  },
  teacherLaunchProtocol: {
    hook: "Point to the routine pictures and ask: What do you do every day?",
    activity:
      "Students listen to each routine word, repeat it, then unlock Memory Match after target-language practice is complete.",
    review: "Students mime one routine and say the matching English word.",
  },
};

const samplePartnerUnitKey = getUnitKey(samplePartnerUnitOne.unitMeta);

function toCueIdPart(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const samplePartnerVocabularyAudioCues: AudioCue[] = samplePartnerUnitOne.pedagogicalPayload.vocabularyTerms.map(
  (term) => ({
    audioCueId: `cue-sample-publisher-l1-u1-term-${toCueIdPart(term)}`,
    tenantId,
    kind: "term",
    text: term,
    language: "en",
    source: "text-to-speech",
    transcript: term,
    unitKey: samplePartnerUnitKey,
    gameMode: "flashcards",
    textbookReference: samplePartnerTextbookReference,
  }),
);

const samplePartnerSentenceAudioCues: AudioCue[] = samplePartnerUnitOne.pedagogicalPayload.targetSentences.map(
  (sentence, index) => ({
    audioCueId: `cue-sample-publisher-l1-u1-sentence-${index + 1}`,
    tenantId,
    kind: "sentence",
    text: sentence,
    language: "en",
    source: "text-to-speech",
    transcript: sentence,
    unitKey: samplePartnerUnitKey,
    gameMode: "flashcards",
    textbookReference: samplePartnerTextbookReference,
  }),
);

const samplePartnerInstructionAudioCues: AudioCue[] = [
  {
    audioCueId: "cue-sample-publisher-l1-u1-instruction-listen-repeat",
    tenantId,
    kind: "instruction",
    text: "Tap each card. Listen and repeat.",
    language: "en",
    source: "text-to-speech",
    transcript: "Tap each card. Listen and repeat.",
    unitKey: samplePartnerUnitKey,
    gameMode: "flashcards",
    textbookReference: samplePartnerTextbookReference,
  },
  {
    audioCueId: "cue-sample-publisher-l1-u1-instruction-memory-match",
    tenantId,
    kind: "instruction",
    text: "Find the matching routine cards.",
    language: "en",
    source: "text-to-speech",
    transcript: "Find the matching routine cards.",
    unitKey: samplePartnerUnitKey,
    gameMode: "memory-match",
    textbookReference: samplePartnerTextbookReference,
  },
  {
    audioCueId: "cue-sample-publisher-l1-u1-instruction-match-up",
    tenantId,
    kind: "instruction",
    text: "Tap a listening prompt. Match it to the routine word.",
    language: "en",
    source: "text-to-speech",
    transcript: "Tap a listening prompt. Match it to the routine word.",
    unitKey: samplePartnerUnitKey,
    gameMode: "match-up",
    textbookReference: samplePartnerTextbookReference,
  },
  {
    audioCueId: "cue-sample-publisher-l1-u1-instruction-speak-it",
    tenantId,
    kind: "instruction",
    text: "Listen, say it out loud, then tap I said it.",
    language: "en",
    source: "text-to-speech",
    transcript: "Listen, say it out loud, then tap I said it.",
    unitKey: samplePartnerUnitKey,
    gameMode: "speak-it",
    textbookReference: samplePartnerTextbookReference,
  },
  {
    audioCueId: "cue-sample-publisher-l1-u1-instruction-quiz",
    tenantId,
    kind: "instruction",
    text: "Listen to the prompt. Tap an answer choice to hear it, then submit.",
    language: "en",
    source: "text-to-speech",
    transcript: "Listen to the prompt. Tap an answer choice to hear it, then submit.",
    unitKey: samplePartnerUnitKey,
    gameMode: "quiz",
    textbookReference: samplePartnerTextbookReference,
  },
  {
    audioCueId: "cue-sample-publisher-l1-u1-instruction-true-false",
    tenantId,
    kind: "instruction",
    text: "Listen to the word. Tap true if the routine card matches.",
    language: "en",
    source: "text-to-speech",
    transcript: "Listen to the word. Tap true if the routine card matches.",
    unitKey: samplePartnerUnitKey,
    gameMode: "true-false",
    textbookReference: samplePartnerTextbookReference,
  },
  {
    audioCueId: "cue-sample-publisher-l1-u1-instruction-type-answer",
    tenantId,
    kind: "instruction",
    text: "Listen to the word. Type the routine answer.",
    language: "en",
    source: "text-to-speech",
    transcript: "Listen to the word. Type the routine answer.",
    unitKey: samplePartnerUnitKey,
    gameMode: "type-answer",
    textbookReference: samplePartnerTextbookReference,
  },
  {
    audioCueId: "cue-sample-publisher-l1-u1-instruction-balloon-pop",
    tenantId,
    kind: "instruction",
    text: "Listen to the word. Pop the matching routine balloon.",
    language: "en",
    source: "text-to-speech",
    transcript: "Listen to the word. Pop the matching routine balloon.",
    unitKey: samplePartnerUnitKey,
    gameMode: "balloon-pop",
    textbookReference: samplePartnerTextbookReference,
  },
  {
    audioCueId: "cue-sample-publisher-l1-u1-instruction-sentence-builder",
    tenantId,
    kind: "instruction",
    text: "Tap the words in order. Listen before you submit.",
    language: "en",
    source: "text-to-speech",
    transcript: "Tap the words in order. Listen before you submit.",
    unitKey: samplePartnerUnitKey,
    gameMode: "sentence-builder",
    textbookReference: samplePartnerTextbookReference,
  },
];

const samplePartnerFeedbackAudioCues: AudioCue[] = [
  {
    audioCueId: "cue-sample-publisher-l1-u1-feedback-memory-unlocked",
    tenantId,
    kind: "feedback",
    text: "Good practice. Memory Match is unlocked.",
    language: "en",
    source: "text-to-speech",
    transcript: "Good practice. Memory Match is unlocked.",
    unitKey: samplePartnerUnitKey,
    gameMode: "flashcards",
    textbookReference: samplePartnerTextbookReference,
  },
  {
    audioCueId: "cue-sample-publisher-l1-u1-feedback-try-again",
    tenantId,
    kind: "feedback",
    text: "Listen again and choose a routine card.",
    language: "en",
    source: "text-to-speech",
    transcript: "Listen again and choose a routine card.",
    unitKey: samplePartnerUnitKey,
    gameMode: "memory-match",
    textbookReference: samplePartnerTextbookReference,
  },
  {
    audioCueId: "cue-sample-publisher-l1-u1-feedback-match-up-try-again",
    tenantId,
    kind: "feedback",
    text: "Try again. Listen and choose the routine word.",
    language: "en",
    source: "text-to-speech",
    transcript: "Try again. Listen and choose the routine word.",
    unitKey: samplePartnerUnitKey,
    gameMode: "match-up",
    textbookReference: samplePartnerTextbookReference,
  },
  {
    audioCueId: "cue-sample-publisher-l1-u1-feedback-quiz-next",
    tenantId,
    kind: "feedback",
    text: "Correct. Next question.",
    language: "en",
    source: "text-to-speech",
    transcript: "Correct. Next question.",
    unitKey: samplePartnerUnitKey,
    gameMode: "quiz",
    textbookReference: samplePartnerTextbookReference,
  },
  {
    audioCueId: "cue-sample-publisher-l1-u1-feedback-true-false-next",
    tenantId,
    kind: "feedback",
    text: "Correct. Next true or false card.",
    language: "en",
    source: "text-to-speech",
    transcript: "Correct. Next true or false card.",
    unitKey: samplePartnerUnitKey,
    gameMode: "true-false",
    textbookReference: samplePartnerTextbookReference,
  },
  {
    audioCueId: "cue-sample-publisher-l1-u1-feedback-type-answer-correct",
    tenantId,
    kind: "feedback",
    text: "Correct. Next typing card.",
    language: "en",
    source: "text-to-speech",
    transcript: "Correct. Next typing card.",
    unitKey: samplePartnerUnitKey,
    gameMode: "type-answer",
    textbookReference: samplePartnerTextbookReference,
  },
  {
    audioCueId: "cue-sample-publisher-l1-u1-feedback-balloon-pop-try-again",
    tenantId,
    kind: "feedback",
    text: "Try again. Listen and pop the matching routine word.",
    language: "en",
    source: "text-to-speech",
    transcript: "Try again. Listen and pop the matching routine word.",
    unitKey: samplePartnerUnitKey,
    gameMode: "balloon-pop",
    textbookReference: samplePartnerTextbookReference,
  },
  {
    audioCueId: "cue-sample-publisher-l1-u1-feedback-sentence-correct",
    tenantId,
    kind: "feedback",
    text: "Correct sentence. Great work.",
    language: "en",
    source: "text-to-speech",
    transcript: "Correct sentence. Great work.",
    unitKey: samplePartnerUnitKey,
    gameMode: "sentence-builder",
    textbookReference: samplePartnerTextbookReference,
  },
];

const samplePartnerAudioCues = [
  ...samplePartnerVocabularyAudioCues,
  ...samplePartnerSentenceAudioCues,
  ...samplePartnerInstructionAudioCues,
  ...samplePartnerFeedbackAudioCues,
];

export const samplePartnerContentPackage: ContentPackage = {
  meta: {
    packageId: contentPackageId,
    tenantId,
    curriculumId,
    sourceType: "pdf",
    reviewStatus: "reviewed",
    createdAt: "2026-07-01T00:00:00.000Z",
    sourceDocumentName: "Partner Textbook Sample Unit.pdf",
    textbookReference: samplePartnerTextbookReference,
  },
  units: [samplePartnerUnitOne],
  mediaAssets: [
    {
      mediaAssetId: "media-sample-publisher-l1-u1-routine-chant",
      tenantId,
      title: "Daily Routine Chant",
      type: "chant",
      kind: "audio",
      rightsStatus: "partner-provided",
      sourceUri: "/media/demo/sample-publisher/l1-u1/routine-chant.mp3",
      localBundlePath: "content/sample-publisher/starter-book/unit-1/audio/routine-chant.mp3",
      durationSeconds: 52,
      ownerName: "Sample publisher tenant",
      language: "en",
      unitKey: samplePartnerUnitKey,
      textbookReference: {
        ...samplePartnerTextbookReference,
        activityId: "routine-chant",
      },
    },
    {
      mediaAssetId: "media-sample-publisher-l1-u1-daily-routine-video",
      tenantId,
      title: "Daily Routine Video",
      type: "lesson-video",
      kind: "video",
      rightsStatus: "partner-provided",
      sourceUri: "/media/demo/sample-publisher/l1-u1/daily-routine.mp4",
      localBundlePath: "content/sample-publisher/starter-book/unit-1/video/daily-routine.mp4",
      posterImageUri: "/media/demo/sample-publisher/l1-u1/daily-routine-poster.jpg",
      transcriptUri: "/media/demo/sample-publisher/l1-u1/daily-routine-transcript.vtt",
      durationSeconds: 96,
      ownerName: "Sample publisher tenant",
      language: "en",
      unitKey: samplePartnerUnitKey,
      textbookReference: {
        ...samplePartnerTextbookReference,
        activityId: "daily-routine-video",
      },
    },
  ],
  audioCues: samplePartnerAudioCues,
  audioSupportPlans: [
    {
      unitKey: samplePartnerUnitKey,
      required: true,
      vocabularyAudioCueIds: samplePartnerVocabularyAudioCues.map((cue) => cue.audioCueId),
      sentenceAudioCueIds: samplePartnerSentenceAudioCues.map((cue) => cue.audioCueId),
      instructionAudioCueIds: samplePartnerInstructionAudioCues.map((cue) => cue.audioCueId),
      feedbackAudioCueIds: samplePartnerFeedbackAudioCues.map((cue) => cue.audioCueId),
      gameModeAudioCueIds: {
        flashcards: [
          ...samplePartnerVocabularyAudioCues.map((cue) => cue.audioCueId),
          ...samplePartnerSentenceAudioCues.map((cue) => cue.audioCueId),
          "cue-sample-publisher-l1-u1-instruction-listen-repeat",
          "cue-sample-publisher-l1-u1-feedback-memory-unlocked",
        ],
        "memory-match": [
          ...samplePartnerVocabularyAudioCues.map((cue) => cue.audioCueId),
          "cue-sample-publisher-l1-u1-instruction-memory-match",
          "cue-sample-publisher-l1-u1-feedback-try-again",
        ],
        "match-up": [
          ...samplePartnerVocabularyAudioCues.map((cue) => cue.audioCueId),
          "cue-sample-publisher-l1-u1-instruction-match-up",
          "cue-sample-publisher-l1-u1-feedback-match-up-try-again",
        ],
        quiz: [
          ...samplePartnerVocabularyAudioCues.map((cue) => cue.audioCueId),
          ...samplePartnerSentenceAudioCues.map((cue) => cue.audioCueId),
          "cue-sample-publisher-l1-u1-instruction-quiz",
          "cue-sample-publisher-l1-u1-feedback-quiz-next",
        ],
        "true-false": [
          ...samplePartnerVocabularyAudioCues.map((cue) => cue.audioCueId),
          "cue-sample-publisher-l1-u1-instruction-true-false",
          "cue-sample-publisher-l1-u1-feedback-true-false-next",
        ],
        "type-answer": [
          ...samplePartnerVocabularyAudioCues.map((cue) => cue.audioCueId),
          "cue-sample-publisher-l1-u1-instruction-type-answer",
          "cue-sample-publisher-l1-u1-feedback-type-answer-correct",
        ],
        "balloon-pop": [
          ...samplePartnerVocabularyAudioCues.map((cue) => cue.audioCueId),
          "cue-sample-publisher-l1-u1-instruction-balloon-pop",
          "cue-sample-publisher-l1-u1-feedback-balloon-pop-try-again",
        ],
        "sentence-builder": [
          ...samplePartnerSentenceAudioCues.map((cue) => cue.audioCueId),
          "cue-sample-publisher-l1-u1-instruction-sentence-builder",
          "cue-sample-publisher-l1-u1-feedback-sentence-correct",
        ],
        "speak-it": [
          ...samplePartnerVocabularyAudioCues.map((cue) => cue.audioCueId),
          ...samplePartnerSentenceAudioCues.map((cue) => cue.audioCueId),
          "cue-sample-publisher-l1-u1-instruction-speak-it",
        ],
      },
      fallbackVoice: "tenant-default-child-friendly-en",
    },
  ],
  playlists: [
    {
      playlistId: "playlist-sample-publisher-l1-u1-routines",
      tenantId,
      title: "Unit 1 Routine Media",
      unitKey: samplePartnerUnitKey,
      mediaAssetIds: [
        "media-sample-publisher-l1-u1-routine-chant",
        "media-sample-publisher-l1-u1-daily-routine-video",
      ],
      usageRole: "primary",
      playbackContext: "student-practice",
      textbookReference: samplePartnerTextbookReference,
    },
  ],
  multimediaPlans: [
    {
      unitKey: samplePartnerUnitKey,
      primaryPlaylistId: "playlist-sample-publisher-l1-u1-routines",
      backgroundMediaAssetId: "media-sample-publisher-l1-u1-routine-chant",
      allowedBackgroundGameModes: ["match-up", "memory-match", "balloon-pop", "speak-it"],
      backgroundEnabledByDefault: false,
      defaultVolumePercent: 30,
      requiresTeacherEnablement: true,
    },
  ],
  aiTutorPlans: [
    {
      unitKey: samplePartnerUnitKey,
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

export const samplePartnerPermanentQrRoute: PermanentQrRoute = {
  qrId: "qr-sample-publisher-l1-u1-front-door",
  identifier: {
    tenantId,
    seriesId: "sample-partner-series",
    bookId: "starter-book",
    unitId: "unit-1",
    activityId: "front-door",
    language: "en",
    edition: "pilot-2026",
    version: "0.1",
  },
  targetType: "front-door",
  targetId: "enter:sample-publisher:routines-demo",
  preferredDeployment: "hosted-web",
  fallbackPath: "/enter/sample-publisher",
  updatedAt: "2026-07-01T00:00:00.000Z",
};

export const samplePartnerFrontDoorAccessPolicy: FrontDoorAccessPolicy = {
  tenantId,
  entryCodeRequired: true,
  userCodeRequired: true,
  reportProgressToTeacher: true,
  allowAnonymousPractice: false,
};

export function getSamplePartnerLaunchSession(launchCode = samplePartnerLaunchCode): LaunchSession {
  return createLaunchSession({
    launchCode,
    tenantId,
    curriculumId,
    unitKey: samplePartnerUnitKey,
    entryMode: "flashcards",
    recommendedNextModes: ["match-up", "memory-match", "balloon-pop", "quiz", "true-false", "type-answer", "sentence-builder", "speak-it"],
    openedAt: "2026-07-01T00:00:00.000Z",
  });
}

export function getSamplePartnerFrontDoorLaunchSession(
  launchCode = samplePartnerFrontDoorLaunchCode,
): LaunchSession {
  return createLaunchSession({
    launchCode,
    tenantId,
    curriculumId,
    unitKey: samplePartnerUnitKey,
    entryMode: "flashcards",
    recommendedNextModes: ["match-up", "memory-match", "balloon-pop", "quiz", "true-false", "type-answer", "sentence-builder", "speak-it"],
    openedAt: "2026-07-01T00:00:00.000Z",
    accessMode: "front-door-code",
  });
}

export function getSamplePartnerStudentProgression(launchCode = samplePartnerLaunchCode) {
  const launchSession = getSamplePartnerLaunchSession(launchCode);

  return getInitialStudentProgression({
    studentSessionId: `${launchCode}:sample-student`,
    launchSession,
  });
}

export function getSamplePartnerFrontDoorStudentProgression(
  launchCode = samplePartnerFrontDoorLaunchCode,
  userCode = samplePartnerFrontDoorUserCode.toLowerCase(),
) {
  const launchSession = getSamplePartnerFrontDoorLaunchSession(launchCode);

  return getInitialStudentProgression({
    studentSessionId: `${launchCode}:${userCode}`,
    launchSession,
  });
}

export const samplePartnerLaunchSession = getSamplePartnerLaunchSession();
export const samplePartnerStudentProgression = getSamplePartnerStudentProgression();
export const samplePartnerFrontDoorLaunchSession = getSamplePartnerFrontDoorLaunchSession();
export const samplePartnerFrontDoorStudentProgression = getSamplePartnerFrontDoorStudentProgression();
export const samplePartnerPermanentQrPath = getPermanentQrPath(samplePartnerPermanentQrRoute.identifier);
export const samplePartnerFrontDoorPath = "/enter/sample-publisher";
export const samplePartnerPackageValidationErrors = [
  ...validateContentPackage(samplePartnerContentPackage),
  ...validatePermanentQrRoute(samplePartnerPermanentQrRoute),
];
