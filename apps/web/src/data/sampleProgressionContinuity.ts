import type {
  ProgressionContinuityEnvelope,
  ProgressionContinuityRuntimeRequest,
} from "@living-textbook/content-model";

export const sampleProgressionContinuityEnvelope: ProgressionContinuityEnvelope = {
  continuityId: "continuity-ministar-demo-unit-1",
  tenantId: "ministar",
  packageId: "ministar-l1-u1-greetings-package",
  launchCode: "demo-unit-1",
  studentSessionId: "demo-unit-1:demo-student",
  unitKey: "ministar:ministar-english:L1:U1",
  sourceRoute: "/flashcards/demo-unit-1",
  destinationRoute: "/memory/demo-unit-1",
  issuedAt: "2026-06-28T00:05:00.000Z",
  eventCursor: 7,
  mode: "review-only",
  snapshot: {
    studentSessionId: "demo-unit-1:demo-student",
    launchCode: "demo-unit-1",
    unitKey: "ministar:ministar-english:L1:U1",
    entryMode: "flashcards",
    currentStep: "recommended-game",
    unlockedGameModes: ["flashcards", "match-up", "label-it", "memory-match"],
    completedGameModes: ["flashcards"],
    earnedStarDust: 300,
    masteryStatus: "in-progress",
    lastEventAt: "2026-06-28T00:05:00.000Z",
  },
  rawLearnerAudioIncluded: false,
  learnerTranscriptIncluded: false,
  supportLanguageEvidenceIncluded: false,
  mediaOnlyEvidenceIncluded: false,
};

export const sampleProgressionContinuityRequest: ProgressionContinuityRuntimeRequest = {
  expectedTenantId: "ministar",
  expectedPackageId: "ministar-l1-u1-greetings-package",
  expectedLaunchCode: "demo-unit-1",
  expectedStudentSessionId: "demo-unit-1:demo-student",
  envelope: sampleProgressionContinuityEnvelope,
};
