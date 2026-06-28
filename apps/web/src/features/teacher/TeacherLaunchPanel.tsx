import { Card, StatusPill } from "@living-textbook/ui";
import type { LaunchSession, UnitPayload } from "@living-textbook/content-model";
import { getStudentLaunchPath } from "@/features/routes/routeContracts";

interface TeacherLaunchPanelProps {
  unit: UnitPayload;
  launchSession: LaunchSession;
}

export function TeacherLaunchPanel({ unit, launchSession }: TeacherLaunchPanelProps) {
  const launchPath = getStudentLaunchPath(launchSession.launchCode);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher Launch Protocol</p>
          <h2 className="mt-1 text-lg font-bold">{unit.unitMeta.theme}</h2>
        </div>
        <StatusPill label="Teacher-led" />
      </div>
      <div className="mt-5 grid gap-4">
        <ProtocolBlock label="Hook" value={unit.teacherLaunchProtocol.hook} />
        <ProtocolBlock label="Activity" value={unit.teacherLaunchProtocol.activity} />
        <ProtocolBlock label="Review" value={unit.teacherLaunchProtocol.review} />
      </div>
      <div className="mt-5 grid gap-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-sm font-semibold">Classroom launch route</p>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">{launchPath}</p>
          <dl className="mt-3 grid gap-2 text-xs text-[var(--tenant-muted)] sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-[var(--tenant-text)]">Code</dt>
              <dd>{launchSession.launchCode}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--tenant-text)]">Status</dt>
              <dd>{launchSession.status}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--tenant-text)]">Entry</dt>
              <dd>{launchSession.entryMode}</dd>
            </div>
          </dl>
        </div>
        <a
          href={launchPath}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-text)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
        >
          Open student launch
        </a>
      </div>
    </Card>
  );
}

function ProtocolBlock({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <h3 className="text-sm font-bold text-[var(--tenant-muted)]">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
