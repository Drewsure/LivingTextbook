import { Card, StatusPill } from "@living-textbook/ui";
import type {
  LabelledDiagramAnchorPreview,
  LabelledDiagramAssetWorkspace,
  LabelledDiagramAssetWorkspaceStatus,
} from "@/data/sampleLabelledDiagramAssetWorkspace";
import type { EvidencePacketFlow } from "@/data/sampleEvidencePacketFlows";
import { EvidencePacketFlowPanel } from "@/features/evidence/EvidencePacketFlowPanel";

interface LabelledDiagramAssetWorkspacePanelProps {
  workspace: LabelledDiagramAssetWorkspace;
  evidenceFlow: EvidencePacketFlow;
}

const statusTone: Record<LabelledDiagramAssetWorkspaceStatus, "neutral" | "warning"> = {
  "teacher-review-only": "neutral",
  blocked: "warning",
};

export function LabelledDiagramAssetWorkspacePanel({ workspace, evidenceFlow }: LabelledDiagramAssetWorkspacePanelProps) {
  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher-only asset review</p>
            <h2 className="mt-1 text-2xl font-bold">{workspace.label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{workspace.summary}</p>
          </div>
          <StatusPill label={workspace.status} tone={statusTone[workspace.status]} />
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Image review frame</p>
              <h3 className="mt-1 text-lg font-bold">Manifest and anchors preview</h3>
            </div>
            <StatusPill label="No live editor" tone="warning" />
          </div>

          <div className="mt-4 grid min-h-72 place-items-center rounded-lg border border-dashed border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="w-full max-w-xl rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
              <div className="aspect-[4/3] rounded-lg border border-[var(--tenant-border)] bg-white">
                <div className="grid h-full place-items-center p-4 text-center text-sm font-semibold text-[var(--tenant-muted)]">
                  Reviewed image placeholder: anchors are metadata previews only
                </div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {workspace.anchors.map((anchor) => (
                  <span key={anchor.anchorId} className="rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-bold">
                    {anchor.targetLanguageText}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

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
      </div>

      <EvidencePacketFlowPanel flow={evidenceFlow} />

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Required manifest</p>
              <h3 className="mt-1 text-lg font-bold">game_asset_manifest</h3>
            </div>
            <StatusPill label={String(workspace.manifestPreview.length)} tone="warning" />
          </div>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {workspace.manifestPreview.map((item) => (
              <li key={item} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Required anchors</p>
              <h3 className="mt-1 text-lg font-bold">label_anchor_record</h3>
            </div>
            <StatusPill label={String(workspace.anchors.length)} tone="warning" />
          </div>
          <div className="mt-4 grid gap-3">
            {workspace.anchors.map((anchor) => (
              <AnchorCard key={anchor.anchorId} anchor={anchor} />
            ))}
          </div>
        </Card>
      </div>

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

function AnchorCard({ anchor }: { anchor: LabelledDiagramAnchorPreview }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{anchor.anchorId}</p>
          <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{anchor.label}</h4>
        </div>
        <StatusPill label="review required" tone="warning" />
      </div>
      <dl className="mt-3 grid gap-2 text-sm text-[var(--tenant-muted)] sm:grid-cols-2">
        <DataRow label="Target-language label text" value={anchor.targetLanguageText} />
        <DataRow label="Support language" value={anchor.supportLanguageText} />
        <DataRow label="Audio" value={anchor.audioCueStatus} />
        <DataRow label="Coordinates" value={anchor.coordinateStatus} />
      </dl>
      <p className="mt-3 text-sm font-semibold text-[var(--tenant-text)]">{anchor.progressRule}</p>
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
