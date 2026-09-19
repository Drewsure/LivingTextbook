import { Card, StatusPill } from "@living-textbook/ui";
import {
  validateAiPrototypeEvidenceAlignmentBundles,
  type AiPrototypeEvidenceAlignmentBundle,
} from "@living-textbook/content-model";

interface AiPrototypeEvidenceAlignmentPanelProps {
  bundles: AiPrototypeEvidenceAlignmentBundle[];
}

export function AiPrototypeEvidenceAlignmentPanel({ bundles }: AiPrototypeEvidenceAlignmentPanelProps) {
  const errors = validateAiPrototypeEvidenceAlignmentBundles(bundles);
  const returnedManifestStatusLabel = {
    "not-returned": "Not returned",
    "review-only": "Returned, review-only",
    blocked: "Returned, blocked",
  } as const;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Cross-artifact evidence alignment</p>
          <h2 className="mt-1 text-lg font-bold">One request, one tenant, one evidence packet</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This read-only gate checks that the return review, returned package manifest, integration plan, wrapper
            notes, replay reports, audio, accessibility, scoring, Codex decision, and readiness gate all describe the
            same candidate. It also rejects duplicate packet identities across the review collection.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`${bundles.length} packet(s)`} tone="neutral" />
          <StatusPill label={`${errors.length} alignment error(s)`} tone={errors.length > 0 ? "warning" : "success"} />
          <StatusPill label="Review only" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {bundles.map((bundle) => (
          <article
            key={bundle.returnReview.reviewId}
            className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Aligned returned package</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">
                  {bundle.returnedPackageManifest.targetMode}
                </h3>
                <p className="mt-1 break-all text-xs text-[var(--tenant-muted)]">
                  Manifest: {bundle.returnedPackageManifest.manifestId}
                </p>
                <p className="mt-1 break-all text-xs text-[var(--tenant-muted)]">
                  Request: {bundle.returnReview.requestId} / Queue: {bundle.returnedPackageManifest.queueItemId}
                </p>
              </div>
              <StatusPill
                label={returnedManifestStatusLabel[bundle.returnedPackageManifest.status]}
                tone="warning"
              />
            </div>
          </article>
        ))}
        {errors.length > 0 ? (
          errors.map((error, index) => (
            <p key={`${error}-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm text-[var(--tenant-muted)]">
              {error}
            </p>
          ))
        ) : (
          <p className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm text-[var(--tenant-muted)]">
            All current sample evidence packets align by tenant, request, integration plan, mode, parent engine,
            and collection identity.
            This does not authorize prototype import, route replacement, scoring mutation, or student assignment.
          </p>
        )}
      </div>
    </Card>
  );
}
