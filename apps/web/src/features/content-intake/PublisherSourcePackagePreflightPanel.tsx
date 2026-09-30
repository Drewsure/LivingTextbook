import { Card, StatusPill } from "@living-textbook/ui";
import type { PublisherSourcePackagePreflightReport } from "@living-textbook/content-model";

export function PublisherSourcePackagePreflightPanel({ report }: { report: PublisherSourcePackagePreflightReport }) {
  const verified = report.counts.verified === report.counts.declared && report.counts.unlisted === 0;
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher source-package preflight</p>
          <h2 className="mt-1 text-lg font-bold">Inventory the source folder before quarantine</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            A publisher supplies an explicit manifest and source folder. This report checks declared paths, file types,
            sizes, and checksums without copying files or creating a student-ready package.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review only" tone="neutral" />
          <StatusPill label={verified ? "Inventory complete" : "Needs review"} tone={verified ? "success" : "warning"} />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Fact label="Tenant" value={report.tenantId} />
        <Fact label="Package" value={report.packageId} />
        <Fact label="Declared" value={String(report.counts.declared)} />
        <Fact label="Verified" value={String(report.counts.verified)} />
        <Fact label="Unlisted" value={String(report.counts.unlisted)} />
      </dl>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Fingerprint label="Manifest fingerprint" value={report.manifestChecksumSha256} />
        <Fingerprint label="Inventory fingerprint" value={report.inventoryChecksumSha256} />
      </div>

      <div className="mt-5 grid gap-3">
        {report.files.map((file) => (
          <article key={`${file.assetId}:${file.relativePath}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{file.kind} · {file.unitKey}</p>
                <h3 className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{file.relativePath}</h3>
              </div>
              <StatusPill label={file.status} tone={file.status === "verified" ? "success" : "warning"} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{file.details}</p>
            {file.checksumSha256 ? <p className="mt-2 break-all font-mono text-xs text-[var(--tenant-muted)]">{file.checksumSha256}</p> : null}
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <ListBlock title="Blockers" items={report.blockers.length > 0 ? report.blockers : ["No source-folder blockers were found in this sample inventory."]} tone={report.blockers.length > 0 ? "warning" : "neutral"} />
        <ListBlock title="Next actions" items={report.nextActions} tone="neutral" />
      </div>
      <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">No quarantine write, package assembly, promotion, QR print, hosted activation, or student-facing use is authorized by this report.</p>
    </Card>
  );
}

function Fingerprint({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-1 break-all font-mono text-xs text-[var(--tenant-text)]">{value}</p><p className="mt-1 text-xs text-[var(--tenant-muted)]">Use this to reconcile the reviewed folder with later intake evidence.</p></div>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></div>;
}

function ListBlock({ title, items, tone }: { title: string; items: string[]; tone: "neutral" | "warning" }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3><StatusPill label={String(items.length)} tone={tone} /></div><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}</ul></section>;
}
