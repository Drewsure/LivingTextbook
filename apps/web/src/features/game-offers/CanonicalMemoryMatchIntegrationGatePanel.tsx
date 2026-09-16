import { Card, StatusPill } from "@living-textbook/ui";
import type {
  CanonicalMemoryMatchEvidenceLane,
  CanonicalMemoryMatchIntegrationGate,
  MemoryMatchGateEvidenceStatus,
} from "@/data/sampleCanonicalMemoryMatchIntegrationGate";

const evidenceTone: Record<MemoryMatchGateEvidenceStatus, "neutral" | "warning" | "success"> = {
  reviewed: "success",
  "pending-review": "neutral",
  blocked: "warning",
};

const evidenceLabel: Record<MemoryMatchGateEvidenceStatus, string> = {
  reviewed: "Reviewed",
  "pending-review": "Pending review",
  blocked: "Blocked",
};

export function CanonicalMemoryMatchIntegrationGatePanel({
  gate,
}: {
  gate: CanonicalMemoryMatchIntegrationGate;
}) {
  const reviewedCount = gate.evidenceLanes.filter((lane) => lane.status === "reviewed").length;
  const blockedCount = gate.evidenceLanes.filter((lane) => lane.status === "blocked").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Canonical game integration gate</p>
          <h2 className="mt-1 text-lg font-bold">Memory Match: reference route versus frozen candidate</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={gate.status === "blocked" ? "Promotion blocked" : "Review only"} tone="warning" />
          <StatusPill label={`${reviewedCount}/${gate.evidenceLanes.length} lanes reviewed`} tone="neutral" />
          <StatusPill label={`${blockedCount} blocker(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Fact label="Tenant / unit" value={`${gate.tenantId} / ${gate.unitKey}`} />
        <Fact label="Parent engine" value={gate.parentEngine} />
        <Fact label="Scoring authority" value={gate.canonicalSurface.scoringProfile} />
        <Fact label="Frozen source" value={`${gate.frozenCandidate.repository} / ${gate.frozenCandidate.sourceFiles} files`} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Canonical platform surface</p>
          <p className="mt-2 text-sm font-bold text-[var(--tenant-text)]">{gate.canonicalSurface.routeFlow}</p>
          <p className="mt-2 break-words text-xs leading-5 text-[var(--tenant-muted)]">{gate.canonicalSurface.component}</p>
          <p className="mt-1 break-words text-xs leading-5 text-[var(--tenant-muted)]">{gate.canonicalSurface.route}</p>
          <StatusPill label="Active reference surface" tone="success" />
        </section>
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Frozen external candidate</p>
          <p className="mt-2 text-sm font-bold text-[var(--tenant-text)]">{gate.frozenCandidate.repository}</p>
          <p className="mt-2 break-words text-xs leading-5 text-[var(--tenant-muted)]">Snapshot: {gate.frozenCandidate.snapshotId}</p>
          <p className="mt-1 break-all text-xs leading-5 text-[var(--tenant-muted)]">Commit: {gate.frozenCandidate.commitSha}</p>
          <StatusPill label="Evidence only; not promoted" tone="warning" />
        </section>
      </div>

      <section className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Evidence lanes</p>
            <h3 className="mt-1 text-base font-bold">What must be accepted before any wrapper proposal</h3>
          </div>
          <StatusPill label="No live handoff" tone="warning" />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {gate.evidenceLanes.map((lane) => (
            <EvidenceLane key={lane.laneId} lane={lane} />
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <List title="Blocked actions" items={gate.blockedActions} tone="warning" />
        <List title="Next required records" items={gate.nextRequiredRecords} tone="neutral" />
      </div>
    </Card>
  );
}

function EvidenceLane({ lane }: { lane: CanonicalMemoryMatchEvidenceLane }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lane.sourceRecord}</p>
          <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h4>
        </div>
        <StatusPill label={evidenceLabel[lane.status]} tone={evidenceTone[lane.status]} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{lane.evidence}</p>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}

function List({ title, items, tone }: { title: string; items: string[]; tone: "neutral" | "warning" }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
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
