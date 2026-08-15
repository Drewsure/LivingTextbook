import { Card, StatusPill } from "@living-textbook/ui";
import type {
  BackendMigrationSpec,
  BackendMigrationSpecField,
  BackendMigrationSpecPlan,
  BackendMigrationSpecStatus,
  BackendMigrationSpecStoreKind,
} from "@/data/sampleBackendMigrationSpecs";

interface BackendMigrationSpecPanelProps {
  plan: BackendMigrationSpecPlan;
}

const statusTone: Record<BackendMigrationSpecStatus, "neutral" | "success" | "warning"> = {
  draft: "neutral",
  "ready-for-review": "success",
  "blocked-by-policy": "warning",
};

const statusLabel: Record<BackendMigrationSpecStatus, string> = {
  draft: "Draft",
  "ready-for-review": "Ready for review",
  "blocked-by-policy": "Policy blocked",
};

const storeKindLabel: Record<BackendMigrationSpecStoreKind, string> = {
  "admin-record": "Admin",
  "release-record": "Release",
  "session-record": "Session",
  "event-record": "Event",
  "collection-record": "Collection",
};

export function BackendMigrationSpecPanel({ plan }: BackendMigrationSpecPanelProps) {
  const reviewReadyCount = plan.specs.filter((spec) => spec.status === "ready-for-review").length;
  const policyBlockedCount = plan.specs.filter((spec) => spec.status === "blocked-by-policy").length;
  const fieldCount = plan.specs.reduce((total, spec) => total + spec.fields.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Backend migration specifications</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label="No vendor lock" tone="success" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MigrationSpecMetric label="Specs" value={String(plan.specs.length)} tone="neutral" />
        <MigrationSpecMetric label="Review ready" value={String(reviewReadyCount)} tone="success" />
        <MigrationSpecMetric label="Policy blocked" value={String(policyBlockedCount)} tone="warning" />
        <MigrationSpecMetric label="Fields" value={String(fieldCount)} tone="neutral" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Implementation rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.implementationRule}</p>
      </section>

      <div className="mt-5 grid gap-4">
        {plan.specs.map((spec) => (
          <MigrationSpecCard key={spec.specId} spec={spec} />
        ))}
      </div>
    </Card>
  );
}

function MigrationSpecMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function MigrationSpecCard({ spec }: { spec: BackendMigrationSpec }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{spec.specId}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{spec.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{spec.purpose}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={statusLabel[spec.status]} tone={statusTone[spec.status]} />
          <StatusPill label={storeKindLabel[spec.storeKind]} tone="neutral" />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[var(--tenant-text)]">Fields</h4>
            <StatusPill label={String(spec.fields.length)} tone="neutral" />
          </div>
          <div className="mt-3 grid gap-2">
            {spec.fields.map((field) => (
              <MigrationSpecFieldRow key={field.name} field={field} />
            ))}
          </div>
        </section>

        <div className="grid gap-3">
          <MigrationSpecFact label="Candidate" value={spec.candidateId} />
          <MigrationSpecFact label="Primary key" value={spec.primaryKey} />
          <MigrationSpecFact label="Tenant scope" value={spec.tenantScope} />
          <MigrationSpecList title="Indexes" items={spec.indexes} tone="neutral" />
          <MigrationSpecList title="Policy blockers" items={spec.policyBlockers} tone="warning" />
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <MigrationSpecFact label="Retention" value={spec.retentionRule} />
        <MigrationSpecFact label="Export" value={spec.exportRule} />
        <MigrationSpecFact label="Local fallback" value={spec.localFallback} />
      </div>
    </article>
  );
}

function MigrationSpecFieldRow({ field }: { field: BackendMigrationSpecField }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[var(--tenant-text)]">{field.name}</p>
          <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">{field.type}</p>
        </div>
        <StatusPill label={field.required ? "Required" : "Optional"} tone={field.required ? "warning" : "neutral"} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{field.note}</p>
    </div>
  );
}

function MigrationSpecFact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function MigrationSpecList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
