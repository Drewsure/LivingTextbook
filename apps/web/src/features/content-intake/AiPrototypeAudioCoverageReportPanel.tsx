import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiPrototypeAudioCoverageReportCollectionWarnings,
  validateAiPrototypeAudioCoverageReports,
} from "@living-textbook/content-model/src/aiPrototypeAudioCoverageReport";
import type {
  AiPrototypeAudioCoverageReport,
  AiPrototypeAudioCoverageReportStatus,
  AiPrototypeModeAudioCoverageReport,
} from "@/data/sampleAiPrototypeAudioCoverageReport";

interface AiPrototypeAudioCoverageReportPanelProps {
  reports: AiPrototypeAudioCoverageReport[];
}

const statusTone: Record<AiPrototypeAudioCoverageReportStatus, "neutral" | "warning"> = {
  "not-run": "warning",
  "review-only": "neutral",
  blocked: "warning",
};

const statusLabel: Record<AiPrototypeAudioCoverageReportStatus, string> = {
  "not-run": "Not run",
  "review-only": "Review only",
  blocked: "Blocked",
};

export function AiPrototypeAudioCoverageReportPanel({ reports }: AiPrototypeAudioCoverageReportPanelProps) {
  const guardBlocks = validateAiPrototypeAudioCoverageReports(reports);
  const guardWarnings = getAiPrototypeAudioCoverageReportCollectionWarnings(reports);
  const modeReportCount = reports.reduce((total, report) => total + report.modeReports.length, 0);
  const blockedActionCount = reports.reduce((total, report) => total + report.blockedActions.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI prototype audio coverage report</p>
          <h2 className="mt-1 text-lg font-bold">Tap-to-speak coverage</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This report proves whether a returned prototype covers every learner-facing term, sentence, instruction,
            feedback line, and critical control with target-language audio before integration.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Audio coverage guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label={`${modeReportCount} audio mode(s)`} tone="success" />
          <StatusPill label={`${blockedActionCount} blocked action(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <AudioList
          title="Audio coverage guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared audio coverage guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <AudioList
          title="Audio coverage guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared audio coverage guard warnings."]}
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
                <StatusPill label="No generated voice call" tone="warning" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <PolicyCard title="Target language" value={report.targetLanguage} />
              <PolicyCard title="Assist language boundary" value={report.assistLanguagePolicy} />
              <PolicyCard title="Learning audio priority" value={report.learningAudioPriorityRule} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-5">
              <AudioList title="Source records" items={report.sourceRecords} />
              <AudioList title="Coverage purpose" items={report.coveragePurpose} />
              <AudioList title="Required cue families" items={report.requiredCueFamilies} />
              <AudioList title="Coverage checks" items={report.coverageChecks} />
              <AudioList title="Blocked actions" items={report.blockedActions} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Mode audio coverage reports</h4>
                <StatusPill label={String(report.modeReports.length)} tone="success" />
              </div>
              <div className="mt-3 grid gap-3">
                {report.modeReports.map((modeReport) => (
                  <ModeAudioCoverageCard key={`${report.reportId}-${modeReport.modeId}`} report={modeReport} />
                ))}
              </div>
            </section>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ModeAudioCoverageCard({ report }: { report: AiPrototypeModeAudioCoverageReport }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{report.modeId}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{report.parentEngine}</h5>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{report.audioHarness}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Audio replay" tone="neutral" />
          <StatusPill label="No audio authority" tone="warning" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        <AudioList title="Required cue kinds" items={report.requiredCueKinds} />
        <AudioList title="Target-language checks" items={report.targetLanguageAudioChecks} />
        <AudioList title="Control audio checks" items={report.controlAudioChecks} />
        <AudioList title="Support-language rules" items={report.supportLanguageRules} />
        <AudioList title="Failure triggers" items={report.failureTriggers} tone="warning" />
      </div>

      <div className="mt-3">
        <AudioList title="Replay evidence" items={report.replayEvidence} />
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

function AudioList({
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
