import { Card, StatusPill } from "@living-textbook/ui";
import type { PublisherDeliveryOperatorAction, PublisherDeliveryOperatorHandoff } from "@living-textbook/content-model";

export function PublisherDeliveryOperatorHandoffPanel({ plan, validationErrors }: { plan: PublisherDeliveryOperatorHandoff; validationErrors: string[] }) {
  const current = plan.actions.filter((action) => action.status === "current");
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Operator delivery sequence</p>
          <h2 className="mt-1 text-lg font-bold">One controlled path from review to classroom rehearsal</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">This tenant-bound plan makes the next human action visible across release receipt, QR authorization, package assembly, integrity readback, and teacher rehearsal. It is a review-only workbench: it does not write files, print QR codes, activate persistence, or assign students.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Blocked" tone="warning" />
          <StatusPill label={current.length > 0 ? `${current.length} current gate` : "Review sequence"} tone="neutral" />
        </div>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={plan.tenantId} />
        <Fact label="Package" value={plan.packageId} />
        <Fact label="Quarantine" value={plan.quarantineId} />
        <Fact label="Plan" value={plan.planId} />
      </dl>
      <ol className="mt-5 grid gap-3">
        {plan.actions.map((action) => <ActionRow key={action.actionId} action={action} />)}
      </ol>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ListBlock title="Next action IDs" items={plan.nextActionIds} />
        <ListBlock title="Protected actions" items={plan.blockedActions} tone="warning" />
      </div>
      {validationErrors.length > 0 ? <ListBlock title="Operator handoff contract findings" items={validationErrors} tone="warning" /> : null}
    </Card>
  );
}

function ActionRow({ action }: { action: PublisherDeliveryOperatorAction }) {
  const tone = action.status === "complete" ? "success" : action.status === "current" ? "neutral" : "warning";
  return <li className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--tenant-primary-soft)] text-sm font-bold">{action.order}</span><div><p className="text-sm font-bold">{action.label}</p><p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">{action.evidence}</p></div></div><StatusPill label={action.status} tone={tone} /></div><p className="mt-3 border-t border-[var(--tenant-border)] pt-3 text-xs font-semibold leading-5 text-[var(--tenant-muted)]">Next: {action.nextAction}</p></li>;
}

function Fact({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold">{value}</dd></div>; }
function ListBlock({ title, items, tone = "neutral" }: { title: string; items: string[]; tone?: "neutral" | "warning" }) { return <section className="rounded-lg border border-[var(--tenant-border)] p-4"><div className="flex items-center justify-between gap-2"><h4 className="text-sm font-bold">{title}</h4><StatusPill label={String(items.length)} tone={tone} /></div><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}</ul></section>; }
