import { validateLocalBundleManifestReviewRequestPreview, type LocalBundleManifestReviewRequestPreview } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

interface LocalBundleManifestReviewRequestPanelProps {
  request: LocalBundleManifestReviewRequestPreview;
}

export function LocalBundleManifestReviewRequestPanel({ request }: LocalBundleManifestReviewRequestPanelProps) {
  const errors = validateLocalBundleManifestReviewRequestPreview(request);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Reviewed manifest request preview</p>
          <h2 className="mt-1 text-lg font-bold">Machine-authenticated custody handoff</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This packet shows the exact metadata an approved delivery operator must submit to record a reviewed bundle manifest. It is a preview only: it does not call the endpoint, store a manifest, or make the package releasable.
          </p>
        </div>
        <StatusPill label={errors.length === 0 ? "Review-only" : "Blocked"} tone="warning" />
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Write boundary</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
          The eventual request requires the pilot delivery API token. Teacher browser authorization cannot record release-grade custody, and this preview does not expose or request that token.
        </p>
        <p className="mt-3 break-all font-mono text-xs font-semibold text-[var(--tenant-text)]">{request.method} {request.endpoint}</p>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={request.tenantId} />
        <Fact label="Package" value={request.packageId} />
        <Fact label="Version" value={request.version} />
        <Fact label="Manifest checksum" value={request.manifestChecksumSha256} />
        <Fact label="Quarantine" value={request.quarantineId} />
        <Fact label="Review packet" value={request.reviewPacketId} />
        <Fact label="Source preflight" value={request.sourcePreflightEvidenceId} />
        <Fact label="Reviewer / time" value={`${request.reviewerId} / ${request.reviewedAt}`} />
      </dl>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <List title="Required request fields" items={request.requiredFields} />
        <List title="Still blocked after custody review" items={request.blockedActions} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Boundary label="No endpoint call" />
        <Boundary label="No manifest body displayed" />
        <Boundary label="No package assembly" />
        <Boundary label="No student records" />
      </div>

      {errors.length > 0 ? (
        <ul className="mt-5 grid gap-2 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">
          {errors.map((error, index) => <li key={`review-request-error-${index}-${error}`}>{error}</li>)}
        </ul>
      ) : (
        <p className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">
          The request shape is valid as a review artifact. Recording it still requires the separately protected machine-authenticated operation and later release gates.
        </p>
      )}
    </Card>
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

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
      <ul className="mt-3 grid gap-2">
        {items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm text-[var(--tenant-text)]">{item}</li>)}
      </ul>
    </section>
  );
}

function Boundary({ label }: { label: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3 text-sm font-semibold text-[var(--tenant-text)]">{label}</div>;
}
