import type { LocalBundleMediaEvidenceBinding } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

interface LocalBundleMediaEvidenceBindingPanelProps {
  binding: LocalBundleMediaEvidenceBinding;
  errors: string[];
}

export function LocalBundleMediaEvidenceBindingPanel({ binding, errors }: LocalBundleMediaEvidenceBindingPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Media evidence binding</p>
          <h2 className="mt-1 text-lg font-bold">Rights, checksums, accessibility, and local eligibility</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Each media entry is tied to the exact package manifest version. Missing rights, checksums, scans, mappings,
            captions, posters, or alt text keep the asset blocked from package copy and student-facing use.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review-only" tone="warning" />
          <StatusPill label="Media copy blocked" tone="warning" />
          <StatusPill label="Student use blocked" tone="warning" />
          <StatusPill label="No side effect" tone="success" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Fact label="Tenant" value={binding.tenantId} />
        <Fact label="Package" value={binding.packageId} />
        <Fact label="Version" value={binding.packageVersion} />
        <Fact label="Assets" value={`${binding.assets.length}`} />
        <Fact label="Manifest" value={binding.manifestId} />
      </dl>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {binding.assets.map((asset) => (
          <section key={asset.assetId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold">{asset.label}</h3>
                <p className="mt-1 text-xs uppercase text-[var(--tenant-muted)]">{asset.kind}</p>
              </div>
              <StatusPill label={asset.localEligibility} tone="warning" />
            </div>
            <p className="mt-3 break-words text-xs leading-5 text-[var(--tenant-muted)]">{asset.relativePath}</p>
            <dl className="mt-3 grid gap-2 text-xs text-[var(--tenant-muted)]">
              <div className="flex justify-between gap-3"><dt>Rights</dt><dd className="font-semibold">{asset.rightsStatus}</dd></div>
              <div className="flex justify-between gap-3"><dt>Checksum</dt><dd className="font-semibold">{asset.checksum === "missing" ? "Missing" : "SHA-256"}</dd></div>
              <div className="flex justify-between gap-3"><dt>Scan</dt><dd className="font-semibold">{asset.scanStatus}</dd></div>
              <div className="flex justify-between gap-3"><dt>Mapping</dt><dd className="font-semibold">{asset.targetMappingReviewed ? "Reviewed" : "Pending"}</dd></div>
            </dl>
            <ul className="mt-3 grid gap-1 text-xs leading-5 text-[var(--tenant-muted)]">
              {asset.blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}
            </ul>
          </section>
        ))}
      </div>

      {errors.length > 0 && (
        <ul className="mt-5 grid gap-2 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">
          {errors.map((error, index) => <li key={`media-binding-error-${index}-${error}`}>{error}</li>)}
        </ul>
      )}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
