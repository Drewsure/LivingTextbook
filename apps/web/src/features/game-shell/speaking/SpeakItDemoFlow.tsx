"use client";

import { useEffect, useState } from "react";
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
import {
  getMicrophonePracticeSettings,
  getTeacherMicrophoneApprovalStorageKey,
  parseStoredTeacherMicrophoneApproval,
} from "@/features/tenant/microphonePracticeSettings";
import type { TenantConfig } from "@/features/tenant/types";
import { GameCompletionNextCard } from "../components/GameCompletionNextCard";
import { GameRouteHeaderCard } from "../components/GameRouteHeaderCard";
import { SpeakItPracticeGame } from "./SpeakItPracticeGame";
import type { GameModeCompletionResult } from "@/features/progression/localProgressionAdapter";

interface SpeakItDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assignmentPlan?: TeacherAssignmentPlan;
}

const gameMode = "speak-it" as const;

export function SpeakItDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assignmentPlan,
}: SpeakItDemoFlowProps) {
  const microphonePracticeSettings = getMicrophonePracticeSettings(tenant);
  const microphoneApprovalStorageKey = getTeacherMicrophoneApprovalStorageKey(tenant.id);
  const [teacherMicApproved, setTeacherMicApproved] = useState(microphonePracticeSettings.localRecordReplayEnabled);
  const [currentProgression, setCurrentProgression] = useState<StudentProgressionState>({
    ...progression,
    currentStep: "recommended-game",
    unlockedGameModes: Array.from(new Set([...progression.unlockedGameModes, gameMode])),
  });
  const [sessionEvents, setSessionEvents] = useState<GameProgressEvent[]>([]);
  const [lastEarnedDust, setLastEarnedDust] = useState(0);

  useEffect(() => {
    function syncTeacherMicrophoneApproval() {
      const storedApproval = parseStoredTeacherMicrophoneApproval(window.localStorage.getItem(microphoneApprovalStorageKey));
      setTeacherMicApproved(storedApproval ?? microphonePracticeSettings.localRecordReplayEnabled);
    }

    syncTeacherMicrophoneApproval();
    window.addEventListener("storage", syncTeacherMicrophoneApproval);

    return () => window.removeEventListener("storage", syncTeacherMicrophoneApproval);
  }, [microphoneApprovalStorageKey, microphonePracticeSettings.localRecordReplayEnabled]);

  const launchMicrophonePracticeSettings = {
    ...microphonePracticeSettings,
    localRecordReplayEnabled: microphonePracticeSettings.localRecordReplayEnabled && teacherMicApproved,
  };

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
        eyebrow="Core speaking slice"
        title={`Speak It: ${unit.unitMeta.theme}`}
        summary="Audio-led speaking practice for classroom and local/offline use. Local record/replay follows the teacher microphone approval setting; AI speech scoring remains premium and off."
        statusLabel={launchMicrophonePracticeSettings.localRecordReplayEnabled ? "Mic approved" : "Mic off"}
        statusTone={launchMicrophonePracticeSettings.localRecordReplayEnabled ? "success" : "warning"}
        earnedStarDust={lastEarnedDust}
        rewardName={tenant.rewardName}
      />

      <TeacherAssignmentSettingsCard assignmentPlan={assignmentPlan} />

      <UnitSessionProgressSummary
        title="Speaking Progress"
        launchSession={launchSession}
        progression={currentProgression}
        events={sessionEvents}
        rewardName={tenant.rewardName}
      />

      <SpeakItPracticeGame
        unit={unit}
        gameMode={gameMode}
        launchSession={launchSession}
        progression={currentProgression}
        audioCues={audioCues}
        microphonePractice={launchMicrophonePracticeSettings}
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
