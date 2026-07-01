import { Card, StatusPill } from "@living-textbook/ui";
import type { TeacherSessionMonitorContext, TeacherSessionSettingStatus } from "@/data/sampleTeacherSessionMonitor";
import { FrontDoorTeacherReportPreview } from "@/features/access/FrontDoorTeacherReportPreview";

interface TeacherSessionMonitorPanelProps {
  context: TeacherSessionMonitorContext;
}

const settingTone: Record<TeacherSessionSettingStatus, "neutral" | "success" | "warning"> = {
  enabled: "success",
  disabled: "neutral",
  "requires-persistence": "warning",
  "premium-disabled": "neutral",
};

export function TeacherSessionMonitorPanel({ context }: TeacherSessionMonitorPanelProps) {
  const unitTitle = context.unit?.unitMeta.theme ?? context.launchSession.unitKey;

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher session monitor</p>
            <h2 className="mt-1 text-2xl font-bold">{unitTitle}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This sample report shows how a teacher-facing monitor can combine launch state, student progression, media engagement, Training Academy recovery, and speaking-practice readiness without adding a production backend yet.
            </p>
          </div>
          <StatusPill label={context.launchSession.status} tone="success" />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Session snapshot</p>
            <h3 className="mt-1 text-lg font-bold">Reportable classroom state</h3>
          </div>
          <StatusPill label="Sample data" tone="warning" />
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {context.metrics.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <dt className="text-xs font-semibold text-[var(--tenant-muted)]">{metric.label}</dt>
              <dd className="mt-1 text-lg font-bold">{metric.value}</dd>
              <dd className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">{metric.note}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Session controls to persist</p>
            <h3 className="mt-1 text-lg font-bold">Teacher settings before classroom use</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              These controls are shown as policy shape, not live classroom state. Production use needs persisted launch-session settings so teacher choices reliably reach student devices.
            </p>
          </div>
          <StatusPill label={`${context.settings.length} settings`} tone="warning" />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {context.settings.map((setting) => (
            <section key={setting.settingId} className="rounded-lg border border-[var(--tenant-border)] p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h4 className="text-sm font-bold">{setting.label}</h4>
                <StatusPill label={setting.status} tone={settingTone[setting.status]} />
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{setting.note}</p>
            </section>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot readiness notes</p>
            <h3 className="mt-1 text-lg font-bold">Before this becomes live reporting</h3>
          </div>
          <StatusPill label="Needs persistence" tone="warning" />
        </div>
        <ul className="mt-4 grid gap-3 text-sm leading-6 text-[var(--tenant-muted)]">
          {context.readinessNotes.map((note) => (
            <li key={note} className="rounded-lg border border-[var(--tenant-border)] p-3">
              {note}
            </li>
          ))}
        </ul>
      </Card>

      <FrontDoorTeacherReportPreview tenant={context.tenant} progression={context.progression} events={context.events} />
    </div>
  );
}
