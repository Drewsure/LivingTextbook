import { Card, StatusPill } from "@living-textbook/ui";
import type {
  MediaAssetBindingPreview,
  MediaAssetWorkspace,
  MediaAssetWorkspaceStatus,
} from "@/data/sampleMediaAssetWorkspace";
import type { EvidencePacketFlow } from "@/data/sampleEvidencePacketFlows";
import { EvidencePacketFlowPanel } from "@/features/evidence/EvidencePacketFlowPanel";

interface MediaAssetWorkspacePanelProps {
  workspace: MediaAssetWorkspace;
  evidenceFlow: EvidencePacketFlow;
}

const statusTone: Record<MediaAssetWorkspaceStatus, "neutral" | "warning"> = {
  "teacher-review-only": "neutral",
  blocked: "warning",
};

export function MediaAssetWorkspacePanel({ workspace, evidenceFlow }: MediaAssetWorkspacePanelProps) {
  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher-only media review</p>
            <h2 className="mt-1 text-2xl font-bold">{workspace.label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{workspace.summary}</p>
          </div>
          <StatusPill label={workspace.status} tone={statusTone[workspace.status]} />
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Source upload</p>
              <h3 className="mt-1 text-lg font-bold">{workspace.sourceUpload.sourceLabel}</h3>
            </div>
            <StatusPill label="blocked" tone="warning" />
          </div>
          <dl className="mt-4 grid gap-3 text-sm">
            <DataRow label="Upload id" value={workspace.sourceUpload.uploadId} />
            <DataRow label="Target packet" value={workspace.sourceUpload.targetMappingPacket} />
            <DataRow label="Rights status" value={workspace.sourceUpload.rightsStatus} />
          </dl>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Manifest preview</p>
              <h3 className="mt-1 text-lg font-bold">media_manifest</h3>
            </div>
            <StatusPill label={String(workspace.manifestPreview.length)} tone="warning" />
          </div>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] sm:grid-cols-2">
            {workspace.manifestPreview.map((item) => (
              <li key={item} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <EvidencePacketFlowPanel flow={evidenceFlow} />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Binding review</p>
            <h3 className="mt-1 text-lg font-bold">Playlist, background, and local bundle targets</h3>
          </div>
          <StatusPill label={String(workspace.bindings.length)} tone="warning" />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {workspace.bindings.map((binding) => (
            <BindingCard key={binding.bindingId} binding={binding} />
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <ListCard title="Required packets" items={workspace.requiredPackets} tone="warning" />
        <ListCard title="Blocked live actions" items={workspace.blockedActions} tone="warning" />
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Review routes</p>
              <h3 className="mt-1 text-lg font-bold">Related evidence</h3>
            </div>
            <StatusPill label={String(workspace.relatedRoutes.length)} tone="neutral" />
          </div>
          <dl className="mt-4 grid gap-3 text-sm">
            {workspace.relatedRoutes.map((route) => (
              <div key={route.href} className="grid gap-1">
                <dt className="font-semibold text-[var(--tenant-text)]">{route.label}</dt>
                <dd>
                  <a
                    className="break-words font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
                    href={route.href}
                  >
                    {route.href}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words text-[var(--tenant-muted)]">{value}</dd>
    </div>
  );
}

function BindingCard({ binding }: { binding: MediaAssetBindingPreview }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{binding.bindingId}</p>
          <h4 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{binding.label}</h4>
        </div>
        <StatusPill label="review required" tone="warning" />
      </div>
      <p className="mt-3 break-words text-sm font-bold text-[var(--tenant-text)]">{binding.targetRecord}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{binding.policy}</p>
    </article>
  );
}

function ListCard({ title, items, tone }: { title: string; items: string[]; tone: "neutral" | "warning" }) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold">{title}</h3>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}
