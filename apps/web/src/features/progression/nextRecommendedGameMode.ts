import { getLevelAwareRecommendedGameModes } from "@living-textbook/content-model";
import type { GameModeId, LaunchSession, StudentProgressionState } from "@living-textbook/content-model";

/** Returns the next curated activity that has not yet been completed. */
export function getNextUncompletedRecommendedMode(
  launchSession: LaunchSession,
  progression: StudentProgressionState,
  afterMode?: GameModeId,
): GameModeId | undefined {
  const recommendedModes = getLevelAwareRecommendedGameModes(launchSession);
  const currentIndex = afterMode ? recommendedModes.indexOf(afterMode) : -1;
  const searchStart = currentIndex >= 0 ? currentIndex + 1 : 0;
  const afterCurrent = recommendedModes.slice(searchStart);
  const beforeCurrent = currentIndex >= 0 ? recommendedModes.slice(0, currentIndex) : [];

  return [...afterCurrent, ...beforeCurrent].find((mode) => !progression.completedGameModes.includes(mode));
}
