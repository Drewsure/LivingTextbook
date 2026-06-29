"use client";

import { useState } from "react";
import type {
  AudioCue,
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitAssistLanguagePlan,
  UnitPayload,
} from "@living-textbook/content-model";
import { PairingMemoryMatchGame } from "@/features/game-shell/pairing/PairingMemoryMatchGame";
import { PairingEnginePreview } from "@/features/game-shell/pairing/PairingEnginePreview";
import {
  completeFlashcardEntryPractice,
  startUnlockedGameMode,
  type GameModeCompletionResult,
} from "@/features/progression/localProgressionAdapter";
import { UnitSessionProgressSummary } from "@/features/progression/UnitSessionProgressSummary";
import { starterRewardCatalog } from "@/features/rewards/rewardCatalog";
import type { TenantConfig } from "@/features/tenant/types";
import { TrainingRecoveryRecommendationCard } from "@/features/training/TrainingRecoveryRecommendationCard";
import {
  createTrainingRecoveryRecommendationEvent,
  evaluateTrainingRecoveryTrigger,
  hasRecordedTrainingRecoveryRecommendation,
} from "@/features/training/trainingRecoveryTrigger";
import { FlashcardPracticeCard } from "./components/FlashcardPracticeCard";
import { NextGameUnlockCard } from "./components/NextGameUnlockCard";
import { RewardPreviewCard } from "./components/RewardPreviewCard";
import { SessionEventLog } from "./components/SessionEventLog";
import { StudentProgressHeader } from "./components/StudentProgressHeader";

interface StudentLaunchFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assistLanguagePlan?: UnitAssistLanguagePlan;
}

export function StudentLaunchFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assistLanguagePlan,
}: StudentLaunchFlowProps) {
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
  const recoveryRecommendation = evaluateTrainingRecoveryTrigger({
    events: sessionEvents,
    launchSession,
  });

  function appendSessionEvents(
    nextEvents: GameProgressEvent[],
    progressionForRecommendation: StudentProgressionState = currentProgression,
  ) {
    if (nextEvents.length === 0) {
      return;
    }

    setSessionEvents((events) => {
      const updatedEvents = [...events, ...nextEvents];
      const recommendation = evaluateTrainingRecoveryTrigger({
        events: updatedEvents,
        launchSession,
      });

      if (!recommendation || hasRecordedTrainingRecoveryRecommendation(updatedEvents, recommendation)) {
        return updatedEvents;
      }

      return [
        ...updatedEvents,
        createTrainingRecoveryRecommendationEvent({
          recommendation,
          launchSession,
          progression: progressionForRecommendation,
          occurredAt: new Date().toISOString(),
        }),
      ];
    });
  }

  function handleCompleteEntryPractice() {
    const result = completeFlashcardEntryPractice({
      progression: currentProgression,
      launchSession,
      unit,
      occurredAt: new Date().toISOString(),
    });

    setCurrentProgression(result.progression);
    appendSessionEvents(result.events, result.progression);
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
    appendSessionEvents([event]);
  }

  function handleGameEvent(event: GameProgressEvent) {
    appendSessionEvents([event]);
  }

  function handleGameComplete(result: GameModeCompletionResult) {
    setCurrentProgression(result.progression);
    setLastEarnedDust(result.earnedStarDust);

    if (result.event) {
      appendSessionEvents([result.event], result.progression);
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
      <UnitSessionProgressSummary
        title="Student Progress"
        launchSession={launchSession}
        progression={currentProgression}
        events={sessionEvents}
        rewardName={tenant.rewardName}
      />
      <FlashcardPracticeCard
        tenant={tenant}
        unit={unit}
        launchSession={launchSession}
        progression={currentProgression}
        entryComplete={entryComplete}
        lastEarnedDust={lastEarnedDust}
        nextMode={nextMode}
        audioCues={audioCues}
        assistLanguagePlan={assistLanguagePlan}
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
          audioCues={audioCues}
          onEvent={handleGameEvent}
          onComplete={handleGameComplete}
        />
      )}
      {activeGameMode && activeGameMode !== "memory-match" && <PairingEnginePreview unit={unit} gameMode={activeGameMode} />}
      {recoveryRecommendation && (
        <TrainingRecoveryRecommendationCard recommendation={recoveryRecommendation} rewardName={tenant.rewardName} />
      )}
      <SessionEventLog events={sessionEvents} />
    </div>
  );
}
