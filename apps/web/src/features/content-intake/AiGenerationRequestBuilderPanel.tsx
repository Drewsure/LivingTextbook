import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiGenerationRequestBuilder,
  AiGenerationRequestBuilderStatus,
} from "@/data/sampleAiGenerationRequestBuilder";

interface AiGenerationRequestBuilderPanelProps {
  builders: AiGenerationRequestBuilder[];
}

const statusTone: Record<AiGenerationRequestBuilderStatus, "neutral" | "warning"> = {
  "ready-for-review": "neutral",
  blocked: "warning",
};

export function AiGenerationRequestBuilderPanel({ builders }: AiGenerationRequestBuilderPanelProps) {
  const blockedActionCount = builders.reduce((total, builder) => total + builder.blockedActions.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generation request builder</p>
          <h2 className="mt-1 text-lg font-bold">Disabled generator setup form</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This teacher/admin form preview shows the future request shape without live prompt dispatch, model billing,
            generation, verifier submission, route creation, or student assignment.
          </p>
        </div>
        <StatusPill label={`${blockedActionCount} blocked action(s)`} tone="warning" />
      </div>

      <div className="mt-5 grid gap-4">
        {builders.map((builder) => (
          <article key={builder.builderId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Teacher request packet</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{builder.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{builder.summary}</p>
              </div>
              <StatusPill label="Review only" tone="warning" />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {builder.fields.map((field) => (
                <label key={field.fieldId} className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
                  {field.label}
                  <input
                    value={field.value}
                    readOnly
                    aria-describedby={`${field.fieldId}-status`}
                    className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--tenant-text)]"
                  />
                  <span id={`${field.fieldId}-status`} className="flex flex-wrap gap-2">
                    <StatusPill label={field.required ? "Required" : "Optional"} tone="neutral" />
                    <StatusPill label={field.status} tone={statusTone[field.status]} />
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <BuilderList title="Curated pathway options" items={builder.pathwayOptions} />
              <BuilderList title="Output records" items={builder.outputRecords} />
              <BuilderList title="Blocked setup actions" items={builder.blockedActions} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Safety toggles</h4>
                <StatusPill label={String(builder.safetyToggles.length)} tone="warning" />
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {builder.safetyToggles.map((toggle) => (
                  <div key={toggle.toggleId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-[var(--tenant-text)]">
                        <input type="checkbox" checked={toggle.enabled} readOnly className="size-4 accent-[var(--tenant-accent)]" />
                        {toggle.label}
                      </label>
                      <StatusPill label={toggle.enabled ? "On" : "Off"} tone={toggle.enabled ? "neutral" : "warning"} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{toggle.policy}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                disabled
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-muted)] opacity-70"
              >
                Generate draft blocked
              </button>
              <button
                type="button"
                disabled
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-muted)] opacity-70"
              >
                Estimate API cost blocked
              </button>
              <button
                type="button"
                disabled
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-muted)] opacity-70"
              >
                Submit request blocked
              </button>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function BuilderList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
