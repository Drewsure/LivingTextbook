"use client";

import { PlayableGameRouteShell, type PlayableGameDemoFlowProps } from "../components/PlayableGameRouteShell";
import { LabelItPracticeGame } from "./LabelItPracticeGame";

const gameMode = "label-it" as const;

export function LabelItDemoFlow({
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
        eyebrow: "Core image-label slice",
        title: `Label It: ${unit.unitMeta.theme}`,
        summary:
          "Use reviewed label anchors and target-language audio to place labels on a diagram. This proves image-aware games can remain data-driven while uploads stay review-only until storage, rights, and release gates pass.",
        statusLabel: "Pairing",
      }}
      progressTitle="Label It Progress"
    >
      {({ progression: currentProgression, onEvent, onComplete }) => (
        <LabelItPracticeGame
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
