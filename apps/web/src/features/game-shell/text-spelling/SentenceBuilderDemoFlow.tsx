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
import { UnitSessionProgressSummary } from "@/features/progression/UnitSessionProgressSummary";
import { SessionEventLog } from "@/features/student/components/SessionEventLog";
import { TeacherAssignmentSettingsCard } from "@/features/student/components/TeacherAssignmentSettingsCard";
import type { TenantConfig } from "@/features/tenant/types";
import type { GameModeCompletionResult } from "@/features/progression/localProgressionAdapter";
import { GameCompletionNextCard } from "../components/GameCompletionNextCard";
import { GameRouteHeaderCard } from "../components/GameRouteHeaderCard";
import { SentenceBuilderPracticeGame } from "./SentenceBuilderPracticeGame";

interface SentenceBuilderDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assignmentPlan?: TeacherAssignmentPlan;
}

const gameMode = "sentence-builder" as const;

export function SentenceBuilderDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assignmentPlan,
}: SentenceBuilderDemoFlowProps) {
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
        eyebrow="Core syntax slice"
        title={`Sentence Builder: ${unit.unitMeta.theme}`}
        summary="Build the two reviewed target sentence structures from ordered word tiles. This is the first playable text-spelling engine slice: no AI generation, no random rewards, and no premium skin yet."
        statusLabel="Text-spelling"
        earnedStarDust={lastEarnedDust}
        rewardName={tenant.rewardName}
      />

      <TeacherAssignmentSettingsCard assignmentPlan={assignmentPlan} />

      <UnitSessionProgressSummary
        title="Sentence Builder Progress"
        launchSession={launchSession}
        progression={currentProgression}
        events={sessionEvents}
        rewardName={tenant.rewardName}
      />

      <SentenceBuilderPracticeGame
        unit={unit}
        launchSession={launchSession}
        progression={currentProgression}
        audioCues={audioCues}
        onEvent={handleEvent}
        onComplete={handleComplete}
      />

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
