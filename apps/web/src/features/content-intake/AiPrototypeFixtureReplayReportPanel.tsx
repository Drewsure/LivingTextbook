import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiPrototypeFixtureReplayReportCollectionWarnings,
  validateAiPrototypeFixtureReplayReports,
} from "@living-textbook/content-model/src/aiPrototypeFixtureReplayReport";
import type {
  AiPrototypeFixtureReplayReport,
  AiPrototypeFixtureReplayReportStatus,
  AiPrototypeModeFixtureReplayReport,
} from "@/data/sampleAiPrototypeFixtureReplayReport";

interface AiPrototypeFixtureReplayReportPanelProps {
  reports: AiPrototypeFixtureReplayReport[];
}

const statusTone: Record<AiPrototypeFixtureReplayReportStatus, "neutral" | "warning"> = {
  "not-run": "warning",
  "review-only": "neutral",
  blocked: "warning",
};

const statusLabel: Record<AiPrototypeFixtureReplayReportStatus, string> = {
  "not-run": "Not run",
  "review-only": "Review only",
  blocked: "Blocked",
};

export function AiPrototypeFixtureReplayReportPanel({ reports }: AiPrototypeFixtureReplayReportPanelProps) {
  const guardBlocks = validateAiPrototypeFixtureReplayReports(reports);
  const guardWarnings = getAiPrototypeFixtureReplayReportCollectionWarnings(reports);
  const modeReportCount = reports.reduce((total, report) => total + report.modeReports.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI prototype fixture replay report</p>
          <h2 className="mt-1 text-lg font-bold">Reviewed JSON fixture replay</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This report proves whether a returned prototype can load reviewed unit JSON through a wrapper instead of
            relying on hard-coded words, sentences, tenant visuals, audio, scoring, rewards, or route assumptions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Fixture replay guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label={`${modeReportCount} replay mode(s)`} tone="success" />
          <StatusPill label="No hard-coded unit text" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <ReplayList
          title="Fixture replay guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared fixture replay guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <ReplayList
          title="Fixture replay guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared fixture replay guard warnings."]}
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
                <StatusPill label="Student use blocked" tone="warning" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-5">
              <ReplayList title="Source records" items={report.sourceRecords} />
              <ReplayList title="Replay purpose" items={report.replayPurpose} />
              <ReplayList title="Fixture coverage" items={report.fixtureCoverage} />
              <ReplayList title="Acceptance checks" items={report.replayAcceptanceChecks} />
              <ReplayList title="Blocked actions" items={report.blockedActions} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Mode fixture replay reports</h4>
                <StatusPill label={String(report.modeReports.length)} tone="success" />
              </div>
              <div className="mt-3 grid gap-3">
                {report.modeReports.map((modeReport) => (
                  <ModeFixtureReplayCard key={`${report.reportId}-${modeReport.modeId}`} report={modeReport} />
                ))}
              </div>
            </section>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ModeFixtureReplayCard({ report }: { report: AiPrototypeModeFixtureReplayReport }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{report.modeId}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{report.fixtureName}</h5>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{report.replaySurface}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={report.parentEngine} tone="success" />
          <StatusPill label="Fixture replay" tone="neutral" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <ReplayList title="Input assertions" items={report.inputAssertions} />
        <ReplayList title="Output assertions" items={report.outputAssertions} />
        <ReplayList title="Replay evidence" items={report.replayEvidence} />
        <ReplayList title="Failure triggers" items={report.failureTriggers} tone="warning" />
      </div>
    </article>
  );
}

function ReplayList({
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
