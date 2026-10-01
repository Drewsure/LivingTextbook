import { Card, StatusPill } from "@living-textbook/ui";
import type { PublisherSubmissionAsset, PublisherSubmissionManifest } from "@living-textbook/content-model";

export function PublisherSubmissionManifestPanel({
  manifest,
}: {
  manifest: PublisherSubmissionManifest;
}) {
  const requiredCount = manifest.assets.filter((asset) => asset.required).length;
  const suppliedCount = manifest.assets.filter((asset) => asset.status !== "missing").length;
  const reviewedCount = manifest.assets.filter((asset) => asset.status === "reviewed").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher submission manifest</p>
          <h2 className="mt-1 text-lg font-bold">Everything required for one reviewed unit package</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This is the intake contract a publisher can use to prepare textbook content and its multimedia companions.
            It records what is expected before a file is admitted; it does not accept files or make any asset
            student-facing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Manifest only" tone="neutral" />
          <StatusPill label="Promotion blocked" tone="warning" />
          <StatusPill label="Student use blocked" tone="warning" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Fact label="Tenant" value={manifest.tenantId} />
        <Fact label="Package" value={manifest.packageId} />
        <Fact label="Target language" value={manifest.targetLanguage} />
        <Fact label="Required assets" value={String(requiredCount)} />
        <Fact label="Supplied / reviewed" value={`${suppliedCount} / ${reviewedCount}`} />
        <Fact label="Evidence records" value={`${manifest.evidenceRequests.length} declared`} />
      </dl>

      <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Language package</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
          Student progression is driven by the target language. Support languages remain assistive and require their own
          script, audio, accessibility, and review evidence.
        </p>
        <p className="mt-2 text-sm font-semibold text-[var(--tenant-text)]">
          Support languages: {manifest.supportLanguages.length > 0 ? manifest.supportLanguages.join(", ") : "none configured"}
        </p>
      </section>

      <div className="mt-5 grid gap-3">
        {manifest.assets.map((asset) => <AssetRow key={asset.assetId} asset={asset} />)}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Evidence trace</p>
            <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">Declared records carried from intake</h3>
          </div>
          <StatusPill label="Review-pending" tone="warning" />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {manifest.evidenceRequests.map((evidence) => (
            <article key={evidence.referenceId} className="rounded-lg border border-[var(--tenant-border)] p-3">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{evidence.kind} · {evidence.required ? "required" : "optional"}</p>
              <p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{evidence.referenceId}</p>
              <p className="mt-2 break-words text-xs text-[var(--tenant-muted)]">{evidence.relativePath}</p>
              <p className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">Covers {evidence.appliesToAssetIds.length} manifest asset(s). No approval is inferred.</p>
            </article>
          ))}
        </div>
      </section>
    </Card>
  );
}

function AssetRow({ asset }: { asset: PublisherSubmissionAsset }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{asset.kind} · {asset.required ? "required" : "optional"}</p>
          <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{asset.label}</h3>
        </div>
        <StatusPill label={asset.status === "missing" ? "Awaiting publisher" : asset.status} tone={asset.status === "reviewed" ? "success" : "warning"} />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <Fact label="Accepted types" value={asset.acceptedTypes.join(", ")} />
        <Fact label="Rights evidence" value={asset.rightsEvidenceRequired ? "Required" : "Not required"} />
        <Fact label="Accessibility evidence" value={asset.accessibilityEvidenceRequired ? "Required" : "Not required"} />
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-[var(--tenant-text)]">Next gate: {asset.nextGate}</p>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
