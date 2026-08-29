"use client";

import { PlayableGameRouteShell, type PlayableGameDemoFlowProps } from "../components/PlayableGameRouteShell";
import { TypeAnswerPracticeGame } from "./TypeAnswerPracticeGame";

const gameMode = "type-answer" as const;

export function TypeAnswerDemoFlow({
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
        eyebrow: "Core typing slice",
        title: `Type Answer: ${unit.unitMeta.theme}`,
        summary:
          "Listen to reviewed target-language vocabulary and type the answer. This proves the text-spelling parent engine can support typed response work without random rewards or support-language shortcuts.",
        statusLabel: "Text-spelling",
      }}
      progressTitle="Type Answer Progress"
    >
      {({ progression: currentProgression, onEvent, onComplete }) => (
        <TypeAnswerPracticeGame
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
