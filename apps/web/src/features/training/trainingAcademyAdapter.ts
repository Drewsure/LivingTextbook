import type {
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { getStudentLaunchPath } from "@/features/routes/routeContracts";

export type TrainingFocusType =
  | "vocabulary-review"
  | "sentence-review"
  | "audio-listening"
  | "spelling-review"
  | "mode-practice"
  | "mixed-recovery";

export type TrainingAcademyEventName =
  | "training_recommended"
  | "training_started"
  | "training_focus_selected"
  | "training_item_shown"
  | "training_answer_submitted"
  | "training_answer_result"
  | "training_completed"
  | "training_returned_to_unit";

export interface TrainingAcademyFocusConfig {
  focusType: TrainingFocusType;
  label: string;
  practiceTitle: string;
  description: string;
  studentInstruction: string;
  targetItems: string[];
  recommendedGameMode: GameModeId;
  maxRecoveryStarDust: number;
}

export interface TrainingAcademyRecommendation extends TrainingAcademyFocusConfig {
  reason: string;
  sourceGameMode?: GameModeId;
  targetTerms: string[];
  targetSentences: [string, string];
  returnPath: string;
  teacherAssigned: boolean;
}

export interface TrainingAcademyCompletionResult {
  progression: StudentProgressionState;
  earnedStarDust: number;
  event: GameProgressEvent;
}

export function createTrainingAcademyFocusConfigs(args: {
  unit: UnitPayload;
  launchSession: LaunchSession;
}): TrainingAcademyFocusConfig[] {
  const sourceGameMode = args.launchSession.recommendedNextModes[0] ?? args.launchSession.entryMode;
  const vocabularyTerms = args.unit.pedagogicalPayload.vocabularyTerms.slice(0, 4);
  const shortTerms = vocabularyTerms.slice(0, 3);
  const sentenceItems = args.unit.pedagogicalPayload.targetSentences;

  return [
    {
      focusType: "vocabulary-review",
      label: "Vocabulary",
      practiceTitle: "Vocabulary review",
      description: "Review a small set of key words before returning to the normal unit path.",
      studentInstruction: "Listen, say the word, then tap the next word.",
      targetItems: vocabularyTerms,
      recommendedGameMode: args.launchSession.entryMode,
      maxRecoveryStarDust: 100,
    },
    {
      focusType: "sentence-review",
      label: "Sentences",
      practiceTitle: "Sentence review",
      description: "Hear and repeat the target sentence patterns before trying the next activity again.",
      studentInstruction: "Listen to each sentence. Say it slowly, then say it again with confidence.",
      targetItems: [...sentenceItems],
      recommendedGameMode: "sentence-builder",
      maxRecoveryStarDust: 120,
    },
    {
      focusType: "audio-listening",
      label: "Listening",
      practiceTitle: "Listening review",
      description: "Use audio-first practice for students who need to hear the language again before reading or matching.",
      studentInstruction: "Tap, listen, point, and repeat. You do not need to read quickly.",
      targetItems: [...shortTerms, ...sentenceItems],
      recommendedGameMode: "speak-it",
      maxRecoveryStarDust: 100,
    },
    {
      focusType: "spelling-review",
      label: "Spelling",
      practiceTitle: "Spelling review",
      description: "Slow the word down into sounds and letters before returning to a faster game.",
      studentInstruction: "Listen to the word, say it, then spell it out loud.",
      targetItems: vocabularyTerms,
      recommendedGameMode: args.launchSession.entryMode,
      maxRecoveryStarDust: 100,
    },
    {
      focusType: "mode-practice",
      label: "Game practice",
      practiceTitle: "Mode practice",
      description: "Practice the current game pattern in a calm, unscored lane before returning to the normal mode.",
      studentInstruction: "Listen first, choose slowly, and focus on the game pattern.",
      targetItems: [...shortTerms, ...sentenceItems.slice(0, 1)],
      recommendedGameMode: sourceGameMode,
      maxRecoveryStarDust: 100,
    },
  ];
}

export function createTrainingAcademyRecommendation(args: {
  unit: UnitPayload;
  launchSession: LaunchSession;
  focusType?: TrainingFocusType;
}): TrainingAcademyRecommendation {
  const sourceGameMode = args.launchSession.recommendedNextModes[0] ?? args.launchSession.entryMode;
  const focusConfigs = createTrainingAcademyFocusConfigs(args);
  const selectedConfig = focusConfigs.find((config) => config.focusType === args.focusType) ?? focusConfigs[0];

  return {
    ...selectedConfig,
    reason: selectedConfig.description,
    sourceGameMode,
    targetTerms: args.unit.pedagogicalPayload.vocabularyTerms.slice(0, 4),
    targetSentences: args.unit.pedagogicalPayload.targetSentences,
    returnPath: getStudentLaunchPath(args.launchSession.launchCode),
    teacherAssigned: false,
  };
}

export function createTrainingProgressEvent(args: {
  trainingEventType: TrainingAcademyEventName;
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  recommendation: TrainingAcademyRecommendation;
  occurredAt: string;
  gameMode?: GameModeId;
  metadata?: Record<string, string | number | boolean>;
}): GameProgressEvent {
  const metadata: Record<string, string | number | boolean> = {
    trainingEventType: args.trainingEventType,
    focusType: args.recommendation.focusType,
    focusLabel: args.recommendation.label,
    recommendedGameMode: args.recommendation.recommendedGameMode,
    targetItemCount: args.recommendation.targetItems.length,
    returnPath: args.recommendation.returnPath,
    teacherAssigned: args.recommendation.teacherAssigned,
    ...args.metadata,
  };

  if (args.recommendation.sourceGameMode) {
    metadata.sourceGameMode = args.recommendation.sourceGameMode;
  }

  return {
    type: "training_recommended",
    unitKey: args.launchSession.unitKey,
    gameMode: args.gameMode ?? args.recommendation.recommendedGameMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
    metadata,
  };
}

export function completeTrainingReview(args: {
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  recommendation: TrainingAcademyRecommendation;
  occurredAt: string;
  practicedItemCount: number;
}): TrainingAcademyCompletionResult {
  const earnedStarDust = Math.min(args.recommendation.maxRecoveryStarDust, args.practicedItemCount * 25);
  const progression: StudentProgressionState = {
    ...args.progression,
    currentStep: "recommended-game",
    earnedStarDust: args.progression.earnedStarDust + earnedStarDust,
    masteryStatus: "in-progress",
    lastEventAt: args.occurredAt,
  };

  return {
    progression,
    earnedStarDust,
    event: createTrainingProgressEvent({
      trainingEventType: "training_completed",
      progression,
      launchSession: args.launchSession,
      recommendation: args.recommendation,
      occurredAt: args.occurredAt,
      metadata: {
        earnedStarDust,
        practicedItemCount: args.practicedItemCount,
        practicedTermCount: args.practicedItemCount,
      },
    }),
  };
}
