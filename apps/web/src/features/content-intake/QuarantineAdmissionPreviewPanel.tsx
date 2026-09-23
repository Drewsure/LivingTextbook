import type { UploadQuarantineAdmissionPreview } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

export function QuarantineAdmissionPreviewPanel({
  previews,
}: {
  previews: UploadQuarantineAdmissionPreview[];
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Evidence admission preview</p>
          <h2 className="mt-1 text-lg font-bold">Evidence completeness is not publication</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preview compares a quarantined intake record with the evidence required for human review. Even a complete evidence packet remains blocked from storage activation, package release, assignment, and student use.
          </p>
        </div>
        <StatusPill label="Review-only" tone="warning" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {previews.map((preview) => (
          <AdmissionCard key={preview.admissionId} preview={preview} />
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-sm font-semibold text-[var(--tenant-text)]">Permanent boundary</p>
        <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
          Admission previews are tenant-bound, side-effect-free, and provider-neutral. They never create a file URL, alter a quarantine record, select a storage adapter, or unlock a student route.
        </p>
      </div>
    </Card>
  );
}

function AdmissionCard({ preview }: { preview: UploadQuarantineAdmissionPreview }) {
  const readyForHumanReview = preview.decision === "evidence-ready";

  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{preview.evidencePacketId}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">
            {readyForHumanReview ? "Evidence complete for review" : "Evidence still required"}
          </h3>
        </div>
        <StatusPill label={preview.decision} tone={readyForHumanReview ? "success" : "warning"} />
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <AdmissionMetric label="Tenant" value={preview.tenantId} />
        <AdmissionMetric label="Channel" value={preview.channelId} />
        <AdmissionMetric label="Promotion" value={preview.promotionAllowed ? "Allowed" : "Blocked"} />
        <AdmissionMetric label="Student use" value={preview.studentFacingAllowed ? "Allowed" : "Blocked"} />
      </dl>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{readyForHumanReview ? "Remaining deployment gate" : "Current blockers"}</p>
        <ul className="mt-2 grid gap-2">
          {(preview.blockers.length > 0 ? preview.blockers : ["No missing evidence in this preview."]).map((blocker, index) => (
            <li key={`${preview.admissionId}-blocker-${index}`} className="text-sm leading-6 text-[var(--tenant-muted)]">
              {blocker}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function AdmissionMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
