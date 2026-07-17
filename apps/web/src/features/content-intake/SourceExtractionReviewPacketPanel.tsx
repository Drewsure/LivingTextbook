import { Card, StatusPill } from "@living-textbook/ui";
import type { SourceExtractionPacketStatus, SourceExtractionReviewPacket } from "@/data/sampleSourceExtractionReviewPackets";

interface SourceExtractionReviewPacketPanelProps {
  packets: SourceExtractionReviewPacket[];
}

const statusTone: Record<SourceExtractionPacketStatus, "neutral" | "warning"> = {
  "evidence-only": "neutral",
  "needs-review": "warning",
  blocked: "warning",
};

export function SourceExtractionReviewPacketPanel({ packets }: SourceExtractionReviewPacketPanelProps) {
  const blockedCount = packets.reduce((total, packet) => total + packet.blockedActions.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Source extraction review packets</p>
          <h3 className="mt-1 text-lg font-bold">Extraction evidence preview</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            These packets model what OCR, parser output, AI media indexing, or manual source extraction can create before reviewer
            approval. They are evidence packets only, not teacher drafts or student payloads.
          </p>
        </div>
        <StatusPill label={`${packets.length} packet(s)`} tone="warning" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PacketMetric label="Packets" value={String(packets.length)} />
        <PacketMetric label="Blocked actions" value={String(blockedCount)} tone="warning" />
        <PacketMetric label="Draft creation" value="blocked" tone="warning" />
        <PacketMetric label="Student payload" value="blocked" tone="warning" />
      </div>

      <div className="mt-5 grid gap-4">
        {packets.map((packet) => (
          <article key={packet.packetId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.extractionMethod}</p>
                <h4 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.label}</h4>
                <p className="mt-2 break-words font-mono text-xs text-[var(--tenant-muted)]">{packet.packetId}</p>
              </div>
              <StatusPill label={packet.status} tone={statusTone[packet.status]} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <PacketText title="OCR confidence summary" body={packet.ocrConfidenceSummary} />
              <PacketText title="Segmentation review packet" body={packet.segmentationReviewPacket} />
              <PacketText title="Candidate payload summary" body={packet.candidatePayloadSummary} />
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <PacketList title="Required review" items={packet.requiredReview} tone="neutral" />
              <PacketList title="Blocked actions" items={packet.blockedActions} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function PacketMetric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "warning";
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

function PacketText({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{body}</p>
    </section>
  );
}

function PacketList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
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
