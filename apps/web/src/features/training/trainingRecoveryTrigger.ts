import type {
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
} from "@living-textbook/content-model";
import { getTrainingAcademyPath, getStudentLaunchPath } from "@/features/routes/routeContracts";
import type { TrainingFocusType } from "./trainingAcademyAdapter";

const repeatedMissThreshold = 2;
const lowCompletionRewardThreshold = 120;
const highAttemptRatioThreshold = 2.25;

export type TrainingRecoveryTriggerReason = "repeated-misses" | "low-completion-score";

export interface TrainingRecoveryTriggerRecommendation {
  triggerId: string;
  triggerReason: TrainingRecoveryTriggerReason;
  triggerLabel: string;
  reason: string;
  detail: string;
  recoveryPath: string;
  returnPath: string;
  focusType: TrainingFocusType;
  recommendedGameMode: GameModeId;
  sourceGameMode?: GameModeId;
  missCount: number;
  attempts?: number;
  totalPairs?: number;
  earnedStarDust?: number;
}

export function evaluateTrainingRecoveryTrigger(args: {
  events: GameProgressEvent[];
  launchSession: LaunchSession;
}): TrainingRecoveryTriggerRecommendation | undefined {
  const sourceModes = getSourceModes(args.launchSession);
  const latestLowCompletion = [...args.events]
    .reverse()
    .find((event) => event.type === "game_completed" && sourceModes.includes(event.gameMode) && isLowCompletion(event));

  if (latestLowCompletion) {
    const attempts = getNumberMetadata(latestLowCompletion, "attempts");
    const totalPairs = getNumberMetadata(latestLowCompletion, "totalPairs");
    const earnedStarDust = getNumberMetadata(latestLowCompletion, "earnedStarDust");

    return {
      triggerId: `low-completion-score:${latestLowCompletion.gameMode}`,
      triggerReason: "low-completion-score",
      triggerLabel: "Low completion score",
      reason: "You finished the game, but the score shows extra practice would help. Open Training Academy for a quick review, then return to the unit path.",
      detail: createLowCompletionDetail({ attempts, totalPairs, earnedStarDust }),
      recoveryPath: getTrainingAcademyPath(args.launchSession.launchCode),
      returnPath: getStudentLaunchPath(args.launchSession.launchCode),
      focusType: "vocabulary-review",
      recommendedGameMode: args.launchSession.entryMode,
      sourceGameMode: latestLowCompletion.gameMode,
      missCount: countMisses(args.events, sourceModes),
      attempts,
      totalPairs,
      earnedStarDust,
    };
  }

  const missEvents = args.events.filter(
    (event) => event.type === "answer_result" && sourceModes.includes(event.gameMode) && isIncorrectAnswerResult(event),
  );

  if (missEvents.length >= repeatedMissThreshold) {
    const latestMiss = missEvents[missEvents.length - 1];

    return {
      triggerId: `repeated-misses:${latestMiss.gameMode}`,
      triggerReason: "repeated-misses",
      triggerLabel: "Repeated misses",
      reason: "A few cards were tricky. A short Training Academy review can rebuild confidence before continuing the game.",
      detail: `${missEvents.length} missed pair checks have been recorded in this game.`,
      recoveryPath: getTrainingAcademyPath(args.launchSession.launchCode),
      returnPath: getStudentLaunchPath(args.launchSession.launchCode),
      focusType: "vocabulary-review",
      recommendedGameMode: args.launchSession.entryMode,
      sourceGameMode: latestMiss.gameMode,
      missCount: missEvents.length,
    };
  }

  return undefined;
}

export function createTrainingRecoveryRecommendationEvent(args: {
  recommendation: TrainingRecoveryTriggerRecommendation;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  occurredAt: string;
}): GameProgressEvent {
  return {
    type: "training_recommended",
    unitKey: args.launchSession.unitKey,
    gameMode: args.recommendation.recommendedGameMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
    metadata: {
      trainingEventType: "training_recommended",
      recoveryTriggerId: args.recommendation.triggerId,
      triggerReason: args.recommendation.triggerReason,
      triggerLabel: args.recommendation.triggerLabel,
      focusType: args.recommendation.focusType,
      sourceGameMode: args.recommendation.sourceGameMode ?? "unknown",
      recommendedGameMode: args.recommendation.recommendedGameMode,
      recoveryPath: args.recommendation.recoveryPath,
      returnPath: args.recommendation.returnPath,
      teacherAssigned: false,
      reason: args.recommendation.reason,
      missCount: args.recommendation.missCount,
      attempts: args.recommendation.attempts ?? 0,
      totalPairs: args.recommendation.totalPairs ?? 0,
      earnedStarDust: args.recommendation.earnedStarDust ?? 0,
    },
  };
}

export function hasRecordedTrainingRecoveryRecommendation(
  events: GameProgressEvent[],
  recommendation: TrainingRecoveryTriggerRecommendation,
): boolean {
  return events.some(
    (event) =>
      event.type === "training_recommended" &&
      event.metadata?.trainingEventType === "training_recommended" &&
      event.metadata?.recoveryTriggerId === recommendation.triggerId,
  );
}

function getSourceModes(launchSession: LaunchSession): GameModeId[] {
  if (launchSession.recommendedNextModes.length > 0) {
    return launchSession.recommendedNextModes;
  }

  return [launchSession.entryMode];
}

function isIncorrectAnswerResult(event: GameProgressEvent): boolean {
  return event.metadata?.correct === false || event.metadata?.result === "mismatched";
}

function isLowCompletion(event: GameProgressEvent): boolean {
  const earnedStarDust = getNumberMetadata(event, "earnedStarDust");
  const attempts = getNumberMetadata(event, "attempts");
  const totalPairs = getNumberMetadata(event, "totalPairs");
  const attemptRatio = totalPairs > 0 ? attempts / totalPairs : 0;

  return earnedStarDust <= lowCompletionRewardThreshold || attemptRatio >= highAttemptRatioThreshold;
}

function countMisses(events: GameProgressEvent[], sourceModes: GameModeId[]): number {
  return events.filter(
    (event) => event.type === "answer_result" && sourceModes.includes(event.gameMode) && isIncorrectAnswerResult(event),
  ).length;
}

function getNumberMetadata(event: GameProgressEvent, key: string): number {
  const value = event.metadata?.[key];

  if (typeof value === "number") {
    return value;
  }

  return 0;
}

function createLowCompletionDetail(args: {
  attempts: number;
  totalPairs: number;
  earnedStarDust: number;
}): string {
  const pairDetail = args.totalPairs > 0 ? `${args.attempts} attempts for ${args.totalPairs} pairs` : `${args.attempts} attempts`;

  return `${pairDetail}; reward earned was ${args.earnedStarDust}.`;
}
