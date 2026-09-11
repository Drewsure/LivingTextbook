import { Card, StatusPill } from "@living-textbook/ui";
import { validateAiPrototypeEvidenceAlignment, type AiPrototypeEvidenceAlignmentBundle } from "@living-textbook/content-model/src/aiPrototypeEvidenceAlignment";

interface AiPrototypeEvidenceAlignmentPanelProps {
  bundles: AiPrototypeEvidenceAlignmentBundle[];
}

export function AiPrototypeEvidenceAlignmentPanel({ bundles }: AiPrototypeEvidenceAlignmentPanelProps) {
  const errors = bundles.flatMap((bundle) =>
    validateAiPrototypeEvidenceAlignment(bundle).map((error) => `${bundle.returnReview.requestId}: ${error}`),
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Cross-artifact evidence alignment</p>
          <h2 className="mt-1 text-lg font-bold">One request, one tenant, one evidence packet</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This read-only gate checks that the return review, integration plan, wrapper notes, replay reports,
            audio, accessibility, scoring, Codex decision, and readiness gate all describe the same candidate.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`${bundles.length} packet(s)`} tone="neutral" />
          <StatusPill label={`${errors.length} alignment error(s)`} tone={errors.length > 0 ? "warning" : "success"} />
          <StatusPill label="Review only" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {errors.length > 0 ? (
          errors.map((error, index) => (
            <p key={`${error}-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm text-[var(--tenant-muted)]">
              {error}
            </p>
          ))
        ) : (
          <p className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm text-[var(--tenant-muted)]">
            All current sample evidence packets align by tenant, request, integration plan, mode, and parent engine.
            This does not authorize prototype import, route replacement, scoring mutation, or student assignment.
          </p>
        )}
      </div>
    </Card>
  );
}
