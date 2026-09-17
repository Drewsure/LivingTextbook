"use client";

import { PlayableGameRouteShell, type PlayableGameDemoFlowProps } from "../components/PlayableGameRouteShell";
import { SentenceBuilderPracticeGame } from "./SentenceBuilderPracticeGame";

const gameMode = "sentence-builder" as const;

export function SentenceBuilderDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  packageId,
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
      packageId={packageId}
      audioCues={audioCues}
      audioSupportPlan={audioSupportPlan}
      assignmentPlan={assignmentPlan}
      offerMap={offerMap}
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
      {({ progression: currentProgression, replaySeed, audioCues: targetLanguageAudioCues, targetLanguage, onEvent, onComplete }) => (
        <SentenceBuilderPracticeGame
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
