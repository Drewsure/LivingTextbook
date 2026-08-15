"use client";

import { useState } from "react";
import type {
  AudioCue,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import type { TeacherAssignmentPlan } from "@living-textbook/content-model/src/teacherAssignment";
import type { GameModeCompletionResult } from "@/features/progression/localProgressionAdapter";
import { UnitSessionProgressSummary } from "@/features/progression/UnitSessionProgressSummary";
import { SessionEventLog } from "@/features/student/components/SessionEventLog";
import { TeacherAssignmentSettingsCard } from "@/features/student/components/TeacherAssignmentSettingsCard";
import type { TenantConfig } from "@/features/tenant/types";
import { GameRouteHeaderCard } from "../components/GameRouteHeaderCard";
import { TrueFalsePracticeGame } from "./TrueFalsePracticeGame";

interface TrueFalseDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assignmentPlan?: TeacherAssignmentPlan;
}

const gameMode = "true-false" as const;

export function TrueFalseDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assignmentPlan,
}: TrueFalseDemoFlowProps) {
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
        eyebrow="Core true/false selection slice"
        title={`True or False: ${unit.unitMeta.theme}`}
        summary="Decide whether the listened target-language word matches the visible card. This is a simple selection-engine review mode, not a broad template switch."
        statusLabel="Selection"
        earnedStarDust={lastEarnedDust}
        rewardName={tenant.rewardName}
      />

      <TeacherAssignmentSettingsCard assignmentPlan={assignmentPlan} />

      <UnitSessionProgressSummary
        title="True or False Progress"
        launchSession={launchSession}
        progression={currentProgression}
        events={sessionEvents}
        rewardName={tenant.rewardName}
      />

      <TrueFalsePracticeGame
        unit={unit}
        launchSession={launchSession}
        progression={currentProgression}
        audioCues={audioCues}
        onEvent={handleEvent}
        onComplete={handleComplete}
      />

      <SessionEventLog events={sessionEvents} />
    </div>
  );
}
