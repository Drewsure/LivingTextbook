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
import type { TeacherAssignmentPlan } from "@living-textbook/content-model/src/teacherAssignment";
import { PairingMemoryMatchGame } from "@/features/game-shell/pairing/PairingMemoryMatchGame";
import { PairingEnginePreview } from "@/features/game-shell/pairing/PairingEnginePreview";
import {
  completeFlashcardEntryPractice,
  createRouteGuidanceListenedEvent,
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
import { RecommendedGameRoutesCard } from "./components/RecommendedGameRoutesCard";
import { RewardPreviewCard } from "./components/RewardPreviewCard";
import { SessionEventLog } from "./components/SessionEventLog";
import { StudentProgressHeader } from "./components/StudentProgressHeader";
import { TeacherAssignmentSettingsCard } from "./components/TeacherAssignmentSettingsCard";

interface StudentLaunchFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assistLanguagePlan?: UnitAssistLanguagePlan;
  assignmentPlan?: TeacherAssignmentPlan;
}

export function StudentLaunchFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assistLanguagePlan,
  assignmentPlan,
}: StudentLaunchFlowProps) {
  const [currentProgression, setCurrentProgression] = useState(progression);
  const [sessionEvents, setSessionEvents] = useState<GameProgressEvent[]>([]);
  const [lastEarnedDust, setLastEarnedDust] = useState(0);
  const [activeGameMode, setActiveGameMode] = useState<GameModeId | undefined>();
  const [targetPracticeEngagedItemIds, setTargetPracticeEngagedItemIds] = useState<string[]>([]);

  const entryComplete = currentProgression.completedGameModes.includes(launchSession.entryMode);
  const nextMode = launchSession.recommendedNextModes[0];
  const nextModeUnlocked = launchSession.recommendedNextModes.some((mode) =>
    currentProgression.unlockedGameModes.includes(mode),
  );
  const nextModeStarted = Boolean(nextMode && activeGameMode === nextMode);
  const targetPracticeRequiredCount = unit.pedagogicalPayload.vocabularyTerms.length + unit.pedagogicalPayload.targetSentences.length;
  const targetPracticeEngagedCount = targetPracticeEngagedItemIds.length;
  const targetPracticeReady = entryComplete || targetPracticeEngagedCount >= targetPracticeRequiredCount;
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

  function handleTargetPracticeEngaged(itemId: string) {
    setTargetPracticeEngagedItemIds((itemIds) => (itemIds.includes(itemId) ? itemIds : [...itemIds, itemId]));
  }

  function handleCompleteEntryPractice() {
    if (!targetPracticeReady || entryComplete) {
      return;
    }

    const result = completeFlashcardEntryPractice({
      progression: currentProgression,
      launchSession,
      unit,
      occurredAt: new Date().toISOString(),
      targetLanguageEngagedItems: targetPracticeEngagedCount,
      requiredTargetLanguageItems: targetPracticeRequiredCount,
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

  function handleRouteGuidanceListened(mode: GameModeId, routeStatus: "locked" | "unlocked" | "complete", routeHref: string) {
    appendSessionEvents([
      createRouteGuidanceListenedEvent({
        progression: currentProgression,
        launchSession,
        gameMode: mode,
        routeStatus,
        routeHref,
        occurredAt: new Date().toISOString(),
      }),
    ]);
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
      <TeacherAssignmentSettingsCard assignmentPlan={assignmentPlan} />
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
        targetPracticeEngagedCount={targetPracticeEngagedCount}
        targetPracticeRequiredCount={targetPracticeRequiredCount}
        targetPracticeReady={targetPracticeReady}
        onTargetPracticeEngaged={handleTargetPracticeEngaged}
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
      <RecommendedGameRoutesCard
        launchSession={launchSession}
        progression={currentProgression}
        onRouteGuidanceListened={handleRouteGuidanceListened}
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
