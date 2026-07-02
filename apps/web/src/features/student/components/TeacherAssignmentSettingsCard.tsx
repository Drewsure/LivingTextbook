import { Card, StatusPill } from "@living-textbook/ui";
import type { TeacherAssignmentControlPlan, TeacherAssignmentPlan } from "@living-textbook/content-model/src/teacherAssignment";

interface TeacherAssignmentSettingsCardProps {
  assignmentPlan?: TeacherAssignmentPlan;
}

export function TeacherAssignmentSettingsCard({ assignmentPlan }: TeacherAssignmentSettingsCardProps) {
  if (!assignmentPlan) {
    return null;
  }

  const targetAudio = findControl(assignmentPlan, "target-audio");
  const assistLanguage = findControl(assignmentPlan, "assist-language");
  const microphonePractice = findControl(assignmentPlan, "microphone-practice") ?? findControl(assignmentPlan, "cloud-speech-scoring");
  const aiTutor = findControl(assignmentPlan, "ai-tutor");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher settings</p>
          <h2 className="mt-1 text-lg font-bold">{assignmentPlan.label}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            English listening and speaking are the progress path. Support language can help understanding, but English practice unlocks the next activity.
          </p>
        </div>
        <StatusPill label={assignmentPlan.access.accessMode} tone="success" />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <SessionSetting label="English audio" value={targetAudio?.status === "enabled" ? "Required" : "Available"} tone="success" />
        <SessionSetting label="Support language" value={assistLanguage ? "Support only" : "Off"} tone={assistLanguage ? "neutral" : "warning"} />
        <SessionSetting label="Microphone" value={microphoneLabel(microphonePractice)} tone={microphonePractice?.status === "teacher-optional" ? "neutral" : "warning"} />
        <SessionSetting label="AI Tutor" value={aiTutor?.status === "premium-disabled" ? "Premium off" : "Off"} tone="neutral" />
      </dl>
    </Card>
  );
}

function findControl(plan: TeacherAssignmentPlan, controlId: string): TeacherAssignmentControlPlan | undefined {
  return plan.controls.find((control) => control.controlId === controlId);
}

function microphoneLabel(control?: TeacherAssignmentControlPlan): string {
  if (!control) {
    return "Teacher off";
  }

  if (control.status === "teacher-optional") {
    return "Teacher optional";
  }

  if (control.status === "premium-disabled") {
    return "Premium off";
  }

  if (control.status === "enabled") {
    return "On";
  }

  return "Teacher off";
}

function SessionSetting({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-2 flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-[var(--tenant-text)]">{value}</span>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Off" : "Info"} tone={tone} />
      </dd>
    </div>
  );
}
