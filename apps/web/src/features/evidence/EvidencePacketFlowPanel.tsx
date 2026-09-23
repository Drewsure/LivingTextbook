import { Card, StatusPill } from "@living-textbook/ui";
import type { EvidencePacket, EvidencePacketFlow, EvidencePacketStatus } from "@/data/sampleEvidencePacketFlows";
import { validateReviewSurfaceScope } from "@living-textbook/content-model";
import type { AssetEvidencePacket } from "@living-textbook/content-model";
import type { AssetManifestPreview } from "@living-textbook/content-model";
import type { AssetManifestReleaseControlBinding } from "@living-textbook/content-model";

interface EvidencePacketFlowPanelProps {
  flow: EvidencePacketFlow;
}

const statusTone: Record<EvidencePacketStatus, "success" | "warning"> = {
  "preview-ready": "success",
  "missing-evidence": "warning",
  blocked: "warning",
};

export function EvidencePacketFlowPanel({ flow }: EvidencePacketFlowPanelProps) {
  const readyCount = flow.packets.filter((packet) => packet.status === "preview-ready").length;
  const blockedCount = flow.packets.length - readyCount;
  const scopeErrors = validateReviewSurfaceScope(flow.scopeKind);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Evidence packet flow</p>
          <h2 className="mt-1 text-xl font-bold">{flow.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{flow.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`${readyCount} preview-ready`} tone="success" />
          <StatusPill label={`${blockedCount} blocked/missing`} tone="warning" />
          <StatusPill label={flow.scopeKind === "platform" ? "Platform contract" : "Tenant contract"} tone="neutral" />
          <StatusPill label={scopeErrors.length === 0 ? "Scope contract valid" : "Scope contract review"} tone={scopeErrors.length === 0 ? "success" : "warning"} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Metric label="Scope" value={flow.scope} />
        <Metric label="Evidence packets" value={String(flow.packets.length)} />
        <Metric label="Blocked live actions" value={String(flow.blockedLiveActions.length)} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[var(--tenant-text)]">Handoff rule</h3>
          <StatusPill label="evidence_packet" tone="warning" />
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{flow.handoffRule}</p>
      </section>

      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        {flow.packets.map((packet) => (
          <EvidencePacketCard key={packet.packetId} packet={packet} />
        ))}
      </div>

      {flow.assetEvidencePacket ? <AssetEvidenceBinding packet={flow.assetEvidencePacket} /> : null}
      {flow.assetManifestPreviews ? <AssetManifestPreviewSection previews={flow.assetManifestPreviews} /> : null}
      {flow.assetReleaseControlBindings ? <AssetReleaseControlSection bindings={flow.assetReleaseControlBindings} /> : null}

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-[var(--tenant-text)]">Blocked until evidence packets pass</h3>
          <StatusPill label={String(flow.blockedLiveActions.length)} tone="warning" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] sm:grid-cols-2">
          {flow.blockedLiveActions.map((action, index) => (
            <li key={`${flow.flowId}-blocked-live-action-${index}-${action}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
              {action}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function AssetEvidenceBinding({ packet }: { packet: AssetEvidencePacket }) {
  return (
    <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Bound asset evidence</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Validated file metadata is review-only</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
            Each candidate carries tenant, source lineage, kind, MIME type, byte length, and checksum metadata before a future storage adapter can be considered.
          </p>
        </div>
        <StatusPill label={packet.reviewStatus} tone="warning" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {packet.attachments.map((attachment) => (
          <article key={attachment.attachmentId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="break-words text-sm font-bold text-[var(--tenant-text)]">{attachment.assetId}</p>
              <StatusPill label={attachment.status} tone="warning" />
            </div>
            <dl className="mt-3 grid gap-1 text-xs text-[var(--tenant-muted)]">
              <div className="flex justify-between gap-3"><dt>Kind</dt><dd className="font-semibold">{attachment.file.kind}</dd></div>
              <div className="flex justify-between gap-3"><dt>MIME</dt><dd className="break-all text-right font-semibold">{attachment.file.mimeType}</dd></div>
              <div className="flex justify-between gap-3"><dt>Bytes</dt><dd className="font-semibold">{attachment.file.sizeBytes.toLocaleString()}</dd></div>
            </dl>
            <p className="mt-3 text-xs font-semibold text-[var(--tenant-muted)]">Storage, download, and student-facing use blocked.</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AssetManifestPreviewSection({ previews }: { previews: AssetManifestPreview[] }) {
  return (
    <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Asset manifest preview</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Provider-neutral target and release gate</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
            This preview reconciles evidence into a reusable manifest shape. It does not create a manifest record or activate the asset.
          </p>
        </div>
        <StatusPill label="promotion blocked" tone="warning" />
      </div>
      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {previews.map((preview) => (
          <article key={preview.manifestId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="break-words text-sm font-bold text-[var(--tenant-text)]">{preview.assetId}</p>
              <StatusPill label={preview.decision} tone="warning" />
            </div>
            <dl className="mt-3 grid gap-1 text-xs text-[var(--tenant-muted)]">
              <div className="flex justify-between gap-3"><dt>Target</dt><dd className="font-semibold">{preview.target}</dd></div>
              <div className="flex justify-between gap-3"><dt>Release gate</dt><dd className="break-all text-right font-semibold">{preview.releaseGateId}</dd></div>
              <div className="flex justify-between gap-3"><dt>Blockers</dt><dd className="font-semibold">{preview.blockers.length}</dd></div>
            </dl>
            <ul className="mt-3 grid gap-1 text-xs leading-5 text-[var(--tenant-muted)]">
              {preview.blockers.slice(0, 4).map((blocker, index) => <li key={`${preview.manifestId}-blocker-${index}`}>{blocker}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function AssetReleaseControlSection({ bindings }: { bindings: AssetManifestReleaseControlBinding[] }) {
  return (
    <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Release-control binding</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Hosted, local, and hybrid readiness</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
            The asset cannot activate until deployment policy, storage mode, package release, and required approvals are reviewed together.
          </p>
        </div>
        <StatusPill label="activation blocked" tone="warning" />
      </div>
      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {bindings.map((binding) => (
          <article key={binding.bindingId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="break-words text-sm font-bold text-[var(--tenant-text)]">{binding.manifestId}</p>
              <StatusPill label={binding.decision} tone="warning" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--tenant-muted)]">
              <span className="rounded-full border border-[var(--tenant-border)] px-2 py-1">{binding.deploymentMode}</span>
              <span className="rounded-full border border-[var(--tenant-border)] px-2 py-1">{binding.requiredApprovals.length} approvals</span>
              <span className="rounded-full border border-[var(--tenant-border)] px-2 py-1">{binding.blockers.length} blockers</span>
            </div>
            <ul className="mt-3 grid gap-1 text-xs leading-5 text-[var(--tenant-muted)]">
              {binding.blockers.slice(0, 4).map((blocker, index) => <li key={`${binding.bindingId}-blocker-${index}`}>{blocker}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function EvidencePacketCard({ packet }: { packet: EvidencePacket }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="break-words text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.packetKey}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.label}</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">{packet.protects}</p>
        </div>
        <StatusPill label={packet.status} tone={statusTone[packet.status]} />
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <DataList title="Owner" items={[packet.ownerRole]} />
        <DataList title="Required evidence" items={packet.requiredEvidence} />
        <DataList title="Missing evidence" items={packet.missingEvidence} tone="warning" />
      </dl>
    </article>
  );
}

function DataList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <dt className="font-semibold text-[var(--tenant-text)]">{title}</dt>
      <dd className="mt-2">
        <ul className="grid gap-1 text-[var(--tenant-muted)]">
          {items.map((item, index) => (
            <li key={`${title}-${index}-${item}`} className={tone === "warning" ? "font-semibold text-[var(--tenant-text)]" : undefined}>
              {item}
            </li>
          ))}
        </ul>
      </dd>
    </div>
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
