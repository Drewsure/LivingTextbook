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
}: PlayableGameDemoFlowProps) {
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
        eyebrow: "Core spelling slice",
        title: `Spelling Practice: ${unit.unitMeta.theme}`,
        summary:
          "Listen to reviewed target-language vocabulary and build the spelling from letter tiles. This extends the text-spelling parent engine without adding a one-off game or random reward path.",
        statusLabel: "Text-spelling",
      }}
      progressTitle="Spelling Practice Progress"
    >
      {({ progression: currentProgression, onEvent, onComplete }) => (
        <SpellingPracticeGame
          unit={unit}
          launchSession={launchSession}
          progression={currentProgression}
          audioCues={audioCues}
          onEvent={onEvent}
          onComplete={onComplete}
        />
      )}
    </PlayableGameRouteShell>
  );
}
