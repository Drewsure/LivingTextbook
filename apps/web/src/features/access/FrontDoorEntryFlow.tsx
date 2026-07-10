"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import type {
  ContentPackage,
  FrontDoorAccessPolicy,
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { AudioSupportedAction } from "@/features/audio/AudioSupportedAction";
import { PairingMemoryMatchGame } from "@/features/game-shell/pairing/PairingMemoryMatchGame";
import { PairingEnginePreview } from "@/features/game-shell/pairing/PairingEnginePreview";
import { UnitMediaEngagementPanel } from "@/features/multimedia/UnitMediaEngagementPanel";
import {
  completeFlashcardEntryPractice,
  createLaunchOpenedEvent,
  createRouteGuidanceListenedEvent,
  startUnlockedGameMode,
  type GameModeCompletionResult,
} from "@/features/progression/localProgressionAdapter";
import { UnitSessionProgressSummary } from "@/features/progression/UnitSessionProgressSummary";
import { starterRewardCatalog } from "@/features/rewards/rewardCatalog";
import { FlashcardPracticeCard } from "@/features/student/components/FlashcardPracticeCard";
import { NextGameUnlockCard } from "@/features/student/components/NextGameUnlockCard";
import { RecommendedGameRoutesCard } from "@/features/student/components/RecommendedGameRoutesCard";
import { RewardPreviewCard } from "@/features/student/components/RewardPreviewCard";
import { FrontDoorTeacherReportPreview } from "./FrontDoorTeacherReportPreview";
import type { TenantConfig } from "@/features/tenant/types";

interface FrontDoorEntryFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  contentPackage: ContentPackage;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  accessPolicy: FrontDoorAccessPolicy;
  expectedEntryCode: string;
  expectedUserCode: string;
  allowedUserCodes?: string[];
}

export function FrontDoorEntryFlow({
  tenant,
  unit,
  contentPackage,
  launchSession,
  progression,
  accessPolicy,
  expectedEntryCode,
  expectedUserCode,
  allowedUserCodes,
}: FrontDoorEntryFlowProps) {
  const [entryCode, setEntryCode] = useState(expectedEntryCode);
  const [userCode, setUserCode] = useState(expectedUserCode);
  const [entryError, setEntryError] = useState<string | undefined>();
  const [unitOpen, setUnitOpen] = useState(false);
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
  const mediaAssetCount = contentPackage.mediaAssets?.length ?? 0;
  const acceptedUserCodes = Array.from(
    new Set([expectedUserCode, ...(allowedUserCodes ?? [])].map((code) => code.trim()).filter(Boolean)),
  );
  const acceptedUserCodeSet = new Set(acceptedUserCodes.map((code) => code.toUpperCase()));
  const targetPracticeRequiredCount = unit.pedagogicalPayload.vocabularyTerms.length + unit.pedagogicalPayload.targetSentences.length;
  const targetPracticeEngagedCount = targetPracticeEngagedItemIds.length;
  const targetPracticeReady = entryComplete || targetPracticeEngagedCount >= targetPracticeRequiredCount;
  const assistLanguagePlan = contentPackage.assistLanguagePlans?.find(
    (plan) => plan.unitKey === launchSession.unitKey && plan.studentVisibility !== "teacher-only",
  );

  function handleOpenUnit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (accessPolicy.entryCodeRequired && entryCode.trim().toUpperCase() !== expectedEntryCode.toUpperCase()) {
      setEntryError("Check the entry code from your teacher or textbook page.");
      return;
    }

    if (accessPolicy.userCodeRequired && !acceptedUserCodeSet.has(userCode.trim().toUpperCase())) {
      setEntryError("Check the user code so your teacher can see this progress.");
      return;
    }

    const normalizedUserCode = userCode.trim();
    const progressionForLearner: StudentProgressionState = normalizedUserCode
      ? {
          ...currentProgression,
          studentSessionId: `${launchSession.launchCode}:${normalizedUserCode.toLowerCase()}`,
        }
      : currentProgression;

    setEntryError(undefined);
    setCurrentProgression(progressionForLearner);
    setUnitOpen(true);

    if (sessionEvents.length === 0) {
      setSessionEvents([
        createLaunchOpenedEvent({
          progression: progressionForLearner,
          launchSession,
          occurredAt: new Date().toISOString(),
          entryCode,
          userCode: normalizedUserCode,
        }),
      ]);
    }
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

  function handleProgressEvent(event: GameProgressEvent) {
    setSessionEvents((events) => [...events, event]);
  }

  function handleRouteGuidanceListened(mode: GameModeId, routeStatus: "locked" | "unlocked" | "complete", routeHref: string) {
    setSessionEvents((events) => [
      ...events,
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
      setSessionEvents((events) => [...events, result.event as GameProgressEvent]);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="space-y-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Textbook front door</p>
              <h2 className="mt-1 text-2xl font-bold">{tenant.displayName}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
                Enter the sample class code to open the reviewed unit package with flashcards, Memory Match, playlist media, and reportable progress.
              </p>
            </div>
            <StatusPill label={unitOpen ? "Unit open" : "Code required"} tone={unitOpen ? "success" : "neutral"} />
          </div>

          <form onSubmit={handleOpenUnit} className="mt-5 grid gap-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="grid gap-2 text-sm font-semibold">
              Entry code
              <input
                value={entryCode}
                onChange={(event) => setEntryCode(event.target.value)}
                className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 text-sm font-normal text-[var(--tenant-text)] outline-none focus:border-[var(--tenant-primary)]"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              User code
              <input
                value={userCode}
                onChange={(event) => setUserCode(event.target.value)}
                className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 text-sm font-normal text-[var(--tenant-text)] outline-none focus:border-[var(--tenant-primary)]"
              />
            </label>
            <AudioSupportedAction type="submit" audioText="Open unit">
              Open unit
            </AudioSupportedAction>
          </form>

          {entryError && <p className="mt-3 text-sm font-semibold text-amber-800">{entryError}</p>}
          <p className="mt-3 text-xs text-[var(--tenant-muted)]">
            Demo entry code: {expectedEntryCode}. Demo learner codes: {acceptedUserCodes.join(", ")}. These are roster slots for classroom reporting, not production student accounts.
          </p>
        </Card>

        {unitOpen && (
          <>
            <UnitSessionProgressSummary
              title="Unit Session"
              launchSession={launchSession}
              progression={currentProgression}
              events={sessionEvents}
              rewardName={tenant.rewardName}
              mediaAssetCount={mediaAssetCount}
            />
            <FlashcardPracticeCard
              tenant={tenant}
              unit={unit}
              launchSession={launchSession}
              progression={currentProgression}
              entryComplete={entryComplete}
              lastEarnedDust={lastEarnedDust}
              nextMode={nextMode}
              audioCues={contentPackage.audioCues}
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
                audioCues={contentPackage.audioCues}
                onEvent={handleProgressEvent}
                onComplete={handleGameComplete}
              />
            )}
            {activeGameMode && activeGameMode !== "memory-match" && <PairingEnginePreview unit={unit} gameMode={activeGameMode} />}
            <UnitMediaEngagementPanel
              contentPackage={contentPackage}
              launchSession={launchSession}
              progression={currentProgression}
              activeGameMode={activeGameMode}
              onEvent={handleProgressEvent}
            />
          </>
        )}
      </section>
      <aside className="space-y-5">
        <FrontDoorTeacherReportPreview tenant={tenant} progression={currentProgression} events={sessionEvents} />
      </aside>
    </div>
  );
}
