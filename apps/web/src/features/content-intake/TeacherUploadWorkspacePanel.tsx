import { Card, StatusPill } from "@living-textbook/ui";
import type { LabelledDiagramAssetReadinessPlan } from "@/data/sampleLabelledDiagramAssetReadiness";
import type { MultimediaAssetReadinessPlan } from "@/data/sampleMultimediaAssetReadiness";
import type { UploadFilePolicyPlan } from "@/data/sampleUploadFilePolicy";
import type { UploadChannelReadinessPlan } from "@/data/sampleUploadChannelReadiness";
import type { UploadPromotionReadinessPlan } from "@/data/sampleUploadPromotionReadiness";
import type { UploadReviewQueue } from "@/data/sampleUploadReviewQueue";
import type { UploadTargetMappingPlan } from "@/data/sampleUploadTargetMapping";
import type { EvidencePacketFlow } from "@/data/sampleEvidencePacketFlows";
import { EvidencePacketFlowPanel } from "@/features/evidence/EvidencePacketFlowPanel";
import { LabelledDiagramAssetReadinessPanel } from "./LabelledDiagramAssetReadinessPanel";
import { MultimediaAssetReadinessPanel } from "./MultimediaAssetReadinessPanel";
import { UploadChannelReadinessPanel } from "./UploadChannelReadinessPanel";
import { UploadFilePolicyPanel } from "./UploadFilePolicyPanel";
import { UploadIntakeControlPreviewPanel } from "./UploadIntakeControlPreviewPanel";
import { UploadPromotionReadinessPanel } from "./UploadPromotionReadinessPanel";
import { UploadReviewQueuePanel } from "./UploadReviewQueuePanel";
import { UploadTargetMappingPanel } from "./UploadTargetMappingPanel";

interface TeacherUploadWorkspacePanelProps {
  tenantId: string;
  channelPlan: UploadChannelReadinessPlan;
  filePolicyPlan: UploadFilePolicyPlan;
  targetMappingPlan: UploadTargetMappingPlan;
  reviewQueue: UploadReviewQueue;
  promotionPlan: UploadPromotionReadinessPlan;
  labelledDiagramPlan: LabelledDiagramAssetReadinessPlan;
  multimediaPlan: MultimediaAssetReadinessPlan;
  evidenceFlow: EvidencePacketFlow;
}

const guardrails = [
  "No live file picker in the foundation preview.",
  "No uploaded file becomes student-facing from this workspace.",
  "No automatic PDF-to-game publish.",
  "No unreviewed Labelled Diagram image activation.",
  "No music, video, or support media can trigger mastery progress.",
  "No local bundle file placement before release gates and checksums exist.",
];

export function TeacherUploadWorkspacePanel({
  tenantId,
  channelPlan,
  filePolicyPlan,
  targetMappingPlan,
  reviewQueue,
  promotionPlan,
  labelledDiagramPlan,
  multimediaPlan,
  evidenceFlow,
}: TeacherUploadWorkspacePanelProps) {
  const blockedReviewItems = reviewQueue.items.filter((item) => item.status !== "ready-preview").length;
  const blockedPromotionLanes = promotionPlan.lanes.filter((lane) => lane.status === "blocked-preview").length;

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher upload workspace</p>
            <h2 className="mt-1 text-2xl font-bold">Read-only upload command center</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This workspace collects the foundation upload decisions for tenant <span className="font-semibold">{tenantId}</span>.
              It shows where PDF/text sources, Labelled Diagram images, audio, music, video, and local-bundle media will land before any live storage or student-facing use is enabled.
            </p>
          </div>
          <StatusPill label="Preview only" tone="warning" />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <WorkspaceMetric label="Upload channels" value={String(channelPlan.channels.length)} />
          <WorkspaceMetric label="File policies" value={String(filePolicyPlan.profiles.length)} />
          <WorkspaceMetric label="Target mappings" value={String(targetMappingPlan.lanes.length)} />
          <WorkspaceMetric label="Review queue items" value={String(reviewQueue.items.length)} />
          <WorkspaceMetric label="Blocked review items" value={String(blockedReviewItems)} tone="warning" />
          <WorkspaceMetric label="Promotion lanes" value={String(promotionPlan.lanes.length)} />
          <WorkspaceMetric label="Blocked promotions" value={String(blockedPromotionLanes)} tone="warning" />
          <WorkspaceMetric label="Evidence packets" value={String(evidenceFlow.packets.length)} tone="warning" />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Workspace guardrails</p>
            <h3 className="mt-1 text-lg font-bold">Uploads stay intake records first</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              The route is intentionally separated from teacher authoring, media maintenance, and student routes so future upload controls cannot bypass review, rights, audio coverage, route mapping, or package release gates.
            </p>
          </div>
          <StatusPill label={String(guardrails.length)} tone="warning" />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {guardrails.map((guardrail) => (
            <section key={guardrail} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <p className="text-sm leading-6 text-[var(--tenant-text)]">{guardrail}</p>
            </section>
          ))}
        </div>
      </Card>

      <EvidencePacketFlowPanel flow={evidenceFlow} />
      <UploadIntakeControlPreviewPanel channelPlan={channelPlan} filePolicyPlan={filePolicyPlan} />
      <UploadChannelReadinessPanel plan={channelPlan} />
      <UploadFilePolicyPanel plan={filePolicyPlan} />
      <UploadTargetMappingPanel plan={targetMappingPlan} />
      <UploadReviewQueuePanel queue={reviewQueue} />
      <UploadPromotionReadinessPanel plan={promotionPlan} />
      <LabelledDiagramAssetReadinessPanel plan={labelledDiagramPlan} />
      <MultimediaAssetReadinessPanel plan={multimediaPlan} />
    </div>
  );
}

function WorkspaceMetric({
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
