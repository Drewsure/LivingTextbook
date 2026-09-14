"use client";

import { PlayableGameRouteShell, type PlayableGameDemoFlowProps } from "../components/PlayableGameRouteShell";
import { SpellingPracticeGame } from "./SpellingPracticeGame";

const gameMode = "spelling-practice" as const;

export function SpellingPracticeDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assignmentPlan,
  offerMap,
}: PlayableGameDemoFlowProps) {
  return (
    <PlayableGameRouteShell
      tenant={tenant}
      unit={unit}
      launchSession={launchSession}
      progression={progression}
      audioCues={audioCues}
      assignmentPlan={assignmentPlan}
      offerMap={offerMap}
      gameMode={gameMode}
      header={{
        eyebrow: "Core spelling slice",
        title: `Spelling Practice: ${unit.unitMeta.theme}`,
        summary:
          "Listen to reviewed target-language vocabulary and build the spelling from letter tiles. This extends the text-spelling parent engine without adding a one-off game or random reward path.",
        statusLabel: "Text-spelling",
      }}
      progressTitle="Spelling Practice Progress"
    >
      {({ progression: currentProgression, replaySeed, audioCues: targetLanguageAudioCues, targetLanguage, onEvent, onComplete }) => (
        <SpellingPracticeGame
          unit={unit}
          launchSession={launchSession}
          progression={currentProgression}
          replaySeed={replaySeed}
          audioCues={targetLanguageAudioCues}
          targetLanguage={targetLanguage}
          onEvent={onEvent}
          onComplete={onComplete}
        />
      )}
    </PlayableGameRouteShell>
  );
}
