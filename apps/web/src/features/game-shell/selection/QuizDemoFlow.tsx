"use client";

import { useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
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
import { QuizPracticeGame } from "./QuizPracticeGame";

interface QuizDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assignmentPlan?: TeacherAssignmentPlan;
}

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
    unlockedGameModes: Array.from(new Set([...progression.unlockedGameModes, "quiz"])),
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
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Core selection slice</p>
            <h2 className="mt-1 text-2xl font-bold">Quiz: {unit.unitMeta.theme}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
              Answer reviewed vocabulary and sentence prompts with audio-supported choices. This is the plain selection parent engine before arcade skins like Balloon Pop or Whack-a-Mole.
            </p>
          </div>
          <StatusPill label="Selection" tone="success" />
        </div>
        {lastEarnedDust > 0 && (
          <p className="mt-4 text-sm font-semibold text-[var(--tenant-text)]">
            +{lastEarnedDust} {tenant.rewardName}
          </p>
        )}
      </Card>

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

      <SessionEventLog events={sessionEvents} />
    </div>
  );
}
