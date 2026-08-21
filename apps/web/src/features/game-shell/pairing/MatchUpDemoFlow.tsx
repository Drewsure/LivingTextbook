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
import { PairingMatchUpGame } from "./PairingMatchUpGame";

interface MatchUpDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assignmentPlan?: TeacherAssignmentPlan;
}

const gameMode = "match-up" as const;

export function MatchUpDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assignmentPlan,
}: MatchUpDemoFlowProps) {
  return (
    <PlayableGameRouteShell
      tenant={tenant}
      launchSession={launchSession}
      progression={progression}
      assignmentPlan={assignmentPlan}
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
      {({ progression: currentProgression, onEvent, onComplete }) => (
        <PairingMatchUpGame
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
