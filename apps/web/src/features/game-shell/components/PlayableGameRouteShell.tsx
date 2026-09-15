"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type {
  AudioCue,
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
  UnitAudioSupportPlan,
} from "@living-textbook/content-model";
import { getGameAudioCoverage, getGameAudioCues, isGameModeSupportedAtLevel, resolveCanonicalGameReplaySeed, resolveTargetLanguage } from "@living-textbook/content-model";
import type { TeacherAssignmentPlan } from "@living-textbook/content-model";
import type { UnitGameOffer, UnitGameOfferMap } from "@living-textbook/content-model";
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
import { readProgressionHandoffRecord } from "@/features/persistence/progressionHandoffStore";

export interface PlayableGameDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  packageId?: string;
  audioCues?: AudioCue[];
  audioSupportPlan?: UnitAudioSupportPlan;
  assignmentPlan?: TeacherAssignmentPlan;
  offerMap?: UnitGameOfferMap;
}

interface PlayableGameRouteShellProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  packageId?: string;
  audioCues?: AudioCue[];
  audioSupportPlan?: UnitAudioSupportPlan;
  assignmentPlan?: TeacherAssignmentPlan;
  offerMap?: UnitGameOfferMap;
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
  packageId,
  audioCues = [],
  audioSupportPlan,
  assignmentPlan,
  offerMap,
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
  const [handoffStatus, setHandoffStatus] = useState<"checking" | "accepted" | "not-found" | "rejected">("checking");
  const [handoffMessage, setHandoffMessage] = useState("Checking for a validated route handoff.");
  const targetLanguage = resolveTargetLanguage({
    tenantTargetLanguage: tenant.languageSettings?.targetLanguage,
    unitLanguage: unit.unitMeta.textbookReference?.language,
  });
  const targetLanguageAudioCues = getGameAudioCues({ unit, audioCues, audioSupportPlan, gameMode, targetLanguage });
  const replaySeed = resolveCanonicalGameReplaySeed({
    unitKey: launchSession.unitKey,
    gameMode,
    platformReplaySeed,
  });
  const gameSupportedAtLevel = isGameModeSupportedAtLevel(gameMode, unit.unitMeta.level);
  const currentOffer = offerMap?.offers.find((offer) => offer.gameMode === gameMode);
  const curatedOfferReady = !offerMap || isStudentOfferReady(currentOffer);
  const audioCoverage = getGameAudioCoverage({ unit, audioCues, audioSupportPlan, gameMode, targetLanguage });
  const gameAudioReady = audioCoverage.ready;
  const gameUnlocked = gameSupportedAtLevel && curatedOfferReady && currentProgression.unlockedGameModes.includes(gameMode) && gameAudioReady;

  useEffect(() => {
    if (!packageId) {
      setHandoffStatus("not-found");
      setHandoffMessage("This route was opened directly. A validated student handoff is required for progression unlock.");
      return;
    }

    const lookup = {
      tenantId: tenant.id,
      packageId,
      launchCode: launchSession.launchCode,
      studentSessionId: progression.studentSessionId,
      destinationRoute: window.location.pathname,
    };
    const result = readProgressionHandoffRecord(lookup);
    if (!result.record) {
      setHandoffStatus(result.errors.some((error) => error.startsWith("No route handoff")) ? "not-found" : "rejected");
      setHandoffMessage(result.errors[0] ?? "The route handoff could not be accepted.");
      return;
    }

    setCurrentProgression(result.record.progression);
    setHandoffStatus("accepted");
    setHandoffMessage(`Validated handoff accepted from ${result.record.continuity.sourceRoute}.`);
  }, [launchSession.launchCode, packageId, progression.studentSessionId, tenant.id]);

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

      <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-4 py-3 text-sm" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-semibold">Route handoff</span>
          <span className={`font-bold ${handoffStatus === "accepted" ? "text-emerald-700" : "text-[var(--tenant-muted)]"}`}>
            {handoffStatus === "checking" ? "Checking" : handoffStatus === "accepted" ? "Accepted" : "Direct route"}
          </span>
        </div>
        <p className="mt-1 text-[var(--tenant-muted)]">{handoffMessage}</p>
      </div>

      <UnitSessionProgressSummary
        title={progressTitle}
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
        gameMode={gameMode}
        audioCues={audioCues}
        audioSupportPlan={audioSupportPlan}
        replaySeed={replaySeed}
        onAudioRequested={handleEvent}
        coverage={audioCoverage}
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
          reason={
            !gameSupportedAtLevel
              ? "unsupported-level"
              : !curatedOfferReady
                ? "curated-offer"
                : !gameAudioReady
                  ? "audio-required"
                  : "entry-practice"
          }
          targetLanguage={targetLanguage}
        />
      )}

      <GameCompletionNextCard
        launchSession={launchSession}
        progression={currentProgression}
        currentGameMode={gameMode}
        unit={unit}
        audioCues={audioCues}
        audioSupportPlan={audioSupportPlan}
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

function isStudentOfferReady(offer: UnitGameOffer | undefined): boolean {
  return Boolean(offer && offer.readiness === "ready" && (offer.availability === "required" || offer.availability === "optional"));
}
