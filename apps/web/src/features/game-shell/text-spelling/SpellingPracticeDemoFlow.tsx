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
import { SpellingPracticeGame } from "./SpellingPracticeGame";

interface SpellingPracticeDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assignmentPlan?: TeacherAssignmentPlan;
}

const gameMode = "spelling-practice" as const;

export function SpellingPracticeDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assignmentPlan,
}: SpellingPracticeDemoFlowProps) {
  return (
    <PlayableGameRouteShell
      tenant={tenant}
      launchSession={launchSession}
      progression={progression}
      assignmentPlan={assignmentPlan}
      gameMode={gameMode}
      header={{
        eyebrow: "Core spelling slice",
        title: `Spelling Practice: ${unit.unitMeta.theme}`,
        summary:
          "Listen to reviewed target-language vocabulary and build the spelling from letter tiles. This extends the text-spelling parent engine without adding a one-off game or random reward path.",
        statusLabel: "Text-spelling",
      }}
      progressTitle="Spelling Practice Progress"
    >
      {({ progression: currentProgression, onEvent, onComplete }) => (
        <SpellingPracticeGame
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
