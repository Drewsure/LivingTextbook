import { Card, StatusPill } from "@living-textbook/ui";
import type { UploadChannelReadinessPlan } from "@/data/sampleUploadChannelReadiness";
import { ControlledQuarantineUploadPanel } from "./ControlledQuarantineUploadPanel";
import { UploadChannelReadinessPanel } from "./UploadChannelReadinessPanel";
import { PublisherSourcePreflightEvidenceCapturePanel } from "./PublisherSourcePreflightEvidenceCapturePanel";

interface TenantUploadWorkspaceEmptyStatePanelProps {
  tenantId: string;
  tenantName: string;
  channelPlan: UploadChannelReadinessPlan;
  quarantineUploadsEnabled: boolean;
  reviewDecisionsEnabled: boolean;
}

export function TenantUploadWorkspaceEmptyStatePanel({
  tenantId,
  tenantName,
  channelPlan,
  quarantineUploadsEnabled,
  reviewDecisionsEnabled,
}: TenantUploadWorkspaceEmptyStatePanelProps) {
  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Tenant publisher intake</p>
            <h2 className="mt-1 text-2xl font-bold">No publisher files have been admitted yet</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
              {tenantName} has a private intake boundary, but no source, image, audio, music, or video records exist for
              this tenant. The channel rules below are platform policy only. No Sample Publisher or MiniStar review
              records are shown in this workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill label="No tenant records" tone="warning" />
            <StatusPill label="Promotion blocked" tone="warning" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Boundary label="Tenant custody" value={tenantId} />
          <Boundary label="Student-facing use" value="Blocked" />
          <Boundary label="Next gate" value="Source and rights review" />
        </div>
      </Card>

      <ControlledQuarantineUploadPanel
        tenantId={tenantId}
        channelPlan={channelPlan}
        enabled={quarantineUploadsEnabled}
        reviewDecisionsEnabled={reviewDecisionsEnabled}
      />
      <PublisherSourcePreflightEvidenceCapturePanel tenantId={tenantId} />

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Platform upload channels</p>
            <h2 className="mt-1 text-lg font-bold">Review the available publisher channels</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              These controls describe the white-label platform contract. A submitted file remains quarantined until
              scan, rights, source mapping, accessibility, audio coverage, package, and release evidence are complete.
            </p>
          </div>
          <StatusPill label="Policy only" tone="neutral" />
        </div>
      </Card>

      <UploadChannelReadinessPanel plan={channelPlan} />
    </div>
  );
}

function Boundary({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
