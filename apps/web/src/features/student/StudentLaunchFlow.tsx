"use client";

import { useEffect, useRef, useState } from "react";
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
import {
  createCanonicalGameReplaySeed,
  createProgressionContinuityEnvelope,
  languageMatches,
  resolveTargetLanguage,
  validateProgressionContinuityRuntimeRequest,
} from "@living-textbook/content-model";
import type { TeacherAssignmentPlan } from "@living-textbook/content-model";
import { PairingMemoryMatchGame } from "@/features/game-shell/pairing/PairingMemoryMatchGame";
import { PairingMatchUpGame } from "@/features/game-shell/pairing/PairingMatchUpGame";
import { LabelItPracticeGame } from "@/features/game-shell/pairing/LabelItPracticeGame";
import { BalloonPopPracticeGame } from "@/features/game-shell/selection/BalloonPopPracticeGame";
import { QuizPracticeGame } from "@/features/game-shell/selection/QuizPracticeGame";
import { TrueFalsePracticeGame } from "@/features/game-shell/selection/TrueFalsePracticeGame";
import { TypeAnswerPracticeGame } from "@/features/game-shell/text-spelling/TypeAnswerPracticeGame";
import { SpellingPracticeGame } from "@/features/game-shell/text-spelling/SpellingPracticeGame";
import { FillInBlankPracticeGame } from "@/features/game-shell/text-spelling/FillInBlankPracticeGame";
import { SentenceBuilderPracticeGame } from "@/features/game-shell/text-spelling/SentenceBuilderPracticeGame";
import { PairingEnginePreview } from "@/features/game-shell/pairing/PairingEnginePreview";
import { validateCanonicalGameCompletion } from "@/features/game-shell/canonicalGameCompletionGate";
import {
  completeFlashcardEntryPractice,
  createMediaPlaylistOpenedEvent,
  createRouteGuidanceListenedEvent,
  type GameModeCompletionResult,
} from "@/features/progression/localProgressionAdapter";
import { UnitSessionProgressSummary } from "@/features/progression/UnitSessionProgressSummary";
import { getNextUncompletedRecommendedMode } from "@/features/progression/nextRecommendedGameMode";
import { starterRewardCatalog } from "@/features/rewards/rewardCatalog";
import type { TenantConfig } from "@/features/tenant/types";
import { TrainingRecoveryRecommendationCard } from "@/features/training/TrainingRecoveryRecommendationCard";
import {
  getDefaultAssistLanguageEnabled,
  getTeacherAssistLanguageApprovalStorageKey,
  parseStoredTeacherAssistLanguageApproval,
} from "@/features/tenant/assistLanguageSettings";
import {
  createTrainingRecoveryRecommendationEvent,
  evaluateTrainingRecoveryTrigger,
  hasRecordedTrainingRecoveryRecommendation,
} from "@/features/training/trainingRecoveryTrigger";
import { FlashcardPracticeCard } from "./components/FlashcardPracticeCard";
import { SpeakItPracticeGame } from "@/features/game-shell/speaking/SpeakItPracticeGame";
import { useTeacherMicrophonePracticeSettings } from "@/features/audio/useTeacherMicrophonePracticeSettings";
import { LaunchContextSafetyCard } from "./components/LaunchContextSafetyCard";
import { NextGameUnlockCard } from "./components/NextGameUnlockCard";
import { RecommendedGameRoutesCard } from "./components/RecommendedGameRoutesCard";
import { RewardPreviewCard } from "./components/RewardPreviewCard";
import { SessionEventLog } from "./components/SessionEventLog";
import { StudentProgressHeader } from "./components/StudentProgressHeader";
import { TeacherAssignmentSettingsCard } from "./components/TeacherAssignmentSettingsCard";
import { UnitMediaShortcutCard } from "./components/UnitMediaShortcutCard";
import { getCollectionPath } from "@/features/routes/routeContracts";
import { getGameModeRoutePath } from "@/features/routes/gameModeRoutePaths";
import type { UnitGameOfferMap } from "@living-textbook/content-model";

interface StudentLaunchFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  sessionSettings?: TeacherSessionSettings;
  contentPackage: ContentPackage;
  audioCues?: AudioCue[];
  assistLanguagePlan?: UnitAssistLanguagePlan;
  assignmentPlan?: TeacherAssignmentPlan;
  offerMap?: UnitGameOfferMap;
}

export function StudentLaunchFlow({
  tenant,
  unit,
  launchSession,
  progression,
  sessionSettings,
  contentPackage,
  audioCues = [],
  assistLanguagePlan,
  assignmentPlan,
  offerMap,
}: StudentLaunchFlowProps) {
  const [currentProgression, setCurrentProgression] = useState(progression);
  const [sessionEvents, setSessionEvents] = useState<GameProgressEvent[]>([]);
  const [lastEarnedDust, setLastEarnedDust] = useState(0);
  const [activeGameMode, setActiveGameMode] = useState<GameModeId | undefined>();
  const replaySeed = createCanonicalGameReplaySeed({
    unitKey: launchSession.unitKey,
    gameMode: activeGameMode ?? launchSession.entryMode,
  });
  const [eventContractErrors, setEventContractErrors] = useState<string[]>([]);
  const [continuityEnvelope, setContinuityEnvelope] = useState<ReturnType<typeof createProgressionContinuityEnvelope>>();
  const [targetPracticeEngagedItemIds, setTargetPracticeEngagedItemIds] = useState<string[]>([]);
  const sessionEventsRef = useRef<GameProgressEvent[]>([]);
  const completionAcceptedModesRef = useRef<Set<GameModeId>>(new Set());
  const [assistLanguageEnabled, setAssistLanguageEnabled] = useState(
    sessionSettings?.assistLanguage.enabled ?? getDefaultAssistLanguageEnabled(tenant),
  );
  const microphonePracticeSettings = useTeacherMicrophonePracticeSettings(tenant);
  const targetLanguage = resolveTargetLanguage({
    tenantTargetLanguage: tenant.languageSettings?.targetLanguage,
    unitLanguage: unit.unitMeta.textbookReference?.language,
  });
  const targetLanguageAudioCues = audioCues.filter((cue) => languageMatches(cue.language, targetLanguage));

  const entryComplete = currentProgression.completedGameModes.includes(launchSession.entryMode);
  const nextMode = getNextUncompletedRecommendedMode(launchSession, currentProgression);
  const nextModeUnlocked = Boolean(nextMode && currentProgression.unlockedGameModes.includes(nextMode));
  const nextModeStarted = Boolean(nextMode && activeGameMode === nextMode);
  const targetPracticeRequiredCount = unit.pedagogicalPayload.vocabularyTerms.length + unit.pedagogicalPayload.targetSentences.length;
  const targetPracticeEngagedCount = targetPracticeEngagedItemIds.length;
  const targetPracticeReady = entryComplete || targetPracticeEngagedCount >= targetPracticeRequiredCount;
  const recoveryRecommendation = evaluateTrainingRecoveryTrigger({
    events: sessionEvents,
    launchSession,
  });
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

      const nextSessionEvents =
        !recommendation || hasRecordedTrainingRecoveryRecommendation(updatedEvents, recommendation)
          ? updatedEvents
          : [
              ...updatedEvents,
              createTrainingRecoveryRecommendationEvent({
                recommendation,
                launchSession,
                progression: progressionForRecommendation,
                occurredAt: new Date().toISOString(),
              }),
            ];
      sessionEventsRef.current = nextSessionEvents;
      return nextSessionEvents;
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

    if (!nextModeUnlocked) {
      return;
    }

    const issuedAt = new Date().toISOString();
    const envelope = createProgressionContinuityEnvelope({
      continuityId: `continuity-${launchSession.launchCode}-${nextMode}-${sessionEventsRef.current.length}`,
      packageId: contentPackage.meta.packageId,
      launchSession,
      progression: {
        ...currentProgression,
        currentStep: "recommended-game",
      },
      sourceRoute: `/launch/${launchSession.launchCode}`,
      destinationRoute: getGameModeRoutePath(nextMode, launchSession.launchCode),
      issuedAt,
      eventCursor: sessionEventsRef.current.length,
    });
    const continuityErrors = validateProgressionContinuityRuntimeRequest({
      expectedTenantId: launchSession.tenantId,
      expectedPackageId: contentPackage.meta.packageId,
      expectedLaunchCode: launchSession.launchCode,
      expectedStudentSessionId: currentProgression.studentSessionId,
      envelope,
    });

    if (continuityErrors.length > 0) {
      setEventContractErrors(continuityErrors.map((error) => `Progression handoff: ${error}`));
      return;
    }

    setContinuityEnvelope(envelope);
    setActiveGameMode(nextMode);
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

  function handleMediaPlaylistOpened(playlistId: string, routeHref: string) {
    appendSessionEvents([
      createMediaPlaylistOpenedEvent({
        progression: currentProgression,
        launchSession,
        playlistId,
        routeHref,
        occurredAt: new Date().toISOString(),
      }),
    ]);
  }

  function handleGameComplete(result: GameModeCompletionResult) {
    const completedMode = activeGameMode;
    if (!completedMode || !result.event) {
      if (completedMode && currentProgression.completedGameModes.includes(completedMode)) {
        completionAcceptedModesRef.current.add(completedMode);
        setEventContractErrors([]);
        return;
      }

      setEventContractErrors(["Canonical game completion did not include a playable mode and completion event."]);
      return;
    }

    if (completionAcceptedModesRef.current.has(completedMode)) {
      return;
    }

    const continuityErrors = continuityEnvelope
      ? validateProgressionContinuityRuntimeRequest({
          expectedTenantId: launchSession.tenantId,
          expectedPackageId: contentPackage.meta.packageId,
          expectedLaunchCode: launchSession.launchCode,
          expectedStudentSessionId: currentProgression.studentSessionId,
          envelope: continuityEnvelope,
        })
      : ["Progression handoff envelope is missing."];
    if (continuityErrors.length > 0) {
      setEventContractErrors(continuityErrors.map((error) => `Progression handoff: ${error}`));
      return;
    }

    const replay = validateCanonicalGameCompletion({
      events: sessionEventsRef.current,
      result,
      gameMode: completedMode,
      tenantId: tenant.id,
      identity: {
        unitKey: launchSession.unitKey,
        launchCode: launchSession.launchCode,
        studentSessionId: currentProgression.studentSessionId,
      },
      targetLanguage,
    });
    setEventContractErrors(replay.errors);

    if (!replay.valid) {
      return;
    }

    completionAcceptedModesRef.current.add(completedMode);
    setCurrentProgression(result.progression);
    setLastEarnedDust(result.earnedStarDust);
    appendSessionEvents([result.event], result.progression);
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
      <LaunchContextSafetyCard
        title="Controlled student practice"
        accessLabel={assignmentPlan ? "Private assignment preview" : "Direct demo route"}
        reportLabel={sessionSettings?.reporting.reportProgressToTeacher ? "Teacher report preview" : "Reports off"}
      />
      <TeacherAssignmentSettingsCard assignmentPlan={assignmentPlan} />
      <UnitMediaShortcutCard
        contentPackage={contentPackage}
        unit={unit}
        onMediaPlaylistOpened={handleMediaPlaylistOpened}
      />
      <UnitSessionProgressSummary
        title="Student Progress"
        launchSession={launchSession}
        progression={currentProgression}
        events={sessionEvents}
        rewardName={tenant.rewardName}
        targetLanguage={targetLanguage}
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
      <NextGameUnlockCard
        nextMode={nextMode}
        unlocked={nextModeUnlocked}
        started={nextModeStarted}
        targetLanguage={targetLanguage}
        onStart={handleStartNextMode}
      />
      <RecommendedGameRoutesCard
        launchSession={launchSession}
        progression={currentProgression}
        targetLanguage={targetLanguage}
        offerMap={offerMap}
        onRouteGuidanceListened={handleRouteGuidanceListened}
      />
      {activeGameMode === "memory-match" && (
        <PairingMemoryMatchGame
          unit={unit}
          gameMode={activeGameMode}
          launchSession={launchSession}
          progression={currentProgression}
          replaySeed={replaySeed}
          audioCues={targetLanguageAudioCues}
          targetLanguage={targetLanguage}
          onEvent={handleGameEvent}
          onComplete={handleGameComplete}
        />
      )}
      {activeGameMode === "match-up" && (
        <PairingMatchUpGame
          unit={unit}
          launchSession={launchSession}
          progression={currentProgression}
          replaySeed={replaySeed}
          audioCues={targetLanguageAudioCues}
          targetLanguage={targetLanguage}
          onEvent={handleGameEvent}
          onComplete={handleGameComplete}
        />
      )}
      {activeGameMode === "label-it" && (
        <LabelItPracticeGame
          unit={unit}
          launchSession={launchSession}
          progression={currentProgression}
          replaySeed={replaySeed}
          audioCues={targetLanguageAudioCues}
          targetLanguage={targetLanguage}
          onEvent={handleGameEvent}
          onComplete={handleGameComplete}
        />
      )}
      {activeGameMode === "balloon-pop" && (
        <BalloonPopPracticeGame
          unit={unit}
          launchSession={launchSession}
          progression={currentProgression}
          replaySeed={replaySeed}
          audioCues={targetLanguageAudioCues}
          targetLanguage={targetLanguage}
          onEvent={handleGameEvent}
          onComplete={handleGameComplete}
        />
      )}
      {activeGameMode === "quiz" && (
        <QuizPracticeGame
          unit={unit}
          launchSession={launchSession}
          progression={currentProgression}
          replaySeed={replaySeed}
          audioCues={targetLanguageAudioCues}
          targetLanguage={targetLanguage}
          onEvent={handleGameEvent}
          onComplete={handleGameComplete}
        />
      )}
      {activeGameMode === "true-false" && (
        <TrueFalsePracticeGame
          unit={unit}
          launchSession={launchSession}
          progression={currentProgression}
          replaySeed={replaySeed}
          audioCues={targetLanguageAudioCues}
          targetLanguage={targetLanguage}
          onEvent={handleGameEvent}
          onComplete={handleGameComplete}
        />
      )}
      {activeGameMode === "type-answer" && (
        <TypeAnswerPracticeGame
          unit={unit}
          launchSession={launchSession}
          progression={currentProgression}
          replaySeed={replaySeed}
          audioCues={targetLanguageAudioCues}
          targetLanguage={targetLanguage}
          onEvent={handleGameEvent}
          onComplete={handleGameComplete}
        />
      )}
      {activeGameMode === "spelling-practice" && (
        <SpellingPracticeGame
          unit={unit}
          launchSession={launchSession}
          progression={currentProgression}
          replaySeed={replaySeed}
          audioCues={targetLanguageAudioCues}
          targetLanguage={targetLanguage}
          onEvent={handleGameEvent}
          onComplete={handleGameComplete}
        />
      )}
      {activeGameMode === "fill-in-the-blank" && (
        <FillInBlankPracticeGame
          unit={unit}
          launchSession={launchSession}
          progression={currentProgression}
          replaySeed={replaySeed}
          audioCues={targetLanguageAudioCues}
          targetLanguage={targetLanguage}
          onEvent={handleGameEvent}
          onComplete={handleGameComplete}
        />
      )}
      {activeGameMode === "sentence-builder" && (
        <SentenceBuilderPracticeGame
          unit={unit}
          launchSession={launchSession}
          progression={currentProgression}
          replaySeed={replaySeed}
          audioCues={targetLanguageAudioCues}
          targetLanguage={targetLanguage}
          onEvent={handleGameEvent}
          onComplete={handleGameComplete}
        />
      )}
      {activeGameMode === "speak-it" && (
        <SpeakItPracticeGame
          unit={unit}
          gameMode={activeGameMode}
          launchSession={launchSession}
          progression={currentProgression}
          replaySeed={replaySeed}
          audioCues={targetLanguageAudioCues}
          targetLanguage={targetLanguage}
          microphonePractice={microphonePracticeSettings}
          onEvent={handleGameEvent}
          onComplete={handleGameComplete}
        />
      )}
      {activeGameMode && activeGameMode !== "memory-match" && activeGameMode !== "match-up" && activeGameMode !== "label-it" && activeGameMode !== "balloon-pop" && activeGameMode !== "quiz" && activeGameMode !== "true-false" && activeGameMode !== "type-answer" && activeGameMode !== "spelling-practice" && activeGameMode !== "fill-in-the-blank" && activeGameMode !== "sentence-builder" && activeGameMode !== "speak-it" && (
        <PairingEnginePreview unit={unit} gameMode={activeGameMode} />
      )}
      {recoveryRecommendation && (
        <TrainingRecoveryRecommendationCard recommendation={recoveryRecommendation} rewardName={tenant.rewardName} targetLanguage={targetLanguage} />
      )}
      <SessionEventLog events={sessionEvents} />
      {eventContractErrors.length > 0 ? (
        <aside className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-950" aria-live="polite">
          <p className="font-bold">Canonical game contract needs review</p>
          <p className="mt-1">Completion is paused until the event evidence is valid.</p>
          <ul className="mt-2 grid gap-1">
            {eventContractErrors.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </aside>
      ) : null}
    </div>
  );
}
