import { notFound } from "next/navigation";
import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { sampleClassroomLaunchGate } from "@/data/sampleClassroomLaunchGate";
import { sampleSchoolLaunchPolicyGate } from "@/data/sampleSchoolLaunchPolicyGate";
import { sampleSchoolPolicyAcceptancePreflight } from "@/data/sampleSchoolPolicyAcceptancePreflight";
import { sampleSchoolPolicyHandoffPacket } from "@/data/sampleSchoolPolicyHandoffPacket";
import { sampleSchoolPolicyTextPack } from "@/data/sampleSchoolPolicyTextPack";
import { sampleTeacherDryRunRehearsal } from "@/data/sampleTeacherDryRunRehearsal";
import { ClassroomLaunchGatePanel } from "@/features/pilot/ClassroomLaunchGatePanel";
import { SchoolPolicyAcceptancePreflightPanel } from "@/features/pilot/SchoolPolicyAcceptancePreflightPanel";
import { SchoolLaunchPolicyGatePanel } from "@/features/pilot/SchoolLaunchPolicyGatePanel";
import { SchoolPolicyHandoffPacketPanel } from "@/features/pilot/SchoolPolicyHandoffPacketPanel";
import { SchoolPolicyTextPackPanel } from "@/features/pilot/SchoolPolicyTextPackPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

interface ClassroomLaunchGatePageProps {
  params: Promise<{
    gateId: string;
  }>;
}

const localBaseUrl = "http://127.0.0.1:3000";

const sourceRoutes = [
  {
    label: "Teacher intake source",
    path: "/teacher/intake",
    note: "Broad admin review surface for package, storage, upload, release, and policy readiness.",
  },
  {
    label: "Teacher dry-run source",
    path: sampleTeacherDryRunRehearsal.workspacePath,
    note: "Teacher-only route, game/audio, media, report, and local fallback rehearsal workspace.",
  },
  {
    label: "Partner session report preview",
    path: "/teacher/sessions/partner-demo-unit-1/report-package",
    note: "Read-only report package preview; export remains blocked until policy and persistence pass.",
  },
  {
    label: "Partner launch demo route",
    path: "/launch/partner-demo-unit-1",
    note: "Controlled demo route only; it is not a live classroom assignment or pilot launch.",
  },
  {
    label: "School policy handoff source",
    path: "/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet",
    note: "Direct school meeting packet preview; it cannot accept policy, export evidence, or approve launch.",
  },
];

export default async function ClassroomLaunchGatePage({ params }: ClassroomLaunchGatePageProps) {
  const { gateId } = await params;

  if (gateId !== sampleClassroomLaunchGate.gateId) {
    notFound();
  }

  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Classroom launch gate route workspace</p>
              <h2 className="mt-1 text-2xl font-bold">Final pre-launch review</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                Use this teacher/admin page to review why the package is still blocked before real classroom use. It is a go/no-go review surface only; it cannot invite students, create assignments, collect real learner data, store live progress, export reports, or approve a pilot.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill label="No live classroom launch" tone="warning" />
              <StatusPill label="Review only" tone="neutral" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Launch gate source routes</p>
              <h2 className="mt-1 text-lg font-bold">Review the evidence sources without starting a class</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                These source links support partner and school review. They do not schedule a class, create a launch button, or change package status.
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

        <ClassroomLaunchGatePanel gate={sampleClassroomLaunchGate} />
        <SchoolLaunchPolicyGatePanel gate={sampleSchoolLaunchPolicyGate} />
        <SchoolPolicyHandoffPacketPanel packet={sampleSchoolPolicyHandoffPacket} />
        <SchoolPolicyAcceptancePreflightPanel preflight={sampleSchoolPolicyAcceptancePreflight} />
        <SchoolPolicyTextPackPanel pack={sampleSchoolPolicyTextPack} />
      </div>
    </AppShell>
  );
}
