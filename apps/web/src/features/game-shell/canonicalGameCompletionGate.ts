import { validateCanonicalGameEventSequence } from "@living-textbook/content-model";
import type { GameModeId, GameProgressEvent } from "@living-textbook/content-model";
import type { GameModeCompletionResult } from "@/features/progression/localProgressionAdapter";

export interface CanonicalGameCompletionGateArgs {
  events: GameProgressEvent[];
  result: GameModeCompletionResult;
  gameMode: GameModeId;
  tenantId: string;
  identity: {
    unitKey: string;
    launchCode: string;
    studentSessionId: string;
  };
}

export interface CanonicalGameCompletionGateResult {
  valid: boolean;
  errors: string[];
}

export function validateCanonicalGameCompletion({
  events,
  result,
  gameMode,
  tenantId,
  identity,
}: CanonicalGameCompletionGateArgs): CanonicalGameCompletionGateResult {
  if (!result.event) {
    return {
      valid: false,
      errors: ["Canonical game completion did not include a completion event."],
    };
  }

  const replay = validateCanonicalGameEventSequence(
    [...events.filter((event) => event.gameMode === gameMode), result.event],
    gameMode,
    tenantId,
    result.earnedStarDust,
    identity,
  );

  return {
    valid: replay.valid,
    errors: replay.errors,
  };
}
