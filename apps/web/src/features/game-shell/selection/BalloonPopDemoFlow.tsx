"use client";

import { PlayableGameRouteShell, type PlayableGameDemoFlowProps } from "../components/PlayableGameRouteShell";
import { BalloonPopPracticeGame } from "./BalloonPopPracticeGame";

const gameMode = "balloon-pop" as const;

export function BalloonPopDemoFlow({
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
        eyebrow: "Core arcade selection slice",
        title: `Balloon Pop: ${unit.unitMeta.theme}`,
        summary:
          "Pop reviewed vocabulary balloons with tap-to-speak prompts. This is the structural arcade skin over the selection parent engine before Phaser-level motion or premium polish.",
        statusLabel: "Arcade reinforcement",
      }}
      progressTitle="Balloon Pop Progress"
    >
      {({ progression: currentProgression, onEvent, onComplete }) => (
        <BalloonPopPracticeGame
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
