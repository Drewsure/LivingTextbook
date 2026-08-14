import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiPrototypeMobileAccessibilityReportCollectionWarnings,
  validateAiPrototypeMobileAccessibilityReports,
} from "@living-textbook/content-model/src/aiPrototypeMobileAccessibilityReport";
import type {
  AiPrototypeMobileAccessibilityReport,
  AiPrototypeMobileAccessibilityReportStatus,
  AiPrototypeModeMobileAccessibilityReport,
} from "@/data/sampleAiPrototypeMobileAccessibilityReport";

interface AiPrototypeMobileAccessibilityReportPanelProps {
  reports: AiPrototypeMobileAccessibilityReport[];
}

const statusTone: Record<AiPrototypeMobileAccessibilityReportStatus, "neutral" | "warning"> = {
  "not-run": "warning",
  "review-only": "neutral",
  blocked: "warning",
};

const statusLabel: Record<AiPrototypeMobileAccessibilityReportStatus, string> = {
  "not-run": "Not run",
  "review-only": "Review only",
  blocked: "Blocked",
};

export function AiPrototypeMobileAccessibilityReportPanel({
  reports,
}: AiPrototypeMobileAccessibilityReportPanelProps) {
  const guardBlocks = validateAiPrototypeMobileAccessibilityReports(reports);
  const guardWarnings = getAiPrototypeMobileAccessibilityReportCollectionWarnings(reports);
  const modeReportCount = reports.reduce((total, report) => total + report.modeReports.length, 0);
  const blockedActionCount = reports.reduce((total, report) => total + report.blockedActions.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI prototype mobile accessibility report
          </p>
          <h2 className="mt-1 text-lg font-bold">Mobile and accessibility inspection</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This report proves whether a returned prototype is safe for phone-first QR classrooms before any wrapper,
            Phaser surface, route, assignment, or student-facing preview is considered.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Mobile accessibility guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label={`${modeReportCount} mode inspection(s)`} tone="success" />
          <StatusPill label={`${blockedActionCount} blocked action(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <ReviewList
          title="Mobile accessibility guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared mobile accessibility guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <ReviewList
          title="Mobile accessibility guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared mobile accessibility guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="mt-5 grid gap-4">
        {reports.map((report) => (
          <article key={report.reportId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{report.integrationPlanId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{report.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{report.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={statusLabel[report.status]} tone={statusTone[report.status]} />
                <StatusPill label="Student preview blocked" tone="warning" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <PolicyCard title="Viewport policy" value={report.viewportPolicy} />
              <PolicyCard title="Learner controls" value={report.learnerControlPolicy} />
              <PolicyCard title="Readability policy" value={report.readabilityPolicy} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-6">
              <ReviewList title="Source records" items={report.sourceRecords} />
              <ReviewList title="Purpose" items={report.accessibilityPurpose} />
              <ReviewList title="Viewport checks" items={report.viewportChecks} />
              <ReviewList title="Touch target checks" items={report.touchTargetChecks} />
              <ReviewList title="Keyboard and focus checks" items={report.keyboardFocusChecks} />
              <ReviewList title="Blocked actions" items={report.blockedActions} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">
                  Mode mobile/accessibility reports
                </h4>
                <StatusPill label={String(report.modeReports.length)} tone="success" />
              </div>
              <div className="mt-3 grid gap-3">
                {report.modeReports.map((modeReport) => (
                  <ModeMobileAccessibilityCard
                    key={`${report.reportId}-${modeReport.modeId}`}
                    report={modeReport}
                  />
                ))}
              </div>
            </section>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ModeMobileAccessibilityCard({ report }: { report: AiPrototypeModeMobileAccessibilityReport }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{report.modeId}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{report.parentEngine}</h5>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{report.accessibilityHarness}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Mobile evidence" tone="neutral" />
          <StatusPill label="No hidden controls" tone="warning" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        <ReviewList title="Viewport evidence" items={report.viewportEvidence} />
        <ReviewList title="Touch and controls" items={report.touchAndControlChecks} />
        <ReviewList title="Keyboard and focus" items={report.keyboardAndFocusChecks} />
        <ReviewList title="Readable text checks" items={report.readableTextChecks} />
        <ReviewList title="Failure triggers" items={report.failureTriggers} tone="warning" />
      </div>
    </article>
  );
}

function PolicyCard({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function ReviewList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
