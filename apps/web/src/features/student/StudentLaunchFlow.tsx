"use client";

import { useState } from "react";
import type {
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { PairingMemoryMatchGame } from "@/features/game-shell/pairing/PairingMemoryMatchGame";
import { PairingEnginePreview } from "@/features/game-shell/pairing/PairingEnginePreview";
import {
  completeFlashcardEntryPractice,
  startUnlockedGameMode,
  type GameModeCompletionResult,
} from "@/features/progression/localProgressionAdapter";
import { starterRewardCatalog } from "@/features/rewards/rewardCatalog";
import { FlashcardPracticeCard } from "./components/FlashcardPracticeCard";
import { NextGameUnlockCard } from "./components/NextGameUnlockCard";
import { RewardPreviewCard } from "./components/RewardPreviewCard";
import { SessionEventLog } from "./components/SessionEventLog";
import { StudentProgressHeader } from "./components/StudentProgressHeader";
import type { TenantConfig } from "@/features/tenant/types";

interface StudentLaunchFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
}

export function StudentLaunchFlow({ tenant, unit, launchSession, progression }: StudentLaunchFlowProps) {
  const [currentProgression, setCurrentProgression] = useState(progression);
  const [sessionEvents, setSessionEvents] = useState<GameProgressEvent[]>([]);
  const [lastEarnedDust, setLastEarnedDust] = useState(0);
  const [activeGameMode, setActiveGameMode] = useState<GameModeId | undefined>();

  const entryComplete = currentProgression.completedGameModes.includes(launchSession.entryMode);
  const nextMode = launchSession.recommendedNextModes[0];
  const nextModeUnlocked = launchSession.recommendedNextModes.some((mode) =>
    currentProgression.unlockedGameModes.includes(mode),
  );
  const nextModeStarted = Boolean(nextMode && activeGameMode === nextMode);

  function handleCompleteEntryPractice() {
    const result = completeFlashcardEntryPractice({
      progression: currentProgression,
      launchSession,
      unit,
      occurredAt: new Date().toISOString(),
    });

    setCurrentProgression(result.progression);
    setSessionEvents((events) => [...events, ...result.events]);
    setLastEarnedDust(result.dust.total);
  }

  function handleStartNextMode() {
    if (!nextMode || nextModeStarted) {
      return;
    }

    const event = startUnlockedGameMode({
      progression: currentProgression,
      launchSession,
      gameMode: nextMode,
      occurredAt: new Date().toISOString(),
    });

    if (!event) {
      return;
    }

    setActiveGameMode(nextMode);
    setSessionEvents((events) => [...events, event]);
  }

  function handleGameComplete(result: GameModeCompletionResult) {
    setCurrentProgression(result.progression);
    setLastEarnedDust(result.earnedStarDust);

    if (result.event) {
      setSessionEvents((events) => [...events, result.event as GameProgressEvent]);
    }
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <StudentProgressHeader
        tenant={tenant}
        launchSession={launchSession}
        progression={currentProgression}
        entryComplete={entryComplete}
        nextMode={nextMode}
      />
      <FlashcardPracticeCard
        tenant={tenant}
        unit={unit}
        launchSession={launchSession}
        progression={currentProgression}
        entryComplete={entryComplete}
        lastEarnedDust={lastEarnedDust}
        nextMode={nextMode}
        onComplete={handleCompleteEntryPractice}
      />
      <RewardPreviewCard
        tenant={tenant}
        earnedStarDust={currentProgression.earnedStarDust}
        catalog={starterRewardCatalog}
      />
      <NextGameUnlockCard
        nextMode={nextMode}
        unlocked={nextModeUnlocked}
        started={nextModeStarted}
        onStart={handleStartNextMode}
      />
      {activeGameMode === "memory-match" && (
        <PairingMemoryMatchGame
          unit={unit}
          gameMode={activeGameMode}
          launchSession={launchSession}
          progression={currentProgression}
          onComplete={handleGameComplete}
        />
      )}
      {activeGameMode && activeGameMode !== "memory-match" && <PairingEnginePreview unit={unit} gameMode={activeGameMode} />}
      <SessionEventLog events={sessionEvents} />
    </div>
  );
}
