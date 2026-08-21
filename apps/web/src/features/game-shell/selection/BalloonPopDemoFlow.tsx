"use client";

import type {
  AudioCue,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import type { TeacherAssignmentPlan } from "@living-textbook/content-model/src/teacherAssignment";
import type { TenantConfig } from "@/features/tenant/types";
import { PlayableGameRouteShell } from "../components/PlayableGameRouteShell";
import { BalloonPopPracticeGame } from "./BalloonPopPracticeGame";

interface BalloonPopDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assignmentPlan?: TeacherAssignmentPlan;
}

const gameMode = "balloon-pop" as const;

export function BalloonPopDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assignmentPlan,
}: BalloonPopDemoFlowProps) {
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
