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
import { TypeAnswerPracticeGame } from "./TypeAnswerPracticeGame";

interface TypeAnswerDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assignmentPlan?: TeacherAssignmentPlan;
}

const gameMode = "type-answer" as const;

export function TypeAnswerDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assignmentPlan,
}: TypeAnswerDemoFlowProps) {
  return (
    <PlayableGameRouteShell
      tenant={tenant}
      launchSession={launchSession}
      progression={progression}
      assignmentPlan={assignmentPlan}
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
      {({ progression: currentProgression, onEvent, onComplete }) => (
        <TypeAnswerPracticeGame
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
