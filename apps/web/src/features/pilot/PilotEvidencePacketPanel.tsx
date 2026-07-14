import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PilotEvidencePacket,
  PilotEvidencePacketItem,
  PilotEvidencePacketStatus,
} from "@/data/samplePilotEvidencePacket";

interface PilotEvidencePacketPanelProps {
  packet: PilotEvidencePacket;
}

const statusLabel: Record<PilotEvidencePacketStatus, string> = {
  attached: "Attached",
  missing: "Missing",
  blocked: "Blocked",
};

const statusTone: Record<PilotEvidencePacketStatus, "neutral" | "success" | "warning"> = {
  attached: "success",
  missing: "warning",
  blocked: "warning",
};

export function PilotEvidencePacketPanel({ packet }: PilotEvidencePacketPanelProps) {
  const allEvidence = [...packet.gateEvidence, ...packet.approvalEvidence];
  const attachedCount = allEvidence.filter((item) => item.status === "attached").length;
  const missingCount = allEvidence.filter((item) => item.status === "missing").length;
  const blockedCount = allEvidence.filter((item) => item.status === "blocked").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot evidence packet</p>
          <h2 className="mt-1 text-lg font-bold">{packet.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{packet.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={packet.uploadStatus} tone="warning" />
          <StatusPill label={packet.signoffCaptureStatus} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <EvidenceMetric label="Release candidate" value={packet.releaseCandidate} tone="neutral" />
        <EvidenceMetric label="Evidence attached" value={String(attachedCount)} tone={attachedCount > 0 ? "success" : "warning"} />
        <EvidenceMetric label="Evidence missing" value={String(missingCount)} tone={missingCount > 0 ? "warning" : "success"} />
        <EvidenceMetric label="Evidence blocked" value={String(blockedCount)} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.sourceOfTruth}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              Package evidence stays metadata first. Files, signatures, and signed approvals remain blocked until storage, identity, retention, and release-control policy are accepted.
            </p>
          </div>
          <StatusPill label={packet.storageStatus} tone="warning" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <EvidenceList title="Gate evidence needed" items={packet.gateEvidence} />
        <EvidenceList title="Approval evidence needed" items={packet.approvalEvidence} />
      </div>

      <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Blocked foundation actions</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">What this packet still cannot do</h3>
          </div>
          <StatusPill label="Preview only" tone="neutral" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] sm:grid-cols-2">
          {packet.blockedActions.map((action) => (
            <li key={action} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              {action}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function EvidenceMetric({
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

function EvidenceList({ title, items }: { title: string; items: PilotEvidencePacketItem[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Review owner and proof requirements</h3>
        </div>
        <StatusPill label={String(items.length)} tone="neutral" />
      </div>
      <div className="mt-3 grid gap-3">
        {items.map((item) => (
          <article key={item.evidenceId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {item.source} / Owner: {item.owner}
                </p>
                <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{item.label}</h4>
              </div>
              <StatusPill label={statusLabel[item.status]} tone={statusTone[item.status]} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Current evidence:</span> {item.currentEvidence}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {item.nextStep}
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <EvidenceMiniList title="Required evidence" items={item.requiredEvidence} tone="neutral" />
              <EvidenceMiniList title="Blocked by" items={item.blockedBy} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EvidenceMiniList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h5 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h5>
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
