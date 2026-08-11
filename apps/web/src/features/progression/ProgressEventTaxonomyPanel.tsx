import { Card, StatusPill } from "@living-textbook/ui";
import {
  getProgressEventTaxonomyRegistryWarnings,
  validateProgressEventTaxonomyRegistry,
} from "@living-textbook/content-model/src/progressEventTaxonomy";
import type { ProgressEventEffect, ProgressEventTaxonomyRegistry } from "@/data/sampleProgressEventTaxonomy";

interface ProgressEventTaxonomyPanelProps {
  taxonomy: ProgressEventTaxonomyRegistry;
}

export function ProgressEventTaxonomyPanel({ taxonomy }: ProgressEventTaxonomyPanelProps) {
  const events = taxonomy.events;
  const progressAffectingCount = events.filter((event) => event.effect === "progress-affecting").length;
  const supportOnlyCount = events.filter((event) => event.effect === "support-only").length;
  const guardBlocks = validateProgressEventTaxonomyRegistry(taxonomy);
  const guardWarnings = getProgressEventTaxonomyRegistryWarnings(taxonomy);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Progress event taxonomy</p>
          <h2 className="mt-1 text-lg font-bold">What counts, what reports, what only supports</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Backend storage and teacher reports must preserve the difference between mastery evidence, report-only activity, and support-only help.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Event taxonomy guard active" tone="success" />
          <StatusPill label={`${guardBlocks.length} guard block(s)`} tone={guardBlocks.length > 0 ? "warning" : "success"} />
          <StatusPill label={taxonomy.taxonomyVersion} tone="neutral" />
          <StatusPill label={`${events.length} event types`} tone="success" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <TaxonomySummary label="Progress-affecting" value={String(progressAffectingCount)} tone="success" />
        <TaxonomySummary label="Support-only" value={String(supportOnlyCount)} tone="warning" />
        <TaxonomySummary label="Teacher visible" value={String(events.filter((event) => event.teacherVisible).length)} tone="neutral" />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
          <h3 className="text-sm font-bold text-[var(--tenant-text)]">Required event fields</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{taxonomy.requiredEventFields.join(", ")}</p>
        </section>
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
          <h3 className="text-sm font-bold text-[var(--tenant-text)]">Change control</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{taxonomy.changeControl}</p>
        </section>
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 lg:col-span-2">
          <h3 className="text-sm font-bold text-[var(--tenant-text)]">Storage rule</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{taxonomy.storageRule}</p>
        </section>
        <TaxonomyList
          title="Event taxonomy guard blocks"
          items={guardBlocks}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          emptyLabel="Taxonomy has no structural blockers."
        />
        <TaxonomyList
          title="Event taxonomy guard warnings"
          items={guardWarnings}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
          emptyLabel="Taxonomy has no review warnings."
        />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {events.map((event) => (
          <article key={event.eventType} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-mono text-sm font-bold text-[var(--tenant-text)]">{event.eventType}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{event.summary}</p>
              </div>
              <StatusPill label={formatEffect(event.effect)} tone={getEffectTone(event.effect)} />
            </div>
            <ul className="mt-3 grid gap-1 text-xs text-[var(--tenant-muted)]">
              {event.notAllowed.map((rule) => (
                <li key={rule}>Blocked: {rule}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Card>
  );
}

function TaxonomyList({
  title,
  items,
  tone,
  emptyLabel,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
  emptyLabel: string;
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.length === 0 ? <li>{emptyLabel}</li> : items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

function TaxonomySummary({ label, value, tone }: { label: string; value: string; tone: "neutral" | "success" | "warning" }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</p>
      <StatusPill label={label} tone={tone} />
    </div>
  );
}

function formatEffect(effect: ProgressEventEffect): string {
  return effect.replace("-", " ");
}

function getEffectTone(effect: ProgressEventEffect): "neutral" | "success" | "warning" {
  if (effect === "progress-affecting") {
    return "success";
  }

  if (effect === "support-only") {
    return "warning";
  }

  return "neutral";
}
