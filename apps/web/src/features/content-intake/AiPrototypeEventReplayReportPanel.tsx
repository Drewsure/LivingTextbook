import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiPrototypeEventReplayReportCollectionWarnings,
  validateAiPrototypeEventReplayReports,
} from "@living-textbook/content-model/src/aiPrototypeEventReplayReport";
import type {
  AiPrototypeEventReplayReport,
  AiPrototypeEventReplayReportStatus,
  AiPrototypeModeEventReplayReport,
} from "@/data/sampleAiPrototypeEventReplayReport";

interface AiPrototypeEventReplayReportPanelProps {
  reports: AiPrototypeEventReplayReport[];
}

const statusTone: Record<AiPrototypeEventReplayReportStatus, "neutral" | "warning"> = {
  "not-run": "warning",
  "review-only": "neutral",
  blocked: "warning",
};

const statusLabel: Record<AiPrototypeEventReplayReportStatus, string> = {
  "not-run": "Not run",
  "review-only": "Review only",
  blocked: "Blocked",
};

export function AiPrototypeEventReplayReportPanel({ reports }: AiPrototypeEventReplayReportPanelProps) {
  const guardBlocks = validateAiPrototypeEventReplayReports(reports);
  const guardWarnings = getAiPrototypeEventReplayReportCollectionWarnings(reports);
  const modeReportCount = reports.reduce((total, report) => total + report.modeReports.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI prototype event replay report</p>
          <h2 className="mt-1 text-lg font-bold">Standard event replay</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This report proves whether a returned prototype emits the LivingTextbook event contract without creating
            hidden progress, score, reward, route, report, playlist, local bundle, or assignment side effects.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Event replay guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label={`${modeReportCount} replay mode(s)`} tone="success" />
          <StatusPill label="No hidden progress stream" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <EventList
          title="Event replay guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared event replay guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <EventList
          title="Event replay guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared event replay guard warnings."]}
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
              <EventList title="Source records" items={report.sourceRecords} />
              <EventList title="Replay purpose" items={report.replayPurpose} />
              <EventList title="Standard events" items={report.standardEventCoverage} />
              <EventList title="Acceptance checks" items={report.eventAcceptanceChecks} />
              <EventList title="Blocked actions" items={report.blockedActions} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Mode event replay reports</h4>
                <StatusPill label={String(report.modeReports.length)} tone="success" />
              </div>
              <div className="mt-3 grid gap-3">
                {report.modeReports.map((modeReport) => (
                  <ModeEventReplayCard key={`${report.reportId}-${modeReport.modeId}`} report={modeReport} />
                ))}
              </div>
            </section>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ModeEventReplayCard({ report }: { report: AiPrototypeModeEventReplayReport }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{report.modeId}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{report.parentEngine}</h5>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{report.replayHarness}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Event replay" tone="neutral" />
          <StatusPill label="No write authority" tone="warning" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <EventList title="Required order" items={report.requiredEventOrder} />
        <EventList title="Allowed payload fields" items={report.allowedPayloadFields} />
        <EventList title="Accepted effects" items={report.acceptedProgressEffects} />
        <EventList title="Failure triggers" items={report.failureTriggers} tone="warning" />
      </div>
    </article>
  );
}

function EventList({
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
