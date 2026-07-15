import { Card, StatusPill } from "@living-textbook/ui";
import type {
  EvidenceStorageAdapterCandidate,
  EvidenceStorageAdapterCostPosture,
  EvidenceStorageAdapterSelectionGate,
  EvidenceStorageAdapterSelectionStatus,
} from "@/data/sampleEvidenceStorageAdapterSelectionGate";

interface EvidenceStorageAdapterSelectionGatePanelProps {
  gate: EvidenceStorageAdapterSelectionGate;
}

const statusTone: Record<EvidenceStorageAdapterSelectionStatus, "neutral" | "success" | "warning"> = {
  "recommended-first-pilot": "success",
  "blocked-preview": "warning",
  deferred: "neutral",
};

const costTone: Record<EvidenceStorageAdapterCostPosture, "neutral" | "success" | "warning"> = {
  controlled: "success",
  higher: "warning",
  variable: "neutral",
};

export function EvidenceStorageAdapterSelectionGatePanel({ gate }: EvidenceStorageAdapterSelectionGatePanelProps) {
  const recommendedCount = gate.candidates.filter((candidate) => candidate.status === "recommended-first-pilot").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Evidence storage adapter selection gate</p>
          <h2 className="mt-1 text-lg font-bold">{gate.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
        </div>
        <StatusPill label={gate.selectionStatus} tone="warning" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Candidates" value={String(gate.candidates.length)} tone="neutral" />
        <Metric label="Recommended" value={String(recommendedCount)} tone="success" />
        <Metric label="Vendor rules" value={String(gate.vendorNeutralRequirements.length)} tone="neutral" />
        <Metric label="Blocked actions" value={String(gate.blockedActions.length)} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">First pilot recommendation</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{gate.firstPilotRecommendation}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{gate.recommendationReason}</p>
          </div>
          <StatusPill label="Decision only" tone="warning" />
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Adapter candidates</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Hosted, local, and hybrid storage choices</h3>
          </div>
          <StatusPill label="No vendor selected" tone="warning" />
        </div>
        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          {gate.candidates.map((candidate) => (
            <CandidateCard key={candidate.adapterId} candidate={candidate} />
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <ListBlock title="Vendor-neutral requirements" items={gate.vendorNeutralRequirements} tone="neutral" />
        <ListBlock title="Selection rules" items={gate.selectionRules} tone="success" />
        <ListBlock title="Blocked actions" items={gate.blockedActions} tone="warning" />
      </div>
    </Card>
  );
}

function CandidateCard({ candidate }: { candidate: EvidenceStorageAdapterCandidate }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {candidate.deploymentFit} / {candidate.adapterId}
          </p>
          <h4 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{candidate.label}</h4>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{candidate.suitableFor}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={candidate.status} tone={statusTone[candidate.status]} />
          <StatusPill label={candidate.costPosture} tone={costTone[candidate.costPosture]} />
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        <ListBlock title="Must prove" items={candidate.mustProve} tone="neutral" />
        <ListBlock title="Blocked until policy" items={candidate.blockedUntilPolicy} tone="warning" />
        <ListBlock title="Not allowed yet" items={candidate.notAllowedYet} tone="warning" />
      </div>
    </article>
  );
}

function ListBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
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

function Metric({
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
        <StatusPill label={tone === "warning" ? "Gate" : tone === "success" ? "Pilot" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
