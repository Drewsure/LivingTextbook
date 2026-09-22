import { Card, StatusPill } from "@living-textbook/ui";
import type { SourceExtractionPreview } from "@living-textbook/content-model";
import type { SourceExtractionPacketStatus, SourceExtractionReviewPacket } from "@/data/sampleSourceExtractionReviewPackets";

interface SourceExtractionReviewPacketPanelProps {
  packets: SourceExtractionReviewPacket[];
  previews: SourceExtractionPreview[];
}

const statusTone: Record<SourceExtractionPacketStatus, "neutral" | "warning"> = {
  "evidence-only": "neutral",
  "needs-review": "warning",
  blocked: "warning",
};

export function SourceExtractionReviewPacketPanel({ packets, previews }: SourceExtractionReviewPacketPanelProps) {
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

      <div className="mt-5 grid gap-4">
        {previews.map((preview) => (
          <article key={`${preview.tenantId}:${preview.sourceId}`} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Structured source extraction preview</p>
                <h4 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Page and unit lineage</h4>
                <p className="mt-2 break-words font-mono text-xs text-[var(--tenant-muted)]">
                  {preview.sourceId} / {preview.targetPackageId} / {preview.sourceChecksum}
                </p>
              </div>
              <StatusPill label="review-only" tone="warning" />
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
              <PreviewMetric label="Segments" value={String(preview.segments.length)} />
              <PreviewMetric label="Units" value={String(preview.unitSummaries.length)} />
              <PreviewMetric label="Pages" value={formatPageRange(preview)} />
              <PreviewMetric label="Storage write" value={preview.storageWriteAllowed ? "allowed" : "blocked"} />
            </dl>

            <div className="mt-4 grid gap-3">
              {preview.segments.map((segment) => (
                <section key={segment.segmentId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                      p.{segment.pageNumber} / {segment.kind} / {segment.unitKey}
                    </p>
                    <StatusPill label="not promoted" tone="warning" />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{segment.normalizedText}</p>
                  {segment.text !== segment.normalizedText ? (
                    <p className="mt-1 text-xs leading-5 text-[var(--tenant-muted)]">Original text preserved for review: {segment.text}</p>
                  ) : null}
                </section>
              ))}
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <PacketList title="Unit summaries" items={preview.unitSummaries.map((summary) => `${summary.unitKey}: ${summary.segmentCount} segment(s), pages ${summary.pageStart}-${summary.pageEnd}`)} tone="neutral" />
              <PacketList title="Blocked actions" items={preview.blockedActions.slice()} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function formatPageRange(preview: SourceExtractionPreview) {
  const pages = preview.segments.map((segment) => segment.pageNumber);
  const first = Math.min(...pages);
  const last = Math.max(...pages);
  return first === last ? String(first) : `${first}-${last}`;
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
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
