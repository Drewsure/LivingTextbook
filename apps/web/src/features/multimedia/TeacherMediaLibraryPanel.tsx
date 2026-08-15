import { Card, StatusPill } from "@living-textbook/ui";
import type { MediaRightsRecord, MediaRightsStatus } from "@/data/sampleMediaRightsPlan";
import type {
  TeacherMediaLibraryPreview,
  TeacherMediaLibraryStage,
  TeacherMediaLibraryStageStatus,
} from "@/data/sampleTeacherMediaLibrary";

interface TeacherMediaLibraryPanelProps {
  preview: TeacherMediaLibraryPreview;
  rightsRecords: MediaRightsRecord[];
}

const stageTone: Record<TeacherMediaLibraryStageStatus, "neutral" | "warning"> = {
  "preview-only": "neutral",
  blocked: "warning",
};

const rightsTone: Record<MediaRightsStatus, "success" | "warning"> = {
  "cleared-for-demo": "success",
  "needs-proof": "warning",
  blocked: "warning",
};

export function TeacherMediaLibraryPanel({ preview, rightsRecords }: TeacherMediaLibraryPanelProps) {
  const blockedCount = preview.stages.filter((stage) => stage.status === "blocked").length;

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Media maintenance preview</p>
            <h2 className="mt-1 text-2xl font-bold">{preview.label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{preview.summary}</p>
          </div>
          <StatusPill label={`${blockedCount} blocked`} tone={blockedCount > 0 ? "warning" : "success"} />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Required target records</p>
            <h3 className="mt-1 text-lg font-bold">Storage before live media tools</h3>
          </div>
          <StatusPill label={String(preview.targetRecords.length)} tone="warning" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {preview.targetRecords.map((record, index) => (
            <section key={`${preview.tenantId}-target-record-${index}-${record}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <p className="break-words text-sm font-bold text-[var(--tenant-text)]">{record}</p>
            </section>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Media rights</p>
            <h3 className="mt-1 text-lg font-bold">Partner-owned assets</h3>
          </div>
          <StatusPill label={String(rightsRecords.length)} tone="neutral" />
        </div>
        <div className="mt-4 grid gap-3">
          {rightsRecords.map((record) => (
            <MediaRecordCard key={record.mediaAssetId} record={record} />
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Maintenance stages</p>
              <h3 className="mt-1 text-lg font-bold">Preview only</h3>
            </div>
            <StatusPill label={String(preview.stages.length)} tone="neutral" />
          </div>
          <div className="mt-4 grid gap-3">
            {preview.stages.map((stage) => (
              <StageCard key={stage.stageId} stage={stage} />
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Blocked live actions</p>
              <h3 className="mt-1 text-lg font-bold">Not active yet</h3>
            </div>
            <StatusPill label={String(preview.blockedActions.length)} tone="warning" />
          </div>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {preview.blockedActions.map((action, index) => (
              <li key={`${preview.tenantId}-blocked-action-${index}-${action}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                {action}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function MediaRecordCard({ record }: { record: MediaRightsRecord }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{record.kind}</p>
          <h4 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{record.label}</h4>
          <p className="mt-1 break-words text-sm text-[var(--tenant-muted)]">{record.sourceReference}</p>
        </div>
        <StatusPill label={record.status} tone={rightsTone[record.status]} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{record.fallbackPlan}</p>
    </article>
  );
}

function StageCard({ stage }: { stage: TeacherMediaLibraryStage }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{stage.label}</h4>
        <StatusPill label={stage.status} tone={stageTone[stage.status]} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{stage.detail}</p>
    </article>
  );
}
