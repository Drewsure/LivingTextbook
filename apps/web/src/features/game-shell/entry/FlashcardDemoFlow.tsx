"use client";

import { useEffect, useState } from "react";
import type {
  AudioCue,
  ContentPackage,
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  TeacherSessionSettings,
  UnitAssistLanguagePlan,
  UnitPayload,
} from "@living-textbook/content-model";
import type { TeacherAssignmentPlan } from "@living-textbook/content-model/src/teacherAssignment";
import { UnitSessionProgressSummary } from "@/features/progression/UnitSessionProgressSummary";
import {
  completeFlashcardEntryPractice,
  createRouteGuidanceListenedEvent,
} from "@/features/progression/localProgressionAdapter";
import { starterRewardCatalog } from "@/features/rewards/rewardCatalog";
import { getCollectionPath } from "@/features/routes/routeContracts";
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
  assistLanguagePlan?: UnitAssistLanguagePlan;
  assignmentPlan?: TeacherAssignmentPlan;
}

export function FlashcardDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  sessionSettings,
  contentPackage,
  audioCues = [],
  assistLanguagePlan,
  assignmentPlan,
}: FlashcardDemoFlowProps) {
  const [currentProgression, setCurrentProgression] = useState<StudentProgressionState>(progression);
  const [sessionEvents, setSessionEvents] = useState<GameProgressEvent[]>([]);
  const [lastEarnedDust, setLastEarnedDust] = useState(0);
  const [targetPracticeEngagedItemIds, setTargetPracticeEngagedItemIds] = useState<string[]>([]);
  const [assistLanguageEnabled, setAssistLanguageEnabled] = useState(
    sessionSettings?.assistLanguage.enabled ?? getDefaultAssistLanguageEnabled(tenant),
  );

  const entryComplete = currentProgression.completedGameModes.includes(launchSession.entryMode);
  const nextMode = launchSession.recommendedNextModes[0];
  const targetPracticeRequiredCount = unit.pedagogicalPayload.vocabularyTerms.length + unit.pedagogicalPayload.targetSentences.length;
  const targetPracticeEngagedCount = targetPracticeEngagedItemIds.length;
  const targetPracticeReady = entryComplete || targetPracticeEngagedCount >= targetPracticeRequiredCount;
  const activeAssistLanguagePlan = assistLanguageEnabled ? assistLanguagePlan : undefined;

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
      />
      <GameLearningAudioContractCard
        tenant={tenant}
        unit={unit}
        launchSession={launchSession}
        progression={currentProgression}
        gameMode={launchSession.entryMode}
        audioCues={audioCues}
        onAudioRequested={(event) => appendSessionEvents([event])}
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
        onRouteGuidanceListened={handleRouteGuidanceListened}
      />
      <SessionEventLog events={sessionEvents} />
      <p className="sr-only">Package id: {contentPackage.meta.packageId}</p>
    </div>
  );
}
