"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import type {
  AudioCue,
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { isGameModeSupportedAtLevel, languageMatches, resolveCanonicalGameReplaySeed } from "@living-textbook/content-model";
import type { TeacherAssignmentPlan } from "@living-textbook/content-model/src/teacherAssignment";
import { findSampleUnitGameOfferMap } from "@/data/sampleUnitGameOfferMap";
import type { GameModeCompletionResult } from "@/features/progression/localProgressionAdapter";
import { UnitSessionProgressSummary } from "@/features/progression/UnitSessionProgressSummary";
import { SessionEventLog } from "@/features/student/components/SessionEventLog";
import { TeacherAssignmentSettingsCard } from "@/features/student/components/TeacherAssignmentSettingsCard";
import type { TenantConfig } from "@/features/tenant/types";
import { GameCompletionNextCard } from "./GameCompletionNextCard";
import { GameAccessGateCard } from "./GameAccessGateCard";
import { GameLearningAudioContractCard } from "./GameLearningAudioContractCard";
import { GameRouteHeaderCard } from "./GameRouteHeaderCard";
import { validateCanonicalGameCompletion } from "../canonicalGameCompletionGate";

export interface PlayableGameDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assignmentPlan?: TeacherAssignmentPlan;
}

interface PlayableGameRouteShellProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assignmentPlan?: TeacherAssignmentPlan;
  gameMode: GameModeId;
  platformReplaySeed?: string;
  header: {
    eyebrow: string;
    title: string;
    summary: string;
    statusLabel: string;
    statusTone?: "neutral" | "success" | "warning";
  };
  progressTitle: string;
  children: (props: {
    progression: StudentProgressionState;
    replaySeed: string;
    audioCues: AudioCue[];
    targetLanguage: string;
    onEvent: (event: GameProgressEvent) => void;
    onComplete: (result: GameModeCompletionResult) => void;
  }) => ReactNode;
}

export function PlayableGameRouteShell({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assignmentPlan,
  gameMode,
  platformReplaySeed,
  header,
  progressTitle,
  children,
}: PlayableGameRouteShellProps) {
  const [currentProgression, setCurrentProgression] = useState<StudentProgressionState>({
    ...progression,
  });
  const [sessionEvents, setSessionEvents] = useState<GameProgressEvent[]>([]);
  const sessionEventsRef = useRef<GameProgressEvent[]>([]);
  const completionAcceptedRef = useRef(false);
  const [lastEarnedDust, setLastEarnedDust] = useState(0);
  const [eventContractErrors, setEventContractErrors] = useState<string[]>([]);
  const offerMap = unit.unitMeta.contentPackageId ? findSampleUnitGameOfferMap(unit.unitMeta.contentPackageId) : undefined;
  const targetLanguage = tenant.languageSettings?.targetLanguage ?? unit.unitMeta.textbookReference?.language ?? "en";
  const targetLanguageAudioCues = audioCues.filter((cue) => languageMatches(cue.language, targetLanguage));
  const replaySeed = resolveCanonicalGameReplaySeed({
    unitKey: launchSession.unitKey,
    gameMode,
    platformReplaySeed,
  });
  const gameSupportedAtLevel = isGameModeSupportedAtLevel(gameMode, unit.unitMeta.level);
  const gameUnlocked = gameSupportedAtLevel && currentProgression.unlockedGameModes.includes(gameMode);

  function handleEvent(event: GameProgressEvent) {
    sessionEventsRef.current = [...sessionEventsRef.current, event];
    setSessionEvents((events) => [...events, event]);
  }

  function handleComplete(result: GameModeCompletionResult) {
    if (completionAcceptedRef.current) {
      return;
    }

    if (!result.event) {
      if (currentProgression.completedGameModes.includes(gameMode)) {
        completionAcceptedRef.current = true;
        setEventContractErrors([]);
        return;
      }

      setEventContractErrors(["Canonical game completion did not include a completion event."]);
      return;
    }
    const completionEvent = result.event;

    const replay = validateCanonicalGameCompletion({
      events: sessionEventsRef.current,
      result,
      gameMode,
      tenantId: tenant.id,
      identity: {
        unitKey: launchSession.unitKey,
        launchCode: launchSession.launchCode,
        studentSessionId: progression.studentSessionId,
      },
      targetLanguage,
    });
    setEventContractErrors(replay.errors);

    if (!replay.valid) {
      return;
    }

    completionAcceptedRef.current = true;
    setCurrentProgression(result.progression);
    setLastEarnedDust(result.earnedStarDust);

    sessionEventsRef.current = [...sessionEventsRef.current, completionEvent];
    setSessionEvents((events) => [...events, completionEvent]);
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <GameRouteHeaderCard
        eyebrow={header.eyebrow}
        title={header.title}
        summary={header.summary}
        statusLabel={header.statusLabel}
        statusTone={header.statusTone}
        earnedStarDust={lastEarnedDust}
        rewardName={tenant.rewardName}
      />

      <TeacherAssignmentSettingsCard assignmentPlan={assignmentPlan} />

      <UnitSessionProgressSummary
        title={progressTitle}
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
        gameMode={gameMode}
        audioCues={audioCues}
        replaySeed={replaySeed}
        onAudioRequested={handleEvent}
      />

      {gameUnlocked ? (
        children({
          progression: currentProgression,
          replaySeed,
          audioCues: targetLanguageAudioCues,
          targetLanguage,
          onEvent: handleEvent,
          onComplete: handleComplete,
        })
      ) : (
        <GameAccessGateCard
          gameMode={gameMode}
          launchSession={launchSession}
          level={unit.unitMeta.level}
          reason={gameSupportedAtLevel ? "entry-practice" : "unsupported-level"}
          targetLanguage={targetLanguage}
        />
      )}

      <GameCompletionNextCard
        launchSession={launchSession}
        progression={currentProgression}
        currentGameMode={gameMode}
        earnedStarDust={lastEarnedDust}
        rewardName={tenant.rewardName}
        targetLanguage={targetLanguage}
        offerMap={offerMap}
      />

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
