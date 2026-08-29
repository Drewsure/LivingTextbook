"use client";

import { PlayableGameRouteShell, type PlayableGameDemoFlowProps } from "../components/PlayableGameRouteShell";
import { TrueFalsePracticeGame } from "./TrueFalsePracticeGame";

const gameMode = "true-false" as const;

export function TrueFalseDemoFlow({
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
        eyebrow: "Core true/false selection slice",
        title: `True or False: ${unit.unitMeta.theme}`,
        summary:
          "Decide whether the listened target-language word matches the visible card. This is a simple selection-engine review mode, not a broad template switch.",
        statusLabel: "Selection",
      }}
      progressTitle="True or False Progress"
    >
      {({ progression: currentProgression, onEvent, onComplete }) => (
        <TrueFalsePracticeGame
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
