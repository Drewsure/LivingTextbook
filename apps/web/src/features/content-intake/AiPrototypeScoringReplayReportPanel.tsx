import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiPrototypeScoringReplayReportCollectionWarnings,
  validateAiPrototypeScoringReplayReports,
} from "@living-textbook/content-model/src/aiPrototypeScoringReplayReport";
import type {
  AiPrototypeModeScoringReplayReport,
  AiPrototypeScoringReplayReport,
  AiPrototypeScoringReplayReportStatus,
} from "@/data/sampleAiPrototypeScoringReplayReport";

interface AiPrototypeScoringReplayReportPanelProps {
  reports: AiPrototypeScoringReplayReport[];
}

const statusTone: Record<AiPrototypeScoringReplayReportStatus, "neutral" | "warning"> = {
  "not-run": "warning",
  "review-only": "neutral",
  blocked: "warning",
};

const statusLabel: Record<AiPrototypeScoringReplayReportStatus, string> = {
  "not-run": "Not run",
  "review-only": "Review only",
  blocked: "Blocked",
};

export function AiPrototypeScoringReplayReportPanel({ reports }: AiPrototypeScoringReplayReportPanelProps) {
  const guardBlocks = validateAiPrototypeScoringReplayReports(reports);
  const guardWarnings = getAiPrototypeScoringReplayReportCollectionWarnings(reports);
  const modeReportCount = reports.reduce((total, report) => total + report.modeReports.length, 0);
  const blockedActionCount = reports.reduce((total, report) => total + report.blockedActions.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI prototype scoring replay report</p>
          <h2 className="mt-1 text-lg font-bold">Deterministic scoring replay</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This report proves whether a returned prototype can replay answer evidence through the parent scoring
            profile without owning Star Dust, mastery, rewards, package promotion, or assignments.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Scoring replay guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label={`${modeReportCount} scoring mode(s)`} tone="success" />
          <StatusPill label={`${blockedActionCount} blocked action(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <ReplayList
          title="Scoring replay guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared scoring replay guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <ReplayList
          title="Scoring replay guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared scoring replay guard warnings."]}
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
                <StatusPill label="No score authority" tone="warning" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <PolicyCard title="Scoring profile policy" value={report.scoringProfilePolicy} />
              <PolicyCard title="Mastery policy" value={report.masteryPolicy} />
              <PolicyCard title="Reward boundary policy" value={report.rewardBoundaryPolicy} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-6">
              <ReplayList title="Source records" items={report.sourceRecords} />
              <ReplayList title="Purpose" items={report.scoringPurpose} />
              <ReplayList title="Score replay checks" items={report.scoreReplayChecks} />
              <ReplayList title="Mastery replay checks" items={report.masteryReplayChecks} />
              <ReplayList title="Reward boundary checks" items={report.rewardBoundaryChecks} />
              <ReplayList title="Blocked actions" items={report.blockedActions} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Mode scoring replay reports</h4>
                <StatusPill label={String(report.modeReports.length)} tone="success" />
              </div>
              <div className="mt-3 grid gap-3">
                {report.modeReports.map((modeReport) => (
                  <ModeScoringReplayCard key={`${report.reportId}-${modeReport.modeId}`} report={modeReport} />
                ))}
              </div>
            </section>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ModeScoringReplayCard({ report }: { report: AiPrototypeModeScoringReplayReport }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{report.modeId}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{report.parentEngine}</h5>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{report.scoringHarness}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Replay only" tone="neutral" />
          <StatusPill label="No reward write" tone="warning" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        <ReplayList title="Score inputs" items={report.scoreInputs} />
        <ReplayList title="Scoring steps" items={report.scoringSteps} />
        <ReplayList title="Mastery checks" items={report.masteryChecks} />
        <ReplayList title="Reward boundary checks" items={report.rewardBoundaryChecks} />
        <ReplayList title="Failure triggers" items={report.failureTriggers} tone="warning" />
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
