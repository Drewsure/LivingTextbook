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
  | "training_item_shown"
  | "training_answer_submitted"
  | "training_answer_result"
  | "training_completed"
  | "training_returned_to_unit";

export interface TrainingAcademyRecommendation {
  focusType: TrainingFocusType;
  reason: string;
  sourceGameMode?: GameModeId;
  recommendedGameMode: GameModeId;
  targetTerms: string[];
  targetSentences: [string, string];
  returnPath: string;
  teacherAssigned: boolean;
  maxRecoveryStarDust: number;
}

export interface TrainingAcademyCompletionResult {
  progression: StudentProgressionState;
  earnedStarDust: number;
  event: GameProgressEvent;
}

export function createTrainingAcademyRecommendation(args: {
  unit: UnitPayload;
  launchSession: LaunchSession;
}): TrainingAcademyRecommendation {
  const sourceGameMode = args.launchSession.recommendedNextModes[0] ?? args.launchSession.entryMode;

  return {
    focusType: "vocabulary-review",
    reason: "Review a small set of greeting words before returning to the normal unit path.",
    sourceGameMode,
    recommendedGameMode: args.launchSession.entryMode,
    targetTerms: args.unit.pedagogicalPayload.vocabularyTerms.slice(0, 4),
    targetSentences: args.unit.pedagogicalPayload.targetSentences,
    returnPath: getStudentLaunchPath(args.launchSession.launchCode),
    teacherAssigned: false,
    maxRecoveryStarDust: 100,
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
    recommendedGameMode: args.recommendation.recommendedGameMode,
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
  practicedTermCount: number;
}): TrainingAcademyCompletionResult {
  const earnedStarDust = Math.min(args.recommendation.maxRecoveryStarDust, args.practicedTermCount * 25);
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
        practicedTermCount: args.practicedTermCount,
      },
    }),
  };
}
