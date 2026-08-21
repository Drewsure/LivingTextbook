"use client";

import { useEffect, useState } from "react";
import {
  getMicrophonePracticeSettings,
  getTeacherMicrophoneApprovalStorageKey,
  parseStoredTeacherMicrophoneApproval,
} from "@/features/tenant/microphonePracticeSettings";
import { PlayableGameRouteShell, type PlayableGameDemoFlowProps } from "../components/PlayableGameRouteShell";
import { SpeakItPracticeGame } from "./SpeakItPracticeGame";

const gameMode = "speak-it" as const;

export function SpeakItDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assignmentPlan,
}: PlayableGameDemoFlowProps) {
  const microphonePracticeSettings = getMicrophonePracticeSettings(tenant);
  const microphoneApprovalStorageKey = getTeacherMicrophoneApprovalStorageKey(tenant.id);
  const [teacherMicApproved, setTeacherMicApproved] = useState(microphonePracticeSettings.localRecordReplayEnabled);

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

  return (
    <PlayableGameRouteShell
      tenant={tenant}
      launchSession={launchSession}
      progression={progression}
      assignmentPlan={assignmentPlan}
      gameMode={gameMode}
      header={{
        eyebrow: "Core speaking slice",
        title: `Speak It: ${unit.unitMeta.theme}`,
        summary:
          "Audio-led speaking practice for classroom and local/offline use. Local record/replay follows the teacher microphone approval setting; AI speech scoring remains premium and off.",
        statusLabel: launchMicrophonePracticeSettings.localRecordReplayEnabled ? "Mic approved" : "Mic off",
        statusTone: launchMicrophonePracticeSettings.localRecordReplayEnabled ? "success" : "warning",
      }}
      progressTitle="Speaking Progress"
    >
      {({ progression: currentProgression, onEvent, onComplete }) => (
        <SpeakItPracticeGame
          unit={unit}
          gameMode={gameMode}
          launchSession={launchSession}
          progression={currentProgression}
          audioCues={audioCues}
          microphonePractice={launchMicrophonePracticeSettings}
          onEvent={onEvent}
          onComplete={onComplete}
        />
      )}
    </PlayableGameRouteShell>
  );
}
