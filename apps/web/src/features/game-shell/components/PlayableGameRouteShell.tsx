"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type {
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
} from "@living-textbook/content-model";
import type { TeacherAssignmentPlan } from "@living-textbook/content-model/src/teacherAssignment";
import type { GameModeCompletionResult } from "@/features/progression/localProgressionAdapter";
import { UnitSessionProgressSummary } from "@/features/progression/UnitSessionProgressSummary";
import { SessionEventLog } from "@/features/student/components/SessionEventLog";
import { TeacherAssignmentSettingsCard } from "@/features/student/components/TeacherAssignmentSettingsCard";
import type { TenantConfig } from "@/features/tenant/types";
import { GameCompletionNextCard } from "./GameCompletionNextCard";
import { GameRouteHeaderCard } from "./GameRouteHeaderCard";

interface PlayableGameRouteShellProps {
  tenant: TenantConfig;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
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
  launchSession,
  progression,
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
      />

      <SessionEventLog events={sessionEvents} />
    </div>
  );
}
