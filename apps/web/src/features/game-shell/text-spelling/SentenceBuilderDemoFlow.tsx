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
import { UnitSessionProgressSummary } from "@/features/progression/UnitSessionProgressSummary";
import { SessionEventLog } from "@/features/student/components/SessionEventLog";
import { TeacherAssignmentSettingsCard } from "@/features/student/components/TeacherAssignmentSettingsCard";
import type { TenantConfig } from "@/features/tenant/types";
import type { GameModeCompletionResult } from "@/features/progression/localProgressionAdapter";
import { SentenceBuilderPracticeGame } from "./SentenceBuilderPracticeGame";

interface SentenceBuilderDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assignmentPlan?: TeacherAssignmentPlan;
}

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
    unlockedGameModes: Array.from(new Set([...progression.unlockedGameModes, "sentence-builder"])),
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
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Core syntax slice</p>
            <h2 className="mt-1 text-2xl font-bold">Sentence Builder: {unit.unitMeta.theme}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
              Build the two reviewed target sentence structures from ordered word tiles. This is the first playable text-spelling engine slice: no AI generation, no random rewards, and no premium skin yet.
            </p>
          </div>
          <StatusPill label="Text-spelling" tone="success" />
        </div>
        {lastEarnedDust > 0 && (
          <p className="mt-4 text-sm font-semibold text-[var(--tenant-text)]">
            +{lastEarnedDust} {tenant.rewardName}
          </p>
        )}
      </Card>

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

      <SessionEventLog events={sessionEvents} />
    </div>
  );
}
