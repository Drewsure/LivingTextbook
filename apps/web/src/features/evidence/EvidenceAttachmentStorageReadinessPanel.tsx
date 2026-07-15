import { Card, StatusPill } from "@living-textbook/ui";
import type {
  EvidenceAttachmentStorageCandidate,
  EvidenceAttachmentStorageReadinessPlan,
  EvidenceAttachmentStorageStatus,
} from "@/data/sampleEvidenceAttachmentStorageReadiness";

interface EvidenceAttachmentStorageReadinessPanelProps {
  plan: EvidenceAttachmentStorageReadinessPlan;
}

const statusTone: Record<EvidenceAttachmentStorageStatus, "neutral" | "warning"> = {
  "blocked-preview": "warning",
  planned: "neutral",
};

export function EvidenceAttachmentStorageReadinessPanel({ plan }: EvidenceAttachmentStorageReadinessPanelProps) {
  const blockedCandidates = plan.candidates.filter((candidate) => candidate.status === "blocked-preview").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Evidence attachment storage readiness</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={plan.storageStatus} tone="warning" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Storage candidates" value={String(plan.candidates.length)} tone="neutral" />
        <Metric label="Blocked candidates" value={String(blockedCandidates)} tone="warning" />
        <Metric label="Required metadata" value={String(plan.requiredMetadata.length)} tone="neutral" />
        <Metric label="Policy gates" value={String(plan.storagePolicyGates.length)} tone="warning" />
      </div>

      <a
        href={plan.sourceExportGate}
        className="mt-5 block break-words text-sm font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
      >
        Source export gate: {plan.sourceExportGate}
      </a>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Storage candidates</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Where reviewed attachments may live later</h3>
          </div>
          <StatusPill label="Storage blocked" tone="warning" />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {plan.candidates.map((candidate) => (
            <CandidateCard key={candidate.candidateId} candidate={candidate} />
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <ListBlock title="Required attachment metadata" items={plan.requiredMetadata} tone="neutral" />
        <ListBlock title="Storage policy gates" items={plan.storagePolicyGates} tone="warning" />
        <ListBlock title="Blocked storage actions" items={plan.blockedStorageActions} tone="warning" />
      </div>
    </Card>
  );
}

function CandidateCard({ candidate }: { candidate: EvidenceAttachmentStorageCandidate }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {candidate.deploymentFit} / {candidate.candidateId}
          </p>
          <h4 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{candidate.label}</h4>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{candidate.purpose}</p>
        </div>
        <StatusPill label={candidate.status} tone={statusTone[candidate.status]} />
      </div>
      <ListBlock title="Required before use" items={candidate.requiredBeforeUse} tone="neutral" />
      <ListBlock title="Blocked actions" items={candidate.blockedActions} tone="warning" />
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
  tone: "neutral" | "warning";
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
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "warning" ? "Gate" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
