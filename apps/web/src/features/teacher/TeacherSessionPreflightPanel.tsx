import { Card, StatusPill } from "@living-textbook/ui";
import type { TeacherSessionPreflightCheck, TeacherSessionPreflightStatus } from "@/data/sampleTeacherSessionMonitor";

interface TeacherSessionPreflightPanelProps {
  checks: TeacherSessionPreflightCheck[];
}

const statusTone: Record<TeacherSessionPreflightStatus, "neutral" | "success" | "warning"> = {
  pass: "success",
  warning: "warning",
  blocked: "warning",
};

export function TeacherSessionPreflightPanel({ checks }: TeacherSessionPreflightPanelProps) {
  const blockedCount = checks.filter((check) => check.status === "blocked").length;
  const warningCount = checks.filter((check) => check.status === "warning").length;
  const passCount = checks.filter((check) => check.status === "pass").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Session preflight</p>
          <h2 className="mt-1 text-lg font-bold">Student-use readiness gate</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This gate separates safe demo monitoring from classroom-ready operation. A teacher can preview the session, but student pilots need persisted settings, lifecycle controls, report policy, and export rules before live use.
          </p>
        </div>
        <StatusPill label={blockedCount > 0 ? "Blocked" : warningCount > 0 ? "Warnings" : "Ready"} tone={blockedCount > 0 || warningCount > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <PreflightMetric label="Passing" value={String(passCount)} tone="success" />
        <PreflightMetric label="Warnings" value={String(warningCount)} tone="warning" />
        <PreflightMetric label="Blocked" value={String(blockedCount)} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {checks.map((check) => (
          <section key={check.checkId} className="rounded-lg border border-[var(--tenant-border)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{check.owner}</p>
                <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{check.label}</h3>
              </div>
              <StatusPill label={check.status} tone={statusTone[check.status]} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{check.note}</p>
          </section>
        ))}
      </div>
    </Card>
  );
}

function PreflightMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 text-lg font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
