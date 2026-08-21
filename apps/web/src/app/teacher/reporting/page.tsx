import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import {
  sampleClassRosterErrors,
  sampleClassRosterPlans,
  sampleClassRosterWarnings,
} from "@/data/sampleClassRosterPlans";
import {
  resolveSampleTeacherSessionMonitorContext,
  type TeacherSessionMonitorContext,
} from "@/data/sampleTeacherSessionMonitor";
import { ClassRosterReadinessPanel } from "@/features/teacher/ClassRosterReadinessPanel";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";

const reportContexts = [
  resolveSampleTeacherSessionMonitorContext("demo-unit-1"),
  resolveSampleTeacherSessionMonitorContext("partner-demo-unit-1"),
];

const reportingLinks = [
  { href: "/teacher/intake", label: "Foundation intake" },
  { href: "/teacher/session-settings", label: "Session settings" },
  { href: "/teacher/sessions/demo-unit-1/report-package", label: "MiniStar report package" },
  { href: "/teacher/sessions/partner-demo-unit-1/report-package", label: "Partner report package" },
];

export default function TeacherReportingReadinessPage() {
  return (
    <AppShell tenant={samplePublisherTenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher reporting readiness workbench</p>
              <h2 className="mt-1 text-2xl font-bold">Coded learner slots, report packages, and export policy</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
                This focused route gathers the reporting boundary before production accounts, persistence, or export
                controls exist. It shows what teachers may review, what must stay support-only, and why report export
                remains blocked until school policy, retention, access, event storage, and format rules are accepted.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill label="Review-only" tone="warning" />
              <StatusPill label="No report export" tone="warning" />
              <StatusPill label="No real learner data" tone="warning" />
              <StatusPill label="No raw learner audio" tone="warning" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {reportingLinks.map((link) => (
              <ReportingLink key={link.href} href={link.href} label={link.label} />
            ))}
          </div>

          <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing gate</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              Teacher-visible summaries can show target-language progress, media engagement, Training Academy recovery,
              and speech-practice readiness. Support-language taps, route guidance, media playback, background media,
              raw audio, transcripts, ungated AI Tutor state, and private identifiers cannot become mastery, Star Dust,
              unlock evidence, or exportable core data.
            </p>
          </section>
        </Card>

        <div className="grid gap-5">
          {reportContexts.map((context) => (
            <ReportBoundaryCard key={context.launchSession.launchCode} context={context} />
          ))}
        </div>

        <SensitiveDataBoundaryCard contexts={reportContexts} />

        <ClassRosterReadinessPanel
          plans={sampleClassRosterPlans}
          errors={sampleClassRosterErrors}
          warnings={sampleClassRosterWarnings}
        />
      </div>
    </AppShell>
  );
}

function ReportBoundaryCard({ context }: { context: TeacherSessionMonitorContext }) {
  const boundary = context.reportPackageBoundary;
  const exportPlan = context.reportExportPlan;
  const eventGate = context.eventAcceptanceGate;
  const blockedEvents = eventGate.items.filter((item) => item.status === "blocked").length;
  const warningEvents = eventGate.items.filter((item) => item.status === "warning").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Report package boundary</p>
          <h3 className="mt-1 text-lg font-bold">
            {context.tenant.displayName}: {context.launchSession.launchCode}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{boundary.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={boundary.status} tone="warning" />
          <StatusPill label={exportPlan.readiness} tone="warning" />
          <StatusPill label="Export blocked" tone="warning" />
        </div>
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Export decision</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-[var(--tenant-text)]">{boundary.decision}</p>
      </section>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {boundary.metrics.map((metric) => (
          <ReportMetric key={metric.label} label={metric.label} value={metric.value} note={metric.note} />
        ))}
        <ReportMetric label="Allowed formats" value={exportPlan.allowedFormats.join(", ")} note="Preview only." />
        <ReportMetric label="Retention" value={exportPlan.retentionPolicy} note="Demo policy only." />
        <ReportMetric label="Event gate blocks" value={String(blockedEvents)} note={`${warningEvents} warning item(s).`} />
        <ReportMetric label="Events in preview" value={String(context.events.length)} note="Sample events only." />
      </dl>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <ReportList title="Included evidence" items={boundary.includedEvidence} tone="success" />
        <ReportList title="Support-only signals" items={boundary.supportOnlySignals} tone="neutral" />
        <ReportList title="Excluded sensitive fields" items={boundary.excludedSensitiveFields} tone="warning" />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <ReportList title="Included scopes" items={exportPlan.includedScopes} tone="success" />
        <ReportList
          title="Required before export"
          items={boundary.requiredBeforeExport}
          tone="warning"
        />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[var(--tenant-text)]">Event acceptance gate</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{eventGate.summary}</p>
          </div>
          <StatusPill label={eventGate.status} tone="warning" />
        </div>
        <p className="mt-3 text-sm font-semibold text-[var(--tenant-text)]">{eventGate.decision}</p>
      </section>
    </Card>
  );
}

function SensitiveDataBoundaryCard({ contexts }: { contexts: TeacherSessionMonitorContext[] }) {
  const totalEvents = contexts.reduce((total, context) => total + context.events.length, 0);
  const totalSupportSignals = contexts.reduce(
    (total, context) => total + context.reportPackageBoundary.supportOnlySignals.length,
    0,
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher-visible summary</p>
          <h3 className="mt-1 text-lg font-bold">One report stream, separate evidence lanes</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            The report stream can summarize target-language learning, media engagement, recovery, and speech-practice
            readiness while keeping support-only and sensitive data in separate lanes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`${totalEvents} sample events`} tone="success" />
          <StatusPill label={`${totalSupportSignals} support-only signals`} tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <ReportList
          title="Reportable learning evidence"
          items={[
            "Target-language entry practice",
            "Answer results",
            "Game completion",
            "Mastery updates",
            "Deterministic Star Dust",
          ]}
          tone="success"
        />
        <ReportList
          title="Support-only report context"
          items={[
            "Support-language taps remain support-only",
            "Media and playlist engagement remain support-only",
            "Route guidance listens remain support-only",
            "Background media cannot unlock progress",
            "settings_context is report-only",
          ]}
          tone="neutral"
        />
        <ReportList
          title="Blocked from core export"
          items={[
            "Raw learner audio",
            "Learner transcripts",
            "Ungated AI Tutor state",
            "Private identifiers",
            "Unreviewed teacher notes",
          ]}
          tone="warning"
        />
      </div>
    </Card>
  );
}

function ReportingLink({ href, label }: { href: string; label: string }) {
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

function ReportMetric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
      <dd className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">{note}</dd>
    </div>
  );
}

function ReportList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
