import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { sampleDeploymentDecisionGuide } from "@/data/sampleDeploymentDecisionGuide";
import {
  samplePersistenceAdapterPlans,
  samplePersistenceAdapterWarnings,
} from "@/data/samplePersistenceAdapterPlan";
import { samplePilotEvidencePacket } from "@/data/samplePilotEvidencePacket";
import { samplePilotHandoffPackage } from "@/data/samplePilotHandoffPackage";
import { samplePilotLaunchChecklist } from "@/data/samplePilotLaunchChecklist";
import {
  samplePilotPolicyPlans,
  samplePilotPolicyWarnings,
} from "@/data/samplePilotPolicyPlan";
import { samplePilotReadinessDashboard } from "@/data/samplePilotReadinessDashboard";
import { samplePilotReadinessSummary } from "@/data/samplePilotReadinessSummary";
import { sampleSchoolLaunchPolicyGate } from "@/data/sampleSchoolLaunchPolicyGate";
import { sampleTeacherDryRunRehearsal } from "@/data/sampleTeacherDryRunRehearsal";
import { whiteLabelPilotReadiness } from "@/data/whiteLabelPilotReadiness";
import { DeploymentDecisionGuidePanel } from "@/features/deployment/DeploymentDecisionGuidePanel";
import { ClassroomLaunchGatePanel } from "@/features/pilot/ClassroomLaunchGatePanel";
import { PackagePublishGatePanel } from "@/features/pilot/PackagePublishGatePanel";
import { PilotEvidencePacketPanel } from "@/features/pilot/PilotEvidencePacketPanel";
import { PilotHandoffPackagePanel } from "@/features/pilot/PilotHandoffPackagePanel";
import { PilotLaunchChecklistPanel } from "@/features/pilot/PilotLaunchChecklistPanel";
import { PilotReadinessDashboardPanel } from "@/features/pilot/PilotReadinessDashboardPanel";
import { PilotReadinessGatePanel } from "@/features/pilot/PilotReadinessGatePanel";
import { PilotReadinessSummaryPanel } from "@/features/pilot/PilotReadinessSummaryPanel";
import { SchoolLaunchPolicyGatePanel } from "@/features/pilot/SchoolLaunchPolicyGatePanel";
import { TeacherDryRunRehearsalPanel } from "@/features/pilot/TeacherDryRunRehearsalPanel";
import { WhiteLabelPilotReadinessPanel } from "@/features/pilot/WhiteLabelPilotReadinessPanel";
import { samplePackagePublishGate } from "@/data/samplePackagePublishGate";
import { sampleClassroomLaunchGate } from "@/data/sampleClassroomLaunchGate";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

const pilotLinks = [
  { href: "/partner-demo", label: "Partner demo" },
  { href: "/teacher/deployment", label: "Deployment decisions" },
  { href: "/teacher/intake", label: "Foundation control room" },
  { href: "/teacher/sessions/partner-demo-unit-1", label: "Partner session monitor" },
  { href: "/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run", label: "Teacher dry run" },
  {
    href: "/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate",
    label: "Classroom launch gate",
  },
];

export default function TeacherPilotPage() {
  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot readiness command view</p>
              <h2 className="mt-1 text-2xl font-bold">Demo-ready, not classroom-ready</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
                This route is the plain-language pilot board for partner conversations. It shows what can be demonstrated,
                what the publisher or school must still decide, and why live learner data, report export, local package
                activation, and classroom launch remain blocked.
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <StatusPill label="8-12 week pilot target" tone="success" />
              <StatusPill label="No classroom launch" tone="warning" />
              <StatusPill label="No real learner data" tone="warning" />
              <StatusPill label="No report export" tone="warning" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pilotLinks.map((link) => (
              <PilotLink key={link.href} href={link.href} label={link.label} />
            ))}
          </div>

          <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing pilot gate</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              A controlled demo can be shown before a real pilot. A classroom pilot needs reviewed source evidence,
              target-language audio, school policy, persistence, reporting, private assignment, deployment, media rights,
              and release-control gates to close first.
            </p>
          </section>
        </Card>

        <PilotReadinessDashboardPanel dashboard={samplePilotReadinessDashboard} />
        <WhiteLabelPilotReadinessPanel readiness={whiteLabelPilotReadiness} />
        <PilotReadinessGatePanel
          readiness={whiteLabelPilotReadiness}
          policyPlans={samplePilotPolicyPlans}
          persistencePlans={samplePersistenceAdapterPlans}
        />
        <DeploymentDecisionGuidePanel guide={sampleDeploymentDecisionGuide} />
        <PilotReadinessSummaryPanel summary={samplePilotReadinessSummary} />
        <PilotLaunchChecklistPanel checklist={samplePilotLaunchChecklist} />
        <TeacherDryRunRehearsalPanel rehearsal={sampleTeacherDryRunRehearsal} />
        <ClassroomLaunchGatePanel gate={sampleClassroomLaunchGate} />
        <SchoolLaunchPolicyGatePanel gate={sampleSchoolLaunchPolicyGate} />
        <PilotEvidencePacketPanel packet={samplePilotEvidencePacket} />
        <PilotHandoffPackagePanel handoffPackage={samplePilotHandoffPackage} />
        <PackagePublishGatePanel gate={samplePackagePublishGate} />

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Open policy and storage warnings</p>
              <h2 className="mt-1 text-lg font-bold">Warnings that must stay visible before pilot launch</h2>
            </div>
            <StatusPill label="Review-only" tone="warning" />
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <PilotWarningList title="Policy warnings" items={samplePilotPolicyWarnings} />
            <PilotWarningList title="Persistence warnings" items={samplePersistenceAdapterWarnings} />
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function PilotLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4 text-sm font-bold text-[var(--tenant-text)] underline-offset-4 hover:underline"
      href={href}
    >
      {label}
      <span className="mt-1 block break-words text-xs font-semibold text-[var(--tenant-muted)]">{href}</span>
    </a>
  );
}

function PilotWarningList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={`${items.length} warning(s)`} tone={items.length > 0 ? "warning" : "success"} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
