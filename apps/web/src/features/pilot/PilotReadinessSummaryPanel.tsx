import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PilotReadinessSummary,
  PilotReadinessSummaryEvidence,
  PilotReadinessSummaryGate,
  PilotReadinessSummaryRestriction,
} from "@/data/samplePilotReadinessSummary";
import type { PackagePublishGateDomain, PackagePublishGateStatus } from "@/data/samplePackagePublishGate";

interface PilotReadinessSummaryPanelProps {
  summary: PilotReadinessSummary;
}

const domainLabel: Record<PackagePublishGateDomain, string> = {
  content: "Content",
  media: "Media",
  games: "Games",
  qr: "QR",
  reports: "Reports",
  policy: "Policy",
  deployment: "Deployment",
  persistence: "Persistence",
};

const statusLabel: Record<PackagePublishGateStatus, string> = {
  ready: "Ready",
  "needs-review": "Review",
  blocked: "Blocked",
};

const statusTone: Record<PackagePublishGateStatus, "neutral" | "success" | "warning"> = {
  ready: "success",
  "needs-review": "warning",
  blocked: "warning",
};

export function PilotReadinessSummaryPanel({ summary }: PilotReadinessSummaryPanelProps) {
  const pilotBlocked = summary.pilotBlockers.length > 0;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher/admin readiness view</p>
          <h2 className="mt-1 text-lg font-bold">{summary.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{summary.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={summary.noPublishActionLabel} tone="neutral" />
          <StatusPill label={pilotBlocked ? "Pilot blocked" : "Pilot ready"} tone={pilotBlocked ? "warning" : "success"} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryMetric label="Release candidate" value={summary.releaseCandidate} tone="neutral" />
        <SummaryMetric label="Demo-ready now" value={String(summary.demoReadyNow.length)} tone="success" />
        <SummaryMetric label="Pilot blockers" value={String(summary.pilotBlockers.length)} tone={pilotBlocked ? "warning" : "success"} />
        <SummaryMetric label="Missing evidence" value={String(summary.missingEvidence.length)} tone={summary.missingEvidence.length > 0 ? "warning" : "success"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{summary.sourceOfTruth}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              This panel is derived from <span className="font-semibold">{summary.sourceGateLabel}</span>. It does not approve a release, upload files, publish student routes, or override any blocking gate.
            </p>
          </div>
          <StatusPill label={summary.targetPilotRoute} tone="neutral" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ReadinessGateList
          title="Demo-ready now"
          description="Evidence that can be shown in a controlled partner walkthrough."
          emptyLabel="No controlled-demo evidence is ready."
          gates={summary.demoReadyNow}
          tone="success"
        />
        <ReadinessGateList
          title="Pilot blockers"
          description="Release-blocking items that still need review or policy decisions."
          emptyLabel="No pilot blockers remain."
          gates={summary.pilotBlockers}
          tone={pilotBlocked ? "warning" : "success"}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <EvidenceList items={summary.missingEvidence} />
        <RestrictionList items={summary.stillNotAllowed} />
      </div>
    </Card>
  );
}

function SummaryMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function ReadinessGateList({
  title,
  description,
  emptyLabel,
  gates,
  tone,
}: {
  title: string;
  description: string;
  emptyLabel: string;
  gates: PilotReadinessSummaryGate[];
  tone: "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">{description}</p>
        </div>
        <StatusPill label={String(gates.length)} tone={tone} />
      </div>
      {gates.length > 0 ? (
        <div className="mt-3 grid gap-3">
          {gates.map((gate) => (
            <article key={gate.gateId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                    {domainLabel[gate.domain]} / Owner: {gate.owner}
                  </p>
                  <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{gate.label}</h3>
                </div>
                <StatusPill label={statusLabel[gate.status]} tone={statusTone[gate.status]} />
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{gate.evidence}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
                <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {gate.nextStep}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm text-[var(--tenant-muted)]">{emptyLabel}</p>
      )}
    </section>
  );
}

function EvidenceList({ items }: { items: PilotReadinessSummaryEvidence[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Missing evidence</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Evidence required before pilot</h3>
        </div>
        <StatusPill label={String(items.length)} tone={items.length > 0 ? "warning" : "success"} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={`${item.gateId}-${item.requirement}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
            <span className="font-semibold text-[var(--tenant-text)]">{item.gateLabel}:</span> {item.requirement}
          </li>
        ))}
      </ul>
    </section>
  );
}

function RestrictionList({ items }: { items: PilotReadinessSummaryRestriction[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Still not allowed</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Promises blocked until review closes</h3>
        </div>
        <StatusPill label={String(items.length)} tone={items.length > 0 ? "warning" : "success"} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={`${item.gateId}-${item.restriction}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
            <span className="font-semibold text-[var(--tenant-text)]">{item.gateLabel}:</span> {item.restriction}
          </li>
        ))}
      </ul>
    </section>
  );
}
