import { Card, StatusPill } from "@living-textbook/ui";
import type {
  EvidenceExportFormat,
  EvidenceExportReadinessPlan,
  EvidenceExportReadinessStatus,
  EvidenceExportRecipientLane,
} from "@/data/sampleEvidenceExportReadiness";

interface EvidenceExportReadinessPanelProps {
  plan: EvidenceExportReadinessPlan;
}

const statusTone: Record<EvidenceExportReadinessStatus, "neutral" | "warning"> = {
  "blocked-preview": "warning",
  planned: "neutral",
};

export function EvidenceExportReadinessPanel({ plan }: EvidenceExportReadinessPanelProps) {
  const blockedFormats = plan.formats.filter((format) => format.status === "blocked-preview").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Evidence export readiness</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={plan.exportStatus} tone="warning" />
          <StatusPill label={plan.signatureStatus} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Formats" value={String(plan.formats.length)} tone="neutral" />
        <Metric label="Blocked formats" value={String(blockedFormats)} tone="warning" />
        <Metric label="Recipients" value={String(plan.recipientLanes.length)} tone="neutral" />
        <Metric label="Storage" value={plan.storageStatus} tone="warning" />
      </div>

      <a
        href={plan.sourceHandoffRoute}
        className="mt-5 block break-words text-sm font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
      >
        Source handoff preview: {plan.sourceHandoffRoute}
      </a>

      <div className="mt-5 grid gap-4">
        {plan.formats.map((format) => (
          <FormatCard key={format.formatId} format={format} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Recipient lanes</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Who can receive an evidence packet later</h3>
            </div>
            <StatusPill label="Send blocked" tone="warning" />
          </div>
          <div className="mt-3 grid gap-3">
            {plan.recipientLanes.map((lane) => (
              <RecipientLaneCard key={lane.laneId} lane={lane} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Identity, signature, and policy gates</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Required before export controls exist</h3>
            </div>
            <StatusPill label="Policy first" tone="warning" />
          </div>
          <ListBlock title="Identity and signature gates" items={plan.identityAndSignatureGates} tone="warning" />
          <ListBlock title="Retention and policy gates" items={plan.retentionAndPolicyGates} tone="warning" />
          <ListBlock title="Blocked actions" items={plan.blockedActions} tone="warning" />
        </section>
      </div>
    </Card>
  );
}

function FormatCard({ format }: { format: EvidenceExportFormat }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{format.formatId}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{format.label}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{format.purpose}</p>
        </div>
        <StatusPill label={format.status} tone={statusTone[format.status]} />
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <ListBlock title="Required before use" items={format.requiredBeforeUse} tone="neutral" />
        <ListBlock title="Not allowed yet" items={format.notAllowedYet} tone="warning" />
      </div>
    </article>
  );
}

function RecipientLaneCard({ lane }: { lane: EvidenceExportRecipientLane }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-sm font-bold text-[var(--tenant-text)]">{lane.label}</p>
      <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lane.recipientRole}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{lane.responsibility}</p>
      <ListBlock title="Required before send" items={lane.requiredBeforeSend} tone="warning" />
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
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`}>{item}</li>
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
