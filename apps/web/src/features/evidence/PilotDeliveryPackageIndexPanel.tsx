import { Card, StatusPill } from "@living-textbook/ui";
import {
  createPilotDeliveryPackageIndex,
  validatePilotDeliveryPackageIndex,
  type PilotDeliveryManifest,
  type PilotDeliveryReleaseReceipt,
} from "@living-textbook/content-model";

export function PilotDeliveryPackageIndexPanel({
  manifest,
  receipt,
}: {
  manifest: PilotDeliveryManifest;
  receipt: PilotDeliveryReleaseReceipt;
}) {
  const index = createPilotDeliveryPackageIndex({ manifest, receipt });
  const validationErrors = validatePilotDeliveryPackageIndex(index);
  const lists = [
    ["Curated game routes", index.gameRoutePaths],
    ["Media kinds", index.mediaKinds],
    ["QR aliases", index.qrAliasPaths],
    ["Local fallback paths", index.localFallbackPaths],
  ] as const;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher package index</p>
          <h2 className="mt-1 text-lg font-bold">The handoff map a publisher can review</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This metadata-only index joins the reviewed content path, curated games, media references, QR aliases, local fallback, and persistence choice. It contains no publisher payload bytes and cannot activate learners.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={index.releaseStatus} tone={index.releaseStatus === "manual-release-approved" ? "success" : "warning"} />
          <StatusPill label={index.sideEffect} tone="neutral" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={index.tenantId} />
        <Fact label="Package" value={index.packageId} />
        <Fact label="Version" value={index.version} />
        <Fact label="Delivery mode" value={index.mode} />
      </dl>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Content package" value={index.contentPackagePath} />
        <Fact label="Hosted persistence" value={index.hostedPersistence} />
        <Fact label="Raw payload" value={index.rawPayloadIncluded ? "Included" : "Excluded"} />
        <Fact label="Learner records" value={index.learnerRecordsIncluded ? "Included" : "Excluded"} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {lists.map(([label, items]) => (
          <section key={label} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold">{label}</h3>
              <StatusPill label={String(items.length)} tone="neutral" />
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
              {items.map((item) => <li key={`${label}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}
            </ul>
          </section>
        ))}
      </div>

      {validationErrors.length > 0 ? (
        <div className="mt-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-bold">Package index findings</p>
          <ul className="mt-2 grid gap-1">{validationErrors.map((error, index) => <li key={`${index}-${error}`}>{error}</li>)}</ul>
        </div>
      ) : null}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold">{value}</dd></div>;
}
