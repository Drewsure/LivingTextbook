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
import { UnitSessionProgressSummary } from "@/features/progression/UnitSessionProgressSummary";
import { SessionEventLog } from "@/features/student/components/SessionEventLog";
import type { TenantConfig } from "@/features/tenant/types";
import { SpeakItPracticeGame } from "./SpeakItPracticeGame";
import type { GameModeCompletionResult } from "@/features/progression/localProgressionAdapter";

interface SpeakItDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
}

export function SpeakItDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
}: SpeakItDemoFlowProps) {
  const [currentProgression, setCurrentProgression] = useState<StudentProgressionState>({
    ...progression,
    currentStep: "recommended-game",
    unlockedGameModes: Array.from(new Set([...progression.unlockedGameModes, "speak-it"])),
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
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Core speaking slice</p>
            <h2 className="mt-1 text-2xl font-bold">Speak It: {unit.unitMeta.theme}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
              Audio-led speaking practice for classroom and local/offline use. This version is teacher-safe and self-confirmed; it does not request microphone access or require AI Tutor.
            </p>
          </div>
          <StatusPill label="Core mode" tone="success" />
        </div>
        {lastEarnedDust > 0 && (
          <p className="mt-4 text-sm font-semibold text-[var(--tenant-text)]">
            +{lastEarnedDust} {tenant.rewardName}
          </p>
        )}
      </Card>

      <UnitSessionProgressSummary
        title="Speaking Progress"
        launchSession={launchSession}
        progression={currentProgression}
        events={sessionEvents}
        rewardName={tenant.rewardName}
      />

      <SpeakItPracticeGame
        unit={unit}
        gameMode="speak-it"
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
