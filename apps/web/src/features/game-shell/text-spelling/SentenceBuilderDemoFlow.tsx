"use client";

import { PlayableGameRouteShell, type PlayableGameDemoFlowProps } from "../components/PlayableGameRouteShell";
import { SentenceBuilderPracticeGame } from "./SentenceBuilderPracticeGame";

const gameMode = "sentence-builder" as const;

export function SentenceBuilderDemoFlow({
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
        eyebrow: "Core syntax slice",
        title: `Sentence Builder: ${unit.unitMeta.theme}`,
        summary:
          "Build the two reviewed target sentence structures from ordered word tiles. This is the first playable text-spelling engine slice: no AI generation, no random rewards, and no premium skin yet.",
        statusLabel: "Text-spelling",
      }}
      progressTitle="Sentence Builder Progress"
    >
      {({ progression: currentProgression, onEvent, onComplete }) => (
        <SentenceBuilderPracticeGame
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
