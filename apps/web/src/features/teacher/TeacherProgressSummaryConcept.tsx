import { Card, StatusPill } from "@living-textbook/ui";
import type { TeacherProgressSummaryConcept as TeacherProgressSummaryConceptData } from "@/data/sampleMultimediaPackage";

interface TeacherProgressSummaryConceptProps {
  summary: TeacherProgressSummaryConceptData;
}

export function TeacherProgressSummaryConcept({ summary }: TeacherProgressSummaryConceptProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher report concept</p>
          <h2 className="mt-1 text-lg font-bold">Game and media progress</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
            This concept keeps language-game mastery and multimedia engagement visible as related but separate report streams.
          </p>
        </div>
        <StatusPill label="Report-ready shape" tone="success" />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <Metric label="Students" value={String(summary.studentCount)} />
        <Metric label="Flashcards complete" value={String(summary.flashcardCompletions)} />
        <Metric label="Memory Match starts" value={String(summary.memoryMatchStarts)} />
        <Metric label="Media starts" value={String(summary.mediaStarts)} />
        <Metric label="Media complete" value={String(summary.mediaCompletions)} />
        <Metric label="Avg. Star Dust" value={String(summary.averageStarDust)} />
      </dl>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <h3 className="text-sm font-bold">Report streams</h3>
        <ul className="mt-3 grid gap-2 text-sm text-[var(--tenant-muted)]">
          {summary.teacherReportStreams.map((stream) => (
            <li key={stream} className="flex items-center justify-between gap-3 border-b border-[var(--tenant-border)] pb-2 last:border-b-0 last:pb-0">
              <span>{stream}</span>
              <span className="text-xs font-semibold text-[var(--tenant-text)]">Tracked</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <h3 className="text-sm font-bold">Sample event stream</h3>
        <div className="mt-3 grid gap-2 text-sm text-[var(--tenant-muted)]">
          {summary.sampleEvents.map((event, index) => (
            <div key={`${event.type}-${event.occurredAt}-${index}`} className="grid gap-1 border-b border-[var(--tenant-border)] pb-2 last:border-b-0 last:pb-0">
              <p className="font-semibold text-[var(--tenant-text)]">{event.type}</p>
              <p>{event.gameMode} / {event.studentSessionId}</p>
            </div>
          ))}
        </div>
      </section>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
