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
import { GameCompletionNextCard } from "../components/GameCompletionNextCard";
import { GameRouteHeaderCard } from "../components/GameRouteHeaderCard";
import { QuizPracticeGame } from "./QuizPracticeGame";

interface QuizDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assignmentPlan?: TeacherAssignmentPlan;
}

const gameMode = "quiz" as const;

export function QuizDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assignmentPlan,
}: QuizDemoFlowProps) {
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
        eyebrow="Core selection slice"
        title={`Quiz: ${unit.unitMeta.theme}`}
        summary="Answer reviewed vocabulary and sentence prompts with audio-supported choices. This is the plain selection parent engine before arcade skins like Balloon Pop or Whack-a-Mole."
        statusLabel="Selection"
        earnedStarDust={lastEarnedDust}
        rewardName={tenant.rewardName}
      />

      <TeacherAssignmentSettingsCard assignmentPlan={assignmentPlan} />

      <UnitSessionProgressSummary
        title="Quiz Progress"
        launchSession={launchSession}
        progression={currentProgression}
        events={sessionEvents}
        rewardName={tenant.rewardName}
      />

      <QuizPracticeGame
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
