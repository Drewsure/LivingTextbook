"use client";

import { useTeacherMicrophonePracticeSettings } from "@/features/audio/useTeacherMicrophonePracticeSettings";
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
  const launchMicrophonePracticeSettings = useTeacherMicrophonePracticeSettings(tenant);

  return (
    <PlayableGameRouteShell
      tenant={tenant}
      unit={unit}
      launchSession={launchSession}
      progression={progression}
      audioCues={audioCues}
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
      {({ progression: currentProgression, replaySeed, audioCues: targetLanguageAudioCues, targetLanguage, onEvent, onComplete }) => (
        <SpeakItPracticeGame
          unit={unit}
          gameMode={gameMode}
          launchSession={launchSession}
          progression={currentProgression}
          replaySeed={replaySeed}
          audioCues={targetLanguageAudioCues}
          targetLanguage={targetLanguage}
          microphonePractice={launchMicrophonePracticeSettings}
          onEvent={onEvent}
          onComplete={onComplete}
        />
      )}
    </PlayableGameRouteShell>
  );
}
