"use client";

import { PlayableGameRouteShell, type PlayableGameDemoFlowProps } from "../components/PlayableGameRouteShell";
import { FillInBlankPracticeGame } from "./FillInBlankPracticeGame";

const gameMode = "fill-in-the-blank" as const;

export function FillInBlankDemoFlow({
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
        eyebrow: "Core fill-in slice",
        title: `Fill in the Blank: ${unit.unitMeta.theme}`,
        summary:
          "Choose the missing reviewed word or phrase inside approved target sentences. This extends the text-spelling parent engine with a low-cost syntax mode, target-language audio, deterministic scoring, and no switch-template drift.",
        statusLabel: "Text-spelling",
      }}
      progressTitle="Fill in the Blank Progress"
    >
      {({ progression: currentProgression, onEvent, onComplete }) => (
        <FillInBlankPracticeGame
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
