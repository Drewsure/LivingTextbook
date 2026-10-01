import { Card, StatusPill } from "@living-textbook/ui";
import type { PublisherDeliveryHandoffRecord } from "@living-textbook/content-model";

export function PublisherDeliveryHandoffRecordPanel({ record, validationErrors = [] }: { record: PublisherDeliveryHandoffRecord; validationErrors?: string[] }) {
  const present = record.evidence.filter((item) => item.status === "present").length;
  const previewOnly = record.evidence.filter((item) => item.status === "preview-only").length;
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher delivery handoff evidence</p>
          <h2 className="mt-1 text-lg font-bold">One versioned record for the eventual package handoff</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">This record lets a publisher and reviewer inspect the complete handoff shape: source, review packet, delivery identity, fallback route, rollback, and expected metadata files. It remains a review-only record and does not deliver a package.</p>
        </div>
        <div className="flex flex-wrap gap-2"><StatusPill label="Blocked" tone="warning" /><StatusPill label={`${present}/${record.evidence.length} present`} tone={present > 0 ? "success" : "neutral"} /><StatusPill label={`${previewOnly} previews`} tone="neutral" /></div>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Handoff" value={record.handoffId} /><Fact label="Tenant" value={record.tenantId} /><Fact label="Package" value={record.packageId} /><Fact label="Mode" value={record.selectedMode} /><Fact label="Quarantine" value={record.quarantineId} /><Fact label="Source checksum" value={record.sourceChecksumSha256} />
      </dl>
      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {record.evidence.map((item) => <article key={item.evidenceId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-bold">{item.label}</h3><StatusPill label={item.status} tone={item.status === "present" ? "success" : "warning"} /></div><p className="mt-2 break-words text-xs font-semibold text-[var(--tenant-muted)]">{item.identity}</p><p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{item.details}</p><p className="mt-3 border-t border-[var(--tenant-border)] pt-3 text-xs font-semibold leading-5 text-[var(--tenant-muted)]">Next: {item.nextAction}</p></article>)}
      </div>
      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Package evidence provenance</p>
            <h3 className="mt-1 text-base font-bold">Publisher assets and platform-derived games remain separate</h3>
          </div>
          <StatusPill label={record.packageEvidence.status} tone={record.packageEvidence.status === "reviewed-package-evidence" ? "success" : "warning"} />
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <Fact label="Review record" value={record.packageEvidence.reviewId ?? "Not recorded"} />
          <Fact label="Publisher assets" value={String(record.packageEvidence.publisherAssetReferenceCount)} />
          <Fact label="Platform-derived" value={String(record.packageEvidence.platformDerivedReferenceCount)} />
        </dl>
        <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Canonical game evidence</p>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">These platform-derived records must travel with the reviewed package before game readiness can be shown.</p>
          <ul className="mt-2 grid gap-2 text-xs text-[var(--tenant-muted)]">
            {record.packageEvidence.canonicalGameDerivedEvidenceRecordIds.length > 0 ? record.packageEvidence.canonicalGameDerivedEvidenceRecordIds.map((recordId) => <li key={recordId} className="rounded border border-[var(--tenant-border)] p-2">{recordId}</li>) : <li className="rounded border border-[var(--tenant-border)] p-2">Not recorded</li>}
          </ul>
        </div>
        {record.packageEvidence.references.length > 0 ? <ul className="mt-4 grid gap-2 sm:grid-cols-2">{record.packageEvidence.references.map((reference) => <li key={reference.lane} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3 text-sm"><span className="font-bold">{reference.lane}</span><span className="ml-2 text-[var(--tenant-muted)]">{reference.origin}</span><p className="mt-1 break-words text-xs text-[var(--tenant-muted)]">{reference.referenceId}</p></li>)}</ul> : <p className="mt-4 text-sm leading-6 text-[var(--tenant-muted)]">No package evidence references are recorded in this review-only handoff.</p>}
      </section>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4"><h3 className="text-sm font-bold">Expected metadata files</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{record.expectedMetadataFiles.map((file) => <li key={file} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{file}</li>)}</ul><p className="mt-3 text-xs leading-5 text-[var(--tenant-muted)]">Included now: none. The list is a contract preview, not a delivery receipt.</p></section>
        <section className="rounded-lg border border-[var(--tenant-border)] p-4"><h3 className="text-sm font-bold">Fallback and recovery</h3><dl className="mt-3 grid gap-3"><Fact label="Fallback status" value={record.fallbackRoute.status} /><Fact label="Route pattern" value={record.fallbackRoute.routePattern} /><Fact label="Rollback" value={record.rollback.status} /></dl><p className="mt-3 text-xs leading-5 text-[var(--tenant-muted)]">{record.rollback.nextAction}</p></section>
      </div>
      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4"><p className="text-sm font-bold">Protection boundary</p><p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">Raw payload: excluded · learner records: excluded · QR print artifact: not created · package assembly: blocked · release write: blocked · hosted persistence: blocked · student-facing use: blocked · side effect: none.</p></div>
      {validationErrors.length > 0 ? <ListBlock title="Handoff record contract findings" items={validationErrors} /> : null}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold">{value}</dd></div>; }
function ListBlock({ title, items }: { title: string; items: string[] }) { return <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4"><h3 className="text-sm font-bold">{title}</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}</ul></section>; }
