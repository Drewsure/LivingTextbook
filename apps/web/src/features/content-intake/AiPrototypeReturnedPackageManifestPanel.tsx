import { Card, StatusPill } from "@living-textbook/ui";
import {
  validateAiPrototypeReturnedPackageManifest,
  type AiPrototypeReturnedPackageManifest,
} from "@living-textbook/content-model/src/aiPrototypeReturnedPackageManifest";

interface AiPrototypeReturnedPackageManifestPanelProps {
  manifests: AiPrototypeReturnedPackageManifest[];
  alignmentErrors: string[];
  intakeAlignmentErrors: string[];
}

export function AiPrototypeReturnedPackageManifestPanel({
  manifests,
  alignmentErrors,
  intakeAlignmentErrors,
}: AiPrototypeReturnedPackageManifestPanelProps) {
  const errors = manifests.flatMap((manifest) =>
    validateAiPrototypeReturnedPackageManifest(manifest).map(
      (error) => manifest.manifestId + ": " + error,
    ),
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Returned package manifest contract</p>
          <h2 className="mt-1 text-lg font-bold">Exact source snapshot before Z.ai review</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            A returned prototype must identify the approved repository, immutable snapshot, safe prototype folder,
            and evidence artifacts before Codex can consider a wrapper. These previews do not import or copy files.
          </p>
          <p className="mt-2 text-sm font-semibold text-[var(--tenant-muted)]">
            No direct file copy into apps/web. No direct file copy into apps/ai-service. No import.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={manifests.length + " manifest(s)"} tone="neutral" />
          <StatusPill label={errors.length + " contract error(s)"} tone={errors.length > 0 ? "warning" : "success"} />
          <StatusPill label={alignmentErrors.length + " checklist alignment error(s)"} tone={alignmentErrors.length > 0 ? "warning" : "success"} />
          <StatusPill label={intakeAlignmentErrors.length + " intake alignment error(s)"} tone={intakeAlignmentErrors.length > 0 ? "warning" : "success"} />
          <StatusPill label="No import" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {manifests.map((manifest) => (
          <article key={manifest.manifestId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {manifest.tenantId} / {manifest.queueItemId}
                </p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{manifest.targetMode}</h3>
                <p className="mt-1 text-sm text-[var(--tenant-muted)]">
                  {manifest.sourceRepository} / {manifest.sourceSnapshotId} / {manifest.parentEngine}
                </p>
              </div>
              <StatusPill label="Not returned" tone="warning" />
            </div>
            <div className="mt-3 grid gap-2 text-sm text-[var(--tenant-muted)] sm:grid-cols-2">
              <p>Source folder: {manifest.prototypeFolder}</p>
              <p>Evidence artifacts: {manifest.artifacts.length}</p>
            </div>
          </article>
        ))}
      </div>

      {errors.length > 0 && (
        <div className="mt-4 grid gap-2">
          {errors.map((error, index) => (
            <p key={error + "-" + index} className="rounded-lg border border-[var(--tenant-border)] p-3 text-sm text-[var(--tenant-muted)]">
              {error}
            </p>
          ))}
        </div>
      )}

      <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm text-[var(--tenant-muted)]">
        <p className="font-semibold text-[var(--tenant-text)]">Return checklist alignment</p>
        {alignmentErrors.length > 0 ? (
          <ul className="mt-2 grid gap-2">
            {alignmentErrors.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1">Manifest identity matches its tenant-scoped return checklist. This remains review-only.</p>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm text-[var(--tenant-muted)]">
        <p className="font-semibold text-[var(--tenant-text)]">Intake queue alignment</p>
        {intakeAlignmentErrors.length > 0 ? (
          <ul className="mt-2 grid gap-2">
            {intakeAlignmentErrors.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1">Manifest identity matches its original intake queue item. This remains review-only.</p>
        )}
      </div>
    </Card>
  );
}
