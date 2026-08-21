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
import { SentenceBuilderPracticeGame } from "./SentenceBuilderPracticeGame";

interface SentenceBuilderDemoFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  assignmentPlan?: TeacherAssignmentPlan;
}

const gameMode = "sentence-builder" as const;

export function SentenceBuilderDemoFlow({
  tenant,
  unit,
  launchSession,
  progression,
  audioCues = [],
  assignmentPlan,
}: SentenceBuilderDemoFlowProps) {
  return (
    <PlayableGameRouteShell
      tenant={tenant}
      launchSession={launchSession}
      progression={progression}
      assignmentPlan={assignmentPlan}
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
      {({ progression: currentProgression, onEvent, onComplete }) => (
        <SentenceBuilderPracticeGame
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
