"use client";

import { PlayableGameRouteShell, type PlayableGameDemoFlowProps } from "../components/PlayableGameRouteShell";
import { QuizPracticeGame } from "./QuizPracticeGame";

const gameMode = "quiz" as const;

export function QuizDemoFlow({
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
      launchSession={launchSession}
      progression={progression}
      assignmentPlan={assignmentPlan}
      gameMode={gameMode}
      header={{
        eyebrow: "Core selection slice",
        title: `Quiz: ${unit.unitMeta.theme}`,
        summary:
          "Answer reviewed vocabulary and sentence prompts with audio-supported choices. This is the plain selection parent engine before arcade skins like Balloon Pop or Whack-a-Mole.",
        statusLabel: "Selection",
      }}
      progressTitle="Quiz Progress"
    >
      {({ progression: currentProgression, onEvent, onComplete }) => (
        <QuizPracticeGame
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
