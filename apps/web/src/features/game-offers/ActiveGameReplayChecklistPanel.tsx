import { Card, StatusPill } from "@living-textbook/ui";
import type {
  ActiveGameReplayChecklist,
  ActiveGameReplayRecord,
  ActiveGameReplayStatus,
} from "@/data/sampleActiveGameReplayChecklist";

interface ActiveGameReplayChecklistPanelProps {
  checklist: ActiveGameReplayChecklist;
}

const statusTone: Record<ActiveGameReplayStatus, "neutral" | "success" | "warning"> = {
  ready: "success",
  "needs-evidence": "warning",
  blocked: "warning",
};

export function ActiveGameReplayChecklistPanel({ checklist }: ActiveGameReplayChecklistPanelProps) {
  const readyCount = checklist.records.filter((record) => record.status === "ready").length;
  const engineCount = new Set(checklist.records.map((record) => record.engineId)).size;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Active game replay checklist</p>
          <h2 className="mt-1 text-lg font-bold">{checklist.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{checklist.summary}</p>
        </div>
        <StatusPill label={`${readyCount} route checks ready`} tone={readyCount === checklist.records.length ? "success" : "warning"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Decision rule</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{checklist.decisionRule}</p>
          </div>
          <StatusPill label={`${engineCount} parent engines`} tone="success" />
        </div>
      </section>

      <div className="mt-5 grid gap-3 lg:grid-cols-5">
        {checklist.replayLanes.map((lane) => (
          <section key={lane.laneId} className="rounded-lg border border-[var(--tenant-border)] p-3">
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lane.label}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{lane.summary}</p>
            <p className="mt-2 text-xs font-semibold leading-5 text-[var(--tenant-text)]">{lane.requiredBefore}</p>
          </section>
        ))}
      </div>

      <div className="mt-5 grid gap-3">
        {checklist.records.map((record) => (
          <ReplayRecordCard key={record.gameMode} record={record} />
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[var(--tenant-text)]">Blocked shortcuts</h3>
          <StatusPill label={String(checklist.blockedShortcuts.length)} tone="warning" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {checklist.blockedShortcuts.map((shortcut) => (
            <li key={shortcut}>{shortcut}</li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function ReplayRecordCard({ record }: { record: ActiveGameReplayRecord }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {record.gameMode} / {record.engineId}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{record.label}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {record.routePaths.map((path) => (
              <ReplayRouteLink key={path} href={path} />
            ))}
          </div>
        </div>
        <StatusPill label={record.status} tone={statusTone[record.status]} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <ReplayFact title="Fixture replay" value={record.fixtureExpectation} />
        <ReplayFact title="Event replay" value={record.eventExpectation} />
        <ReplayFact title="Audio coverage" value={record.audioExpectation} />
        <ReplayFact title="Scoring replay" value={record.scoringExpectation} />
      </div>

      <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-[var(--tenant-text)]">Failure triggers</h4>
          <StatusPill label={String(record.failureTriggers.length)} tone="warning" />
        </div>
        <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {record.failureTriggers.map((trigger) => (
            <li key={trigger}>{trigger}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function ReplayFact({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{value}</p>
    </section>
  );
}

function ReplayRouteLink({ href }: { href: string }) {
  return (
    <a
      className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-3 py-2 text-xs font-semibold text-[var(--tenant-text)] underline-offset-4 hover:underline"
      href={href}
    >
      {`Open ${href}`}
    </a>
  );
}
