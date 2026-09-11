import { Card, StatusPill } from "@living-textbook/ui";
import type { BackendMigrationPlan } from "@/data/sampleBackendMigrationCandidates";
import type { BackendMigrationSpecPlan } from "@/data/sampleBackendMigrationSpecs";
import type { BackendSchemaDraft } from "@/data/sampleBackendSchemaDraft";

interface BackendContractAlignmentPanelProps {
  schema: BackendSchemaDraft;
  migrationPlan: BackendMigrationPlan;
  migrationSpecPlan: BackendMigrationSpecPlan;
  errors: string[];
}

export function BackendContractAlignmentPanel({
  schema,
  migrationPlan,
  migrationSpecPlan,
  errors,
}: BackendContractAlignmentPanelProps) {
  const valid = errors.length === 0;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Backend contract alignment</p>
          <h2 className="mt-1 text-lg font-bold">Schema, migrations, and specs agree</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This read-only gate checks that migration targets exist in the vendor-neutral schema and that every migration specification points to a real candidate with usable storage fields.
          </p>
        </div>
        <StatusPill label={valid ? "Alignment clean" : "Alignment review"} tone={valid ? "success" : "warning"} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <AlignmentMetric label="Schema entities" value={String(schema.entities.length)} />
        <AlignmentMetric label="Migration candidates" value={String(migrationPlan.candidates.length)} />
        <AlignmentMetric label="Migration specs" value={String(migrationSpecPlan.specs.length)} />
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">
        {valid ? (
          <p>All current migration targets resolve to the schema, all specifications resolve to candidates, and storage identity fields are present.</p>
        ) : (
          <ul className="grid gap-2">
            {errors.map((error, index) => (
              <li key={`backend-alignment-error-${index}-${error}`}>{error}</li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

function AlignmentMetric({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-2 text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

