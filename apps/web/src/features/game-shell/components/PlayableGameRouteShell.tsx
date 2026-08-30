"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type {
  AudioCue,
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import type { TeacherAssignmentPlan } from "@living-textbook/content-model/src/teacherAssignment";
import { findSampleUnitGameOfferMap } from "@/data/sampleUnitGameOfferMap";
import type { GameModeCompletionResult } from "@/features/progression/localProgressionAdapter";
import { UnitSessionProgressSummary } from "@/features/progression/UnitSessionProgressSummary";
import { SessionEventLog } from "@/features/student/components/SessionEventLog";
import { TeacherAssignmentSettingsCard } from "@/features/student/components/TeacherAssignmentSettingsCard";
import type { TenantConfig } from "@/features/tenant/types";
import { GameCompletionNextCard } from "./GameCompletionNextCard";
import { GameLearningAudioContractCard } from "./GameLearningAudioContractCard";
import { GameRouteHeaderCard } from "./GameRouteHeaderCard";

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
  header,
  progressTitle,
  children,
}: PlayableGameRouteShellProps) {
  const [currentProgression, setCurrentProgression] = useState<StudentProgressionState>({
    ...progression,
    currentStep: "recommended-game",
    unlockedGameModes: Array.from(new Set([...progression.unlockedGameModes, gameMode])),
  });
  const [sessionEvents, setSessionEvents] = useState<GameProgressEvent[]>([]);
  const [lastEarnedDust, setLastEarnedDust] = useState(0);
  const offerMap = unit.unitMeta.contentPackageId ? findSampleUnitGameOfferMap(unit.unitMeta.contentPackageId) : undefined;

  function handleEvent(event: GameProgressEvent) {
    setSessionEvents((events) => [...events, event]);
  }

  function handleComplete(result: GameModeCompletionResult) {
    setCurrentProgression(result.progression);
    setLastEarnedDust(result.earnedStarDust);

    if (result.event) {
      setSessionEvents((events) => [...events, result.event as GameProgressEvent]);
    }
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
        onAudioRequested={handleEvent}
      />

      {children({
        progression: currentProgression,
        onEvent: handleEvent,
        onComplete: handleComplete,
      })}

      <GameCompletionNextCard
        launchSession={launchSession}
        progression={currentProgression}
        currentGameMode={gameMode}
        earnedStarDust={lastEarnedDust}
        rewardName={tenant.rewardName}
        offerMap={offerMap}
      />

      <SessionEventLog events={sessionEvents} />
    </div>
  );
}
