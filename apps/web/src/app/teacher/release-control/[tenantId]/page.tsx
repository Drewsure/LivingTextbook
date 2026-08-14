import { notFound } from "next/navigation";
import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { samplePackageApprovalLedger } from "@/data/samplePackageApprovalLedger";
import { samplePackagePublishGate } from "@/data/samplePackagePublishGate";
import { samplePilotHandoffPackage } from "@/data/samplePilotHandoffPackage";
import { PackageApprovalLedgerPanel } from "@/features/pilot/PackageApprovalLedgerPanel";
import { PackagePublishGatePanel } from "@/features/pilot/PackagePublishGatePanel";
import { PilotReleaseCandidatePanel } from "@/features/pilot/PilotReleaseCandidatePanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

interface TeacherReleaseControlPageProps {
  params: Promise<{
    tenantId: string;
  }>;
}

const localBaseUrl = "http://127.0.0.1:3000";

const releaseSourceRoutes = [
  {
    label: "Teacher intake source",
    path: "/teacher/intake",
    note: "Broad admin review surface for package, storage, upload, release, and policy gates.",
  },
  {
    label: "Partner demo source",
    path: "/partner-demo",
    note: "White-label route showing the current partner package without implying pilot approval.",
  },
  {
    label: "Teacher dry-run source",
    path: "/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run",
    note: "Teacher-only rehearsal before classroom launch or real learner data collection.",
  },
  {
    label: "Classroom launch gate source",
    path: "/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate",
    note: "Final go/no-go review surface; launch remains blocked.",
  },
  {
    label: "Publisher maintenance source",
    path: "/teacher/maintenance/sample-publisher",
    note: "Yearly content, media, game, QR, local package, and report maintenance review.",
  },
  {
    label: "Target pilot route",
    path: samplePackagePublishGate.targetPilotRoute,
    note: "Controlled demo route only until release-control, policy, media rights, and persistence gates close.",
  },
];

export default async function TeacherReleaseControlPage({ params }: TeacherReleaseControlPageProps) {
  const { tenantId } = await params;

  if (tenantId !== samplePublisherTenant.id) {
    notFound();
  }

  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Release-control route workspace</p>
              <h2 className="mt-1 text-2xl font-bold">Pilot release decision room</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                This teacher/admin page collects the first partner release candidate, publish gate, and approval
                ledger in one place. It is for review and partner discussion only; it cannot publish, activate an
                assignment, mutate release state, release a local bundle, or mark a package student-ready.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill label={samplePilotHandoffPackage.recommendedPilotWindow} tone="success" />
              <StatusPill label="No live publish workflow" tone="warning" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Release source routes</p>
              <h2 className="mt-1 text-lg font-bold">Review source evidence without publishing</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                These route links keep the release conversation grounded in current review evidence. They do not
                create a release action, student assignment, local package, or report export.
              </p>
            </div>
            <StatusPill label={`${releaseSourceRoutes.length} source routes`} tone="neutral" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {releaseSourceRoutes.map((route) => (
              <article key={route.path} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{route.label}</p>
                <a
                  href={route.path}
                  className="mt-2 block break-all font-mono text-xs font-semibold text-[var(--tenant-text)] underline decoration-[var(--tenant-border)] underline-offset-4 transition hover:text-[var(--tenant-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
                >
                  {`${localBaseUrl}${route.path}`}
                </a>
                <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{route.note}</p>
              </article>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Blocked release actions</p>
              <h2 className="mt-1 text-lg font-bold">No operational release controls in this scaffold</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                The release-control route shows decision evidence only. It does not expose any future release
                control until policy, storage, media, game-audio, approval, and rollback gates are accepted.
              </p>
            </div>
            <StatusPill label="Review only" tone="warning" />
          </div>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] md:grid-cols-2">
            {[
              "No publish button",
              "No release-state mutation",
              "No assignment activation",
              "No local bundle release",
              "No student-ready marker",
              "No support-language-only release",
            ].map((rule) => (
              <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                {rule}
              </li>
            ))}
          </ul>
        </Card>

        <PilotReleaseCandidatePanel gate={samplePackagePublishGate} ledger={samplePackageApprovalLedger} />
        <PackagePublishGatePanel gate={samplePackagePublishGate} />
        <PackageApprovalLedgerPanel ledger={samplePackageApprovalLedger} />
      </div>
    </AppShell>
  );
}
