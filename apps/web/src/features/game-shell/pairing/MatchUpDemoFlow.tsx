"use client";

import { PlayableGameRouteShell, type PlayableGameDemoFlowProps } from "../components/PlayableGameRouteShell";
import { PairingMatchUpGame } from "./PairingMatchUpGame";

const gameMode = "match-up" as const;

export function MatchUpDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  audioSupportPlan,
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
      audioSupportPlan={audioSupportPlan}
      assignmentPlan={assignmentPlan}
      offerMap={offerMap}
      gameMode={gameMode}
      header={{
        eyebrow: "Core visible pairing slice",
        title: `Match Up: ${unit.unitMeta.theme}`,
        summary:
          "Match listening prompts to reviewed vocabulary word cards. This reuses the pairing parent engine as a visible classroom-friendly mode rather than a separate one-off game.",
        statusLabel: "Pairing",
      }}
      progressTitle="Match Up Progress"
    >
      {({ progression: currentProgression, replaySeed, audioCues: targetLanguageAudioCues, targetLanguage, onEvent, onComplete }) => (
        <PairingMatchUpGame
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
