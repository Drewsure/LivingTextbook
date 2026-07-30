import { Card, StatusPill } from "@living-textbook/ui";
import type { AiPromptPackagePlan, AiPromptPackageStatus } from "@/data/sampleAiPromptPackagePlan";

interface AiPromptPackagePlanPanelProps {
  plans: AiPromptPackagePlan[];
}

const statusTone: Record<AiPromptPackageStatus, "neutral" | "warning"> = {
  "draft-only": "neutral",
  "premium-disabled": "warning",
  blocked: "warning",
};

export function AiPromptPackagePlanPanel({ plans }: AiPromptPackagePlanPanelProps) {
  const blockedActionCount = plans.reduce((total, plan) => total + plan.blockedActions.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI prompt package preview</p>
          <h2 className="mt-1 text-lg font-bold">Versioned generation prompt</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Future AI generation must run from a reviewed prompt package with fixed input slots, schema locks, tenant
            rules, and cost controls. Free-form prompt edits stay blocked.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Model use disabled" tone="warning" />
          <StatusPill label={`${blockedActionCount} blocked action(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {plans.map((plan) => (
          <article key={plan.promptPackageId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="grid gap-3 lg:grid-cols-4">
              <PromptMetric label="Prompt template version" value={plan.templateVersion} />
              <PromptMetric label="Prompt family" value={plan.promptFamily} />
              <PromptMetric label="Model use state" value={plan.modelUseState} tone="warning" />
              <PromptMetric label="Package tier" value={plan.packageTier} tone="warning" />
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{plan.requestId}</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{plan.label}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <PromptInputList inputs={plan.inputSlots} />
              <PromptOutputLockList locks={plan.outputLocks} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <PromptList title="Cost controls" items={plan.costControls.map((control) => `${control.label}: ${control.policy}`)} tone="warning" />
              <PromptList title="Tenant rules" items={plan.tenantRules} />
              <PromptList title="Blocked prompt actions" items={plan.blockedActions} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function PromptMetric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "warning" ? "Gate" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function PromptInputList({ inputs }: { inputs: AiPromptPackagePlan["inputSlots"] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">Input slots</h4>
        <StatusPill label={String(inputs.length)} tone="neutral" />
      </div>
      <div className="mt-3 grid gap-3">
        {inputs.map((input) => (
          <article key={input.slotId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-[var(--tenant-text)]">{input.label}</p>
                <p className="mt-1 break-words font-mono text-xs text-[var(--tenant-muted)]">{input.value}</p>
              </div>
              <StatusPill label={input.status} tone={statusTone[input.status]} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{input.rule}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PromptOutputLockList({ locks }: { locks: AiPromptPackagePlan["outputLocks"] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">Output schema locks</h4>
        <StatusPill label={String(locks.length)} tone="warning" />
      </div>
      <div className="mt-3 grid gap-3">
        {locks.map((lock) => (
          <article key={lock.lockId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold text-[var(--tenant-text)]">{lock.label}</p>
              <StatusPill label={lock.rejectIfMissing ? "Reject if missing" : "Review"} tone="warning" />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{lock.requirement}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PromptList({
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
