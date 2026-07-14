import { Card, StatusPill } from "@living-textbook/ui";
import type {
  ContentEntryControl,
  ContentEntryOptionScaffold,
  ContentEntryOptionStatus,
  ContentEntryRowAction,
} from "@/data/sampleContentEntryOptionScaffold";

interface ContentEntryOptionScaffoldPanelProps {
  scaffold: ContentEntryOptionScaffold;
}

const statusTone: Record<ContentEntryOptionStatus, "neutral" | "warning"> = {
  "blocked-live": "warning",
  "foundation-preview": "neutral",
  "requires-review": "warning",
};

export function ContentEntryOptionScaffoldPanel({ scaffold }: ContentEntryOptionScaffoldPanelProps) {
  const blockedCount =
    scaffold.globalControls.filter((control) => control.status !== "foundation-preview").length +
    scaffold.rowEditor.rowActions.filter((action) => action.status !== "foundation-preview").length +
    scaffold.crossGameGuide.filter((control) => control.status !== "foundation-preview").length +
    scaffold.fontRenderingControls.filter((control) => control.status !== "foundation-preview").length +
    scaffold.reviewGates.filter((gate) => gate.status !== "foundation-preview").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher content entry options</p>
          <h2 className="mt-1 text-lg font-bold">{scaffold.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{scaffold.summary}</p>
        </div>
        <StatusPill label={`${blockedCount} gated`} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Foundation rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{scaffold.foundationRule}</p>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[var(--tenant-text)]">Template workflow</h3>
          <StatusPill label={String(scaffold.workflowSteps.length)} tone="neutral" />
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {scaffold.workflowSteps.map((step) => (
            <article key={step.stepId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <p className="text-sm font-bold text-[var(--tenant-text)]">{step.label}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <ContentEntryControlList title="Source template" controls={[scaffold.sourceTemplate]} />
        <ContentEntryControlList title="Cross-game upload guide" controls={scaffold.crossGameGuide} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <ContentEntryControlList title="Activity controls" controls={scaffold.globalControls} />
        <ContentEntryControlList title="Card sidedness" controls={scaffold.sidednessOptions} />
      </div>

      <ContentEntryControlList title="Approved font and rendering controls" controls={scaffold.fontRenderingControls} />

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{scaffold.rowEditor.itemLimit}</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{scaffold.rowEditor.label}</h3>
          </div>
          <StatusPill label="Draft only" tone="warning" />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-4">
          {scaffold.rowEditor.columns.map((column) => (
            <div key={column} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <p className="text-sm font-bold text-[var(--tenant-text)]">{column}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <ContentEntryActionList title="Formatting toolbar" actions={scaffold.rowEditor.formattingTools} />
          <ContentEntryActionList title="Per-row upload and item actions" actions={scaffold.rowEditor.rowActions} />
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <ContentEntryTextList title="Required records before live tools" items={scaffold.rowEditor.requiredRecords} tone="neutral" />
        <ContentEntryTextList title="Blocked shortcuts" items={scaffold.rowEditor.blockedShortcuts} tone="warning" />
      </div>

      <ContentEntryControlList title="Review gates" controls={scaffold.reviewGates} />
    </Card>
  );
}

function ContentEntryControlList({ title, controls }: { title: string; controls: ContentEntryControl[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={String(controls.length)} tone="neutral" />
      </div>
      <div className="mt-3 grid gap-3">
        {controls.map((control) => (
          <article key={control.controlId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h4 className="text-sm font-bold text-[var(--tenant-text)]">{control.label}</h4>
              <StatusPill label={control.status} tone={statusTone[control.status]} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{control.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContentEntryActionList({ title, actions }: { title: string; actions: ContentEntryRowAction[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={String(actions.length)} tone="neutral" />
      </div>
      <div className="mt-3 grid gap-3">
        {actions.map((action) => (
          <article key={action.actionId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h4 className="text-sm font-bold text-[var(--tenant-text)]">{action.label}</h4>
              <StatusPill label={action.status} tone={statusTone[action.status]} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{action.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContentEntryTextList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
