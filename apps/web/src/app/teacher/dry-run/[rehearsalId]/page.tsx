import { notFound } from "next/navigation";
import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { sampleClassroomLaunchGate } from "@/data/sampleClassroomLaunchGate";
import { sampleTeacherDryRunRehearsal } from "@/data/sampleTeacherDryRunRehearsal";
import { ClassroomLaunchGatePanel } from "@/features/pilot/ClassroomLaunchGatePanel";
import { TeacherDryRunRehearsalPanel } from "@/features/pilot/TeacherDryRunRehearsalPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

interface TeacherDryRunPageProps {
  params: Promise<{
    rehearsalId: string;
  }>;
}

const localBaseUrl = "http://127.0.0.1:3000";

export default async function TeacherDryRunPage({ params }: TeacherDryRunPageProps) {
  const { rehearsalId } = await params;

  if (rehearsalId !== sampleTeacherDryRunRehearsal.rehearsalId) {
    notFound();
  }

  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher dry-run route workspace</p>
              <h2 className="mt-1 text-2xl font-bold">Pre-classroom rehearsal</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                Use this teacher-only page to rehearse the sample publisher package before students are invited. It is a route checklist and evidence preview only; it cannot collect real learner data, store live progress, export reports, or approve a pilot.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill label="No classroom launch action" tone="neutral" />
              <StatusPill label="Preview only" tone="success" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Rehearsal route shortcuts</p>
              <h2 className="mt-1 text-lg font-bold">Open each route during the teacher-only pass</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                These links are for a controlled dry run. They do not schedule a class, create an assignment, or switch report export on.
              </p>
            </div>
            <StatusPill label={`${sampleTeacherDryRunRehearsal.stages.length} checks`} tone="neutral" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {sampleTeacherDryRunRehearsal.stages.map((stage) => (
              <article key={stage.stageId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{stage.category}</p>
                <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{stage.label}</h3>
                <a
                  href={stage.routePath}
                  className="mt-2 block break-all font-mono text-xs font-semibold text-[var(--tenant-text)] underline decoration-[var(--tenant-border)] underline-offset-4 transition hover:text-[var(--tenant-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
                >
                  {`${localBaseUrl}${stage.routePath}`}
                </a>
                <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{stage.expectedEvidence}</p>
              </article>
            ))}
          </div>
        </Card>

        <TeacherDryRunRehearsalPanel rehearsal={sampleTeacherDryRunRehearsal} />
        <ClassroomLaunchGatePanel gate={sampleClassroomLaunchGate} />
      </div>
    </AppShell>
  );
}
