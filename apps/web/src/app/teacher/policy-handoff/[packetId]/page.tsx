import { notFound } from "next/navigation";
import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { sampleSchoolLaunchPolicyGate } from "@/data/sampleSchoolLaunchPolicyGate";
import { sampleSchoolPolicyAcceptancePreflight } from "@/data/sampleSchoolPolicyAcceptancePreflight";
import { sampleSchoolPolicyAcceptanceRecordPreview } from "@/data/sampleSchoolPolicyAcceptanceRecordPreview";
import { sampleSchoolPolicyHandoffPacket } from "@/data/sampleSchoolPolicyHandoffPacket";
import { sampleSchoolPolicyTextPack } from "@/data/sampleSchoolPolicyTextPack";
import { sampleTeacherDryRunRehearsal } from "@/data/sampleTeacherDryRunRehearsal";
import { SchoolLaunchPolicyGatePanel } from "@/features/pilot/SchoolLaunchPolicyGatePanel";
import { SchoolPolicyAcceptanceRecordPreviewPanel } from "@/features/pilot/SchoolPolicyAcceptanceRecordPreviewPanel";
import { SchoolPolicyAcceptancePreflightPanel } from "@/features/pilot/SchoolPolicyAcceptancePreflightPanel";
import { SchoolPolicyHandoffPacketPanel } from "@/features/pilot/SchoolPolicyHandoffPacketPanel";
import { SchoolPolicyTextPackPanel } from "@/features/pilot/SchoolPolicyTextPackPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

interface SchoolPolicyHandoffPageProps {
  params: Promise<{
    packetId: string;
  }>;
}

const localBaseUrl = "http://127.0.0.1:3000";

const sourceRoutes = [
  {
    label: "Teacher intake source",
    path: "/teacher/intake",
    note: "Broad admin review surface for package, route, upload, release, storage, and policy readiness.",
  },
  {
    label: "Classroom launch gate source",
    path: "/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate",
    note: "Go/no-go route that keeps launch, learner data, and report export blocked.",
  },
  {
    label: "Teacher dry-run source",
    path: sampleTeacherDryRunRehearsal.workspacePath,
    note: "Teacher-only rehearsal route for entry, games, audio, media, reports, and local fallback.",
  },
  {
    label: "Evidence handoff source",
    path: "/teacher/evidence/sample-publisher/handoff",
    note: "Evidence packet handoff preview; export and signed approval remain blocked.",
  },
];

export default async function SchoolPolicyHandoffPage({ params }: SchoolPolicyHandoffPageProps) {
  const { packetId } = await params;

  if (packetId !== sampleSchoolPolicyHandoffPacket.packetId) {
    notFound();
  }

  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">School policy handoff route workspace</p>
              <h2 className="mt-1 text-2xl font-bold">School meeting packet preview</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                Use this teacher/admin page as the direct meeting view for school, publisher, and platform policy review. It is a discussion packet only; it cannot accept policy, capture signatures, export evidence, create launch-ready status, activate local deployment, or start a live classroom workflow.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill label="Discussion only" tone="warning" />
              <StatusPill label="No policy acceptance" tone="neutral" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Handoff source routes</p>
              <h2 className="mt-1 text-lg font-bold">Review the source evidence without approving launch</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                These routes help a school meeting stay grounded in the current foundation records. They do not create assignments, approve reports, store learner data, or change release state.
              </p>
            </div>
            <StatusPill label={`${sourceRoutes.length} source routes`} tone="neutral" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {sourceRoutes.map((route) => (
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

        <SchoolPolicyHandoffPacketPanel packet={sampleSchoolPolicyHandoffPacket} />
        <SchoolPolicyAcceptancePreflightPanel preflight={sampleSchoolPolicyAcceptancePreflight} />
        <SchoolPolicyTextPackPanel pack={sampleSchoolPolicyTextPack} />
        <SchoolPolicyAcceptanceRecordPreviewPanel preview={sampleSchoolPolicyAcceptanceRecordPreview} />
        <SchoolLaunchPolicyGatePanel gate={sampleSchoolLaunchPolicyGate} />
      </div>
    </AppShell>
  );
}
