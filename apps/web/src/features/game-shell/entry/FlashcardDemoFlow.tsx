"use client";

import { useEffect, useState } from "react";
import { getGameAudioCoverage, resolveCanonicalGameReplaySeed, resolveTargetLanguage } from "@living-textbook/content-model";
import type {
  AudioCue,
  ContentPackage,
  GameAudioCoverage,
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  UnitAudioSupportPlan,
  StudentProgressionState,
  TeacherSessionSettings,
  UnitAssistLanguagePlan,
  UnitPayload,
} from "@living-textbook/content-model";
import type { TeacherAssignmentPlan } from "@living-textbook/content-model";
import type { UnitGameOfferMap } from "@living-textbook/content-model";
import { UnitSessionProgressSummary } from "@/features/progression/UnitSessionProgressSummary";
import { getNextUncompletedRecommendedMode } from "@/features/progression/nextRecommendedGameMode";
import {
  completeFlashcardEntryPractice,
  createRouteGuidanceListenedEvent,
} from "@/features/progression/localProgressionAdapter";
import { starterRewardCatalog } from "@/features/rewards/rewardCatalog";
import { getCollectionPath } from "@/features/routes/routeContracts";
import { saveProgressionRouteHandoff } from "@/features/persistence/progressionHandoffStore";
import { appendLocalSessionEvidence } from "@/features/persistence/localSessionEvidenceStore";
import { FlashcardPracticeCard } from "@/features/student/components/FlashcardPracticeCard";
import { LaunchContextSafetyCard } from "@/features/student/components/LaunchContextSafetyCard";
import { RecommendedGameRoutesCard } from "@/features/student/components/RecommendedGameRoutesCard";
import { RewardPreviewCard } from "@/features/student/components/RewardPreviewCard";
import { SessionEventLog } from "@/features/student/components/SessionEventLog";
import { StudentProgressHeader } from "@/features/student/components/StudentProgressHeader";
import { TeacherAssignmentSettingsCard } from "@/features/student/components/TeacherAssignmentSettingsCard";
import {
  getDefaultAssistLanguageEnabled,
  getTeacherAssistLanguageApprovalStorageKey,
  parseStoredTeacherAssistLanguageApproval,
} from "@/features/tenant/assistLanguageSettings";
import type { TenantConfig } from "@/features/tenant/types";
import { GameLearningAudioContractCard } from "../components/GameLearningAudioContractCard";
import { GameRouteHeaderCard } from "../components/GameRouteHeaderCard";

interface FlashcardDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  sessionSettings?: TeacherSessionSettings;
  contentPackage: ContentPackage;
  audioCues?: AudioCue[];
  audioSupportPlan?: UnitAudioSupportPlan;
  assistLanguagePlan?: UnitAssistLanguagePlan;
  assignmentPlan?: TeacherAssignmentPlan;
  offerMap?: UnitGameOfferMap;
}

export function FlashcardDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  sessionSettings,
  contentPackage,
  audioCues = [],
  audioSupportPlan,
  assistLanguagePlan,
  assignmentPlan,
  offerMap,
}: FlashcardDemoFlowProps) {
  const [currentProgression, setCurrentProgression] = useState<StudentProgressionState>(progression);
  const [sessionEvents, setSessionEvents] = useState<GameProgressEvent[]>([]);
  const [lastEarnedDust, setLastEarnedDust] = useState(0);
  const [targetPracticeEngagedItemIds, setTargetPracticeEngagedItemIds] = useState<string[]>([]);
  const [routeHandoffErrors, setRouteHandoffErrors] = useState<string[]>([]);
  const [localEvidenceErrors, setLocalEvidenceErrors] = useState<string[]>([]);
  const [assistLanguageEnabled, setAssistLanguageEnabled] = useState(
    sessionSettings?.assistLanguage.enabled ?? getDefaultAssistLanguageEnabled(tenant),
  );

  const entryComplete = currentProgression.completedGameModes.includes(launchSession.entryMode);
  const nextMode = getNextUncompletedRecommendedMode(launchSession, currentProgression);
  const targetLanguage = resolveTargetLanguage({
    tenantTargetLanguage: tenant.languageSettings?.targetLanguage,
    unitLanguage: unit.unitMeta.textbookReference?.language,
  });
  const audioCoverage: GameAudioCoverage = getGameAudioCoverage({
    unit,
    audioCues,
    audioSupportPlan,
    gameMode: launchSession.entryMode,
    targetLanguage,
  });
  const replaySeed = resolveCanonicalGameReplaySeed({
    unitKey: launchSession.unitKey,
    gameMode: launchSession.entryMode,
  });
  const targetPracticeRequiredCount = unit.pedagogicalPayload.vocabularyTerms.length + unit.pedagogicalPayload.targetSentences.length;
  const targetPracticeEngagedCount = targetPracticeEngagedItemIds.length;
  const targetPracticeReady = audioCoverage.ready && (entryComplete || targetPracticeEngagedCount >= targetPracticeRequiredCount);
  const activeAssistLanguagePlan = assistLanguageEnabled ? assistLanguagePlan : undefined;

  useEffect(() => {
    if (sessionEvents.length === 0) return;

    const result = appendLocalSessionEvidence({
      packageId: contentPackage.meta.packageId,
      launchSession,
      progression: currentProgression,
      events: sessionEvents,
      savedAt: new Date().toISOString(),
    });
    setLocalEvidenceErrors(result.errors);
  }, [contentPackage.meta.packageId, currentProgression, launchSession, sessionEvents]);

  useEffect(() => {
    if (sessionSettings?.assistLanguage.teacherEnablementPersisted) {
      setAssistLanguageEnabled(sessionSettings.assistLanguage.enabled);
      return;
    }

    const storageKey = getTeacherAssistLanguageApprovalStorageKey(tenant.id);

    function syncAssistLanguageApproval() {
      const storedApproval = parseStoredTeacherAssistLanguageApproval(window.localStorage.getItem(storageKey));
      setAssistLanguageEnabled(storedApproval ?? sessionSettings?.assistLanguage.enabled ?? getDefaultAssistLanguageEnabled(tenant));
    }

    syncAssistLanguageApproval();
    window.addEventListener("storage", syncAssistLanguageApproval);

    return () => window.removeEventListener("storage", syncAssistLanguageApproval);
  }, [tenant, sessionSettings]);

  function appendSessionEvents(nextEvents: GameProgressEvent[]) {
    if (nextEvents.length === 0) {
      return;
    }

    setSessionEvents((events) => [...events, ...nextEvents]);
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
    appendSessionEvents(result.events);
    setLastEarnedDust(result.dust.total);
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

  function handleRouteOpen(mode: GameModeId, routeHref: string) {
    const result = saveProgressionRouteHandoff({
      packageId: contentPackage.meta.packageId,
      launchSession,
      progression: currentProgression,
      sourceRoute: window.location.pathname,
      destinationRoute: routeHref,
      eventCursor: sessionEvents.length,
      continuityId: `continuity-${launchSession.launchCode}-${mode}-${sessionEvents.length}`,
    });
    if (result.errors.length > 0) {
      setRouteHandoffErrors(result.errors.map((error) => `Route handoff: ${error}`));
      return;
    }

    setRouteHandoffErrors([]);
    window.location.assign(routeHref);
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <GameRouteHeaderCard
        eyebrow="Core entry slice"
        title={`Flashcards: ${unit.unitMeta.theme}`}
        summary="Listen to every reviewed English term and target sentence before completion. Support language can help comprehension, but only target-language practice unlocks the next game."
        statusLabel="Entry"
        statusTone={entryComplete ? "success" : "neutral"}
      />

      <StudentProgressHeader
        tenant={tenant}
        launchSession={launchSession}
        progression={currentProgression}
        entryComplete={entryComplete}
        nextMode={nextMode}
      />
      <LaunchContextSafetyCard
        title="Controlled flashcard practice"
        accessLabel={assignmentPlan ? "Private assignment preview" : "Direct demo route"}
        reportLabel={sessionSettings?.reporting.reportProgressToTeacher ? "Teacher report preview" : "Reports off"}
      />
      <TeacherAssignmentSettingsCard assignmentPlan={assignmentPlan} />
      <UnitSessionProgressSummary
        title="Flashcard Progress"
        launchSession={launchSession}
        progression={currentProgression}
        events={sessionEvents}
        rewardName={tenant.rewardName}
        targetLanguage={targetLanguage}
      />
      <GameLearningAudioContractCard
        tenant={tenant}
        unit={unit}
        launchSession={launchSession}
        progression={currentProgression}
        gameMode={launchSession.entryMode}
        audioCues={audioCues}
        audioSupportPlan={audioSupportPlan}
        replaySeed={replaySeed}
        onAudioRequested={(event) => appendSessionEvents([event])}
        coverage={audioCoverage}
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
        assistLanguagePlan={activeAssistLanguagePlan}
        targetPracticeEngagedCount={targetPracticeEngagedCount}
        targetPracticeRequiredCount={targetPracticeRequiredCount}
        targetPracticeReady={targetPracticeReady}
        audioCoverage={audioCoverage}
        onTargetPracticeEngaged={handleTargetPracticeEngaged}
        onComplete={handleCompleteEntryPractice}
      />
      <RewardPreviewCard
        tenant={tenant}
        earnedStarDust={currentProgression.earnedStarDust}
        catalog={starterRewardCatalog}
        collectionHref={getCollectionPath(launchSession.launchCode)}
      />
      <RecommendedGameRoutesCard
        launchSession={launchSession}
        progression={currentProgression}
        unit={unit}
        audioCues={audioCues}
        audioSupportPlan={audioSupportPlan}
        targetLanguage={resolveTargetLanguage({ tenantTargetLanguage: tenant.languageSettings?.targetLanguage, unitLanguage: unit.unitMeta.textbookReference?.language })}
        offerMap={offerMap}
        onRouteGuidanceListened={handleRouteGuidanceListened}
        onRouteOpen={handleRouteOpen}
      />
      <SessionEventLog events={sessionEvents} />
      {routeHandoffErrors.length > 0 ? (
        <aside className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-950" aria-live="polite">
          <p className="font-bold">The next activity could not be opened</p>
          <ul className="mt-2 grid gap-1">
            {routeHandoffErrors.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </aside>
      ) : null}
      {localEvidenceErrors.length > 0 ? (
        <aside className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950" aria-live="polite">
          <p className="font-bold">Browser rehearsal evidence was not updated</p>
          <ul className="mt-2 grid gap-1">
            {localEvidenceErrors.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </aside>
      ) : null}
      <p className="sr-only">Package id: {contentPackage.meta.packageId}</p>
    </div>
  );
}
