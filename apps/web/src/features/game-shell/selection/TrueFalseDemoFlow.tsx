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
import { TrueFalsePracticeGame } from "./TrueFalsePracticeGame";

interface TrueFalseDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assignmentPlan?: TeacherAssignmentPlan;
}

const gameMode = "true-false" as const;

export function TrueFalseDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assignmentPlan,
}: TrueFalseDemoFlowProps) {
  return (
    <PlayableGameRouteShell
      tenant={tenant}
      launchSession={launchSession}
      progression={progression}
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
