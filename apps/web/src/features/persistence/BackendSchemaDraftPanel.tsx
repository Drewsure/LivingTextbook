import { Card, StatusPill } from "@living-textbook/ui";
import type {
  BackendSchemaDeploymentFit,
  BackendSchemaDraft,
  BackendSchemaEntity,
  BackendSchemaEntityStatus,
  BackendSchemaField,
} from "@/data/sampleBackendSchemaDraft";

interface BackendSchemaDraftPanelProps {
  draft: BackendSchemaDraft;
}

const statusTone: Record<BackendSchemaEntityStatus, "neutral" | "success" | "warning"> = {
  draft: "neutral",
  "required-before-pilot": "warning",
  "policy-required": "warning",
};

const statusLabel: Record<BackendSchemaEntityStatus, string> = {
  draft: "Draft",
  "required-before-pilot": "Pilot required",
  "policy-required": "Policy required",
};

const fitTone: Record<BackendSchemaDeploymentFit, "neutral" | "success" | "warning"> = {
  hosted: "success",
  local: "warning",
  hybrid: "neutral",
};

const fitLabel: Record<BackendSchemaDeploymentFit, string> = {
  hosted: "Hosted",
  local: "Local",
  hybrid: "Hybrid",
};

export function BackendSchemaDraftPanel({ draft }: BackendSchemaDraftPanelProps) {
  const pilotRequiredCount = draft.entities.filter((entity) => entity.status === "required-before-pilot").length;
  const policyRequiredCount = draft.entities.filter((entity) => entity.status === "policy-required").length;
  const forbiddenCount = draft.entities.reduce((total, entity) => total + entity.forbiddenFields.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Backend schema draft</p>
          <h2 className="mt-1 text-lg font-bold">{draft.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{draft.summary}</p>
        </div>
        <StatusPill label="Vendor neutral" tone="success" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SchemaMetric label="Entities" value={String(draft.entities.length)} tone="neutral" />
        <SchemaMetric label="Pilot required" value={String(pilotRequiredCount)} tone="warning" />
        <SchemaMetric label="Policy required" value={String(policyRequiredCount)} tone="warning" />
        <SchemaMetric label="Forbidden fields" value={String(forbiddenCount)} tone="success" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Schema decision rule</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{draft.decisionRule}</p>
          </div>
          <StatusPill label="No migrations yet" tone="neutral" />
        </div>
      </section>

      <div className="mt-5 grid gap-4">
        {draft.entities.map((entity) => (
          <SchemaEntityCard key={entity.entityId} entity={entity} />
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Cross-cutting rules</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Rules every backend candidate must preserve</h3>
          </div>
          <StatusPill label="Required" tone="success" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {draft.crossCuttingRules.map((rule, index) => (
            <li key={`backend-schema-cross-rule-${index}-${rule}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function SchemaMetric({
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

function SchemaEntityCard({ entity }: { entity: BackendSchemaEntity }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{entity.entityId}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{entity.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{entity.purpose}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={statusLabel[entity.status]} tone={statusTone[entity.status]} />
          <StatusPill label={fitLabel[entity.deploymentFit]} tone={fitTone[entity.deploymentFit]} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[var(--tenant-text)]">Fields</h4>
            <StatusPill label={String(entity.fields.length)} tone="neutral" />
          </div>
          <div className="mt-3 grid gap-2">
            {entity.fields.map((field) => (
              <SchemaFieldRow key={field.name} field={field} />
            ))}
          </div>
        </section>

        <div className="grid gap-3">
          <SchemaList title="Relationships" items={entity.relationships} tone="success" />
          <SchemaList title="Indexes" items={entity.indexes} tone="neutral" />
          <SchemaList title="Forbidden" items={entity.forbiddenFields} tone="warning" />
        </div>
      </div>

      <p className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3 text-sm leading-6 text-[var(--tenant-muted)]">
        <span className="font-semibold text-[var(--tenant-text)]">Migration note:</span> {entity.migrationNote}
      </p>
    </article>
  );
}

function SchemaFieldRow({ field }: { field: BackendSchemaField }) {
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

function SchemaList({
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
