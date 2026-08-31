import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import {
  sampleClassRosterErrors,
  sampleClassRosterPlans,
  sampleClassRosterWarnings,
} from "@/data/sampleClassRosterPlans";
import { sampleAssignmentRolloutPlans } from "@/data/sampleAssignmentRolloutPlan";
import {
  sampleTeacherAssignmentErrors,
  sampleTeacherAssignmentPlans,
  sampleTeacherAssignmentWarnings,
} from "@/data/sampleTeacherAssignmentPlans";
import { ClassRosterReadinessPanel } from "@/features/teacher/ClassRosterReadinessPanel";
import { TeacherAssignmentReadinessPanel } from "@/features/teacher/TeacherAssignmentReadinessPanel";
import { TeacherAssignmentRolloutPanel } from "@/features/teacher/TeacherAssignmentRolloutPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

const assignmentLinks = [
  { href: "/assign/assignment-ministar-demo-whole-class", label: "Open MiniStar private assignment" },
  { href: "/assign/assignment-sample-publisher-front-door", label: "Open partner private assignment" },
  { href: "/teacher/sessions/demo-unit-1", label: "Open MiniStar session monitor" },
  { href: "/teacher/sessions/partner-demo-unit-1", label: "Open partner session monitor" },
  { href: "/teacher/reporting", label: "Open reporting readiness" },
  { href: "/teacher/persistence", label: "Open persistence readiness" },
];

export default function TeacherAssignmentsPage() {
  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Assignment rollout workbench</p>
              <h2 className="mt-1 text-2xl font-bold">Private links, QR entry, roster scope, and pilot scheduling gates</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
                This teacher/admin route gathers the assignment readiness, rollout, and roster gates that sit between a
                reviewed package and a real classroom pilot. It is a planning surface only; it cannot schedule classes,
                activate private assignment links, bind rosters, start progress streams, collect real learner data,
                export reports, or bypass school policy.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill label="Review-only" tone="warning" />
              <StatusPill label="No live scheduling" tone="warning" />
              <StatusPill label="No real learner data" tone="warning" />
              <StatusPill label="No production student accounts" tone="warning" />
              <StatusPill label="Class roster readiness" tone="warning" />
              <StatusPill label="Target language only" tone="success" />
            </div>
          </div>

          <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing assignment gate</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              Private assignment links and QR/front-door entry are the first safe sharing path. Public sharing,
              iframe embeds, live roster binding, report export, and generated-package assignment handoff stay blocked
              until persistence, launch safety, school policy, target-language audio, and rollout evidence all pass.
            </p>
          </section>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {assignmentLinks.map((link) => (
              <AssignmentLink key={link.href} href={link.href} label={link.label} />
            ))}
          </div>
        </Card>

        <TeacherAssignmentReadinessPanel
          plans={sampleTeacherAssignmentPlans}
          errors={sampleTeacherAssignmentErrors}
          warnings={sampleTeacherAssignmentWarnings}
        />
        <TeacherAssignmentRolloutPanel plans={sampleAssignmentRolloutPlans} />
        <ClassRosterReadinessPanel
          plans={sampleClassRosterPlans}
          errors={sampleClassRosterErrors}
          warnings={sampleClassRosterWarnings}
        />
      </div>
    </AppShell>
  );
}

function AssignmentLink({ href, label }: { href: string; label: string }) {
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
