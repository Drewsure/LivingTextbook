import { Card, StatusPill } from "@living-textbook/ui";
import type { SourceExtractionReviewPacket } from "@/data/sampleSourceExtractionReviewPackets";
import type { SourceReviewQueue } from "@/data/sampleSourceReviewQueue";
import { SourceExtractionReviewPacketPanel } from "./SourceExtractionReviewPacketPanel";
import { SourceReviewQueuePanel } from "./SourceReviewQueuePanel";

interface TeacherSourceReviewWorkspacePanelProps {
  tenantId: string;
  tenantName: string;
  queue: SourceReviewQueue;
  extractionPackets: SourceExtractionReviewPacket[];
}

const guardrails = [
  "No live extraction action in the foundation preview.",
  "No raw PDF as student payload.",
  "No unreviewed OCR assignment.",
  "No AI extraction direct assignment.",
  "No parser output as a route target.",
  "No automatic PDF-to-game publish.",
];

export function TeacherSourceReviewWorkspacePanel({
  tenantId,
  tenantName,
  queue,
  extractionPackets,
}: TeacherSourceReviewWorkspacePanelProps) {
  const tenantItems = queue.items.filter((item) => item.tenantId === tenantId);
  const tenantPackets = extractionPackets.filter((packet) => packet.tenantId === tenantId);
  const blockedCount = tenantItems.reduce((total, item) => total + item.blockedBy.length, 0);
  const sourceKinds = new Set(tenantItems.map((item) => item.kind));
  const tenantQueue: SourceReviewQueue = {
    ...queue,
    label: `${tenantName} source review workspace`,
    summary:
      "A tenant-scoped review lane for PDF, DOCX, audio, video, and teacher notes before any source becomes a canonical package, media manifest, QR target, or student-facing game.",
    items: tenantItems,
  };

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher source review workspace</p>
            <h2 className="mt-1 text-2xl font-bold">Review-only source intake</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This workspace shows source material for tenant <span className="font-semibold">{tenantId}</span> before any
              extraction, upload, OCR, parser, AI import, route mapping, package release, media playlist, or assignment workflow
              can use it.
            </p>
          </div>
          <StatusPill label="No live extraction" tone="warning" />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <WorkspaceMetric label="Tenant sources" value={String(tenantItems.length)} />
          <WorkspaceMetric label="Source kinds" value={String(sourceKinds.size)} />
          <WorkspaceMetric label="Required records" value={String(queue.requiredRecords.length)} tone="warning" />
          <WorkspaceMetric label="Open blockers" value={String(blockedCount)} tone={blockedCount > 0 ? "warning" : "neutral"} />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Source gate boundaries</p>
            <h3 className="mt-1 text-lg font-bold">Extraction stays evidence-first</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              Future OCR, parser, spreadsheet import, and AI extraction controls must create review evidence first. They cannot
              bypass upload policy, source lineage, rights, audio coverage, verifier review, package release, or classroom launch gates.
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

      <SourceReviewQueuePanel queue={tenantQueue} />
      <SourceExtractionReviewPacketPanel packets={tenantPackets} />
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
