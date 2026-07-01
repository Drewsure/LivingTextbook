import type {
  ContentPackage,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { resolveSampleLaunchContext } from "./sampleLaunchResolver";
import type { TenantConfig } from "@/features/tenant/types";

type ProgressGameMode = StudentProgressionState["unlockedGameModes"][number];

export interface TeacherSessionMonitorMetric {
  label: string;
  value: string;
  note: string;
}

export interface TeacherSessionMonitorContext {
  tenant: TenantConfig;
  contentPackage: ContentPackage;
  unit?: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  events: GameProgressEvent[];
  metrics: TeacherSessionMonitorMetric[];
  readinessNotes: string[];
}

export function resolveSampleTeacherSessionMonitorContext(launchCode: string): TeacherSessionMonitorContext {
  const launchContext = resolveSampleLaunchContext(launchCode);
  const isPartner = launchContext.tenant.tenantId === "sample-publisher";
  const events = createSampleMonitorEvents(launchContext.launchSession, isPartner);
  const latestEvent = events[events.length - 1];
  const progression = createMonitorProgression(launchContext.progression, launchContext.launchSession, latestEvent);

  return {
    tenant: launchContext.tenant,
    contentPackage: launchContext.contentPackage,
    unit: launchContext.unit,
    launchSession: launchContext.launchSession,
    progression,
    events,
    metrics: createMonitorMetrics({
      isPartner,
      launchSession: launchContext.launchSession,
      eventCount: events.length,
      rewardName: launchContext.tenant.rewardName,
    }),
    readinessNotes: [
      "This route uses reviewed sample data and local event examples only.",
      "A real classroom monitor needs persisted launch sessions, event storage, student/session policy, and export controls.",
      "Support-language taps may appear in reports, but only target-language engagement can unlock progression.",
      "Premium AI Tutor, speech scoring, transcript storage, and cloud audio upload remain optional tenant add-ons.",
    ],
  };
}

function createMonitorProgression(
  progression: StudentProgressionState,
  launchSession: LaunchSession,
  latestEvent?: GameProgressEvent,
): StudentProgressionState {
  return {
    ...progression,
    currentStep: "completion-review",
    unlockedGameModes: uniqueModes([...progression.unlockedGameModes, ...launchSession.recommendedNextModes, "speak-it"]),
    completedGameModes: uniqueModes([...progression.completedGameModes, launchSession.entryMode, "memory-match"]),
    earnedStarDust: 425,
    masteryStatus: "in-progress",
    lastEventAt: latestEvent?.occurredAt,
  };
}

function uniqueModes(modes: ProgressGameMode[]): ProgressGameMode[] {
  return Array.from(new Set(modes));
}

function createMonitorMetrics(args: {
  isPartner: boolean;
  launchSession: LaunchSession;
  eventCount: number;
  rewardName: string;
}): TeacherSessionMonitorMetric[] {
  return [
    {
      label: "Launch code",
      value: args.launchSession.launchCode,
      note: "Stable classroom session identifier for the demo route.",
    },
    {
      label: "Students visible",
      value: args.isPartner ? "8" : "12",
      note: "Sample count only; production needs persisted class/session records.",
    },
    {
      label: "Report events",
      value: String(args.eventCount),
      note: "Game, media, recovery, and speech-practice records share one stream.",
    },
    {
      label: args.rewardName,
      value: "425",
      note: "Sample earned reward total, not a stored production grade.",
    },
  ];
}

function createSampleMonitorEvents(launchSession: LaunchSession, isPartner: boolean): GameProgressEvent[] {
  const unitKey = launchSession.unitKey;
  const launchCode = launchSession.launchCode;
  const studentSessionId = `${launchCode}:${isPartner ? "partner-student-02" : "student-04"}`;
  const mediaAssetId = isPartner ? "media-sample-publisher-u1-morning-song" : "media-ministar-l1-u1-greetings-chant";

  return [
    {
      type: "launch_opened",
      unitKey,
      gameMode: "flashcards",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:01:00.000Z",
      metadata: {
        reportable: true,
        supportLanguageUnlockAllowed: false,
      },
    },
    {
      type: "entry_practice_completed",
      unitKey,
      gameMode: "flashcards",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:05:00.000Z",
      metadata: {
        targetLanguageItemsHeard: 8,
        supportLanguageTaps: isPartner ? 0 : 5,
        supportLanguageUnlockAllowed: false,
      },
    },
    {
      type: "game_unlocked",
      unitKey,
      gameMode: "memory-match",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:05:20.000Z",
      metadata: {
        unlockedBy: "target-language-entry-practice",
      },
    },
    {
      type: "media_started",
      unitKey,
      gameMode: "flashcards",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:06:00.000Z",
      metadata: {
        mediaAssetId,
        playbackContext: "unit-home",
      },
    },
    {
      type: "game_started",
      unitKey,
      gameMode: "memory-match",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:07:00.000Z",
      metadata: {
        parentEngine: "pairing",
      },
    },
    {
      type: "answer_result",
      unitKey,
      gameMode: "memory-match",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:08:00.000Z",
      metadata: {
        correct: true,
        term: isPartner ? "wake up" : "hello",
        targetLanguageAttempt: true,
      },
    },
    {
      type: "training_recommended",
      unitKey,
      gameMode: "flashcards",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:09:00.000Z",
      metadata: {
        trainingEventType: "training_recommended",
        focusType: "vocabulary-review",
        sourceGameMode: "memory-match",
        recommendedGameMode: "flashcards",
        returnPath: `/launch/${launchCode}`,
        teacherAssigned: false,
        targetTermCount: 4,
      },
    },
    {
      type: "training_recommended",
      unitKey,
      gameMode: "flashcards",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:10:00.000Z",
      metadata: {
        trainingEventType: "training_completed",
        focusType: "vocabulary-review",
        sourceGameMode: "memory-match",
        returnPath: `/launch/${launchCode}`,
        earnedStarDust: 100,
      },
    },
    {
      type: "game_completed",
      unitKey,
      gameMode: "memory-match",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:12:00.000Z",
      metadata: {
        earnedStarDust: 325,
        accuracyPercent: 88,
      },
    },
    {
      type: "game_started",
      unitKey,
      gameMode: "speak-it",
      launchCode,
      studentSessionId,
      occurredAt: "2026-07-01T00:13:00.000Z",
      metadata: {
        microphoneAllowedByTeacher: false,
        recordReplayOnly: true,
        premiumSpeechScoringEnabled: false,
      },
    },
  ];
}
