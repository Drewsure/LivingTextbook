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
        eyebrow: "Core typing slice",
        title: `Type Answer: ${unit.unitMeta.theme}`,
        summary:
          "Listen to reviewed target-language vocabulary and type the answer. This proves the text-spelling parent engine can support typed response work without random rewards or support-language shortcuts.",
        statusLabel: "Text-spelling",
      }}
      progressTitle="Type Answer Progress"
    >
      {({ progression: currentProgression, replaySeed, audioCues: targetLanguageAudioCues, targetLanguage, onEvent, onComplete }) => (
        <TypeAnswerPracticeGame
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
