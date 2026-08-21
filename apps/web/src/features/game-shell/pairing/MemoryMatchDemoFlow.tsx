"use client";

import { PlayableGameRouteShell, type PlayableGameDemoFlowProps } from "../components/PlayableGameRouteShell";
import { PairingMemoryMatchGame } from "./PairingMemoryMatchGame";

const gameMode = "memory-match" as const;

export function MemoryMatchDemoFlow({
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
        eyebrow: "Core pairing slice",
        title: `Memory Match: ${unit.unitMeta.theme}`,
        summary:
          "Match reviewed vocabulary pairs with tap-to-speak support on every card. This is the reusable pairing parent engine before skins like Match Up, Matching Pairs, or Whack-a-Mole.",
        statusLabel: "Pairing",
      }}
      progressTitle="Memory Match Progress"
    >
      {({ progression: currentProgression, onEvent, onComplete }) => (
        <PairingMemoryMatchGame
          unit={unit}
          gameMode={gameMode}
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
