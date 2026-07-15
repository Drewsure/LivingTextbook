import { Card, StatusPill } from "@living-textbook/ui";
import type { EvidencePacketReviewIndex, EvidencePacketReviewSource } from "@/data/sampleEvidencePacketReviewIndex";

interface EvidencePacketReviewIndexPanelProps {
  index: EvidencePacketReviewIndex;
}

export function EvidencePacketReviewIndexPanel({ index }: EvidencePacketReviewIndexPanelProps) {
  const packetCount = index.sources.reduce((total, source) => total + source.flow.packets.length, 0);
  const blockedPacketCount = index.sources.reduce(
    (total, source) => total + source.flow.packets.filter((packet) => packet.status !== "preview-ready").length,
    0,
  );
  const liveActionCount = new Set(index.sources.flatMap((source) => source.protectedLiveActions)).size;

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Evidence packet review index</p>
            <h2 className="mt-1 text-2xl font-bold">{index.label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{index.summary}</p>
          </div>
          <StatusPill label={index.reviewStatus} tone="warning" />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Evidence sources" value={String(index.sources.length)} />
          <Metric label="Evidence packets" value={String(packetCount)} />
          <Metric label="Blocked or missing" value={String(blockedPacketCount)} tone="warning" />
          <Metric label="Protected live actions" value={String(liveActionCount)} tone="warning" />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Review queue rollup</p>
            <h3 className="mt-1 text-lg font-bold">Evidence sources before live upload controls</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              Reviewers can open each source workspace, but this index keeps the cross-source blockers visible in one place.
            </p>
          </div>
          <StatusPill label="No live actions" tone="warning" />
        </div>

        <div className="mt-5 grid gap-4">
          {index.sources.map((source) => (
            <EvidenceSourceCard key={source.sourceId} source={source} />
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Storage handoff</p>
            <h3 className="mt-1 text-lg font-bold">Records required before evidence becomes durable</h3>
          </div>
          <StatusPill label="evidence_packet" tone="warning" />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
          <ListBlock title="Storage contract records" items={index.storageContractRecords} />
          <ListBlock title="Standing review-only rules" items={index.standingRules} tone="warning" />
        </div>
      </Card>
    </div>
  );
}

function EvidenceSourceCard({ source }: { source: EvidencePacketReviewSource }) {
  const readyCount = source.flow.packets.filter((packet) => packet.status === "preview-ready").length;
  const blockedCount = source.flow.packets.length - readyCount;

  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{source.flow.flowId}</p>
          <h4 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{source.label}</h4>
          <a
            href={source.href}
            className="mt-2 block break-words text-sm font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
          >
            {source.href}
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`${readyCount} ready`} tone="success" />
          <StatusPill label={`${blockedCount} blocked`} tone="warning" />
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <DataCell title="Source record" value={source.sourceRecord} />
        <DataCell title="Storage record" value={source.storageRecord} />
      </dl>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <ListBlock title="Next evidence needed" items={source.nextEvidenceNeeded} tone="warning" />
        <ListBlock title="Protected live actions" items={source.protectedLiveActions} tone="warning" />
      </div>
    </article>
  );
}

function DataCell({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <dt className="font-semibold text-[var(--tenant-text)]">{title}</dt>
      <dd className="mt-1 break-words text-[var(--tenant-muted)]">{value}</dd>
    </div>
  );
}

function ListBlock({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Metric({
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
