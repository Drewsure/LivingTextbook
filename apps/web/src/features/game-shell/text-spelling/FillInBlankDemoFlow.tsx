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
import { FillInBlankPracticeGame } from "./FillInBlankPracticeGame";

interface FillInBlankDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assignmentPlan?: TeacherAssignmentPlan;
}

const gameMode = "fill-in-the-blank" as const;

export function FillInBlankDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assignmentPlan,
}: FillInBlankDemoFlowProps) {
  return (
    <PlayableGameRouteShell
      tenant={tenant}
      launchSession={launchSession}
      progression={progression}
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
