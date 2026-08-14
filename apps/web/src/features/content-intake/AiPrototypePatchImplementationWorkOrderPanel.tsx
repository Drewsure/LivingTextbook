import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiPrototypePatchImplementationWorkOrderCollectionWarnings,
  validateAiPrototypePatchImplementationWorkOrders,
} from "@living-textbook/content-model/src/aiPrototypePatchImplementationWorkOrder";

import type {
  AiPrototypePatchImplementationWorkOrder,
  AiPrototypePatchImplementationWorkOrderStatus,
} from "@/data/sampleAiPrototypePatchImplementationWorkOrder";

interface AiPrototypePatchImplementationWorkOrderPanelProps {
  workOrders: AiPrototypePatchImplementationWorkOrder[];
}

const statusTone: Record<AiPrototypePatchImplementationWorkOrderStatus, "neutral" | "warning" | "success"> = {
  blocked: "warning",
  "review-only": "neutral",
  "ready-for-work-order-review": "success",
};

const statusLabel: Record<AiPrototypePatchImplementationWorkOrderStatus, string> = {
  blocked: "Work order blocked",
  "review-only": "Review only",
  "ready-for-work-order-review": "Ready for work-order review",
};

export function AiPrototypePatchImplementationWorkOrderPanel({
  workOrders,
}: AiPrototypePatchImplementationWorkOrderPanelProps) {
  const guardBlocks = validateAiPrototypePatchImplementationWorkOrders(workOrders);
  const guardWarnings = getAiPrototypePatchImplementationWorkOrderCollectionWarnings(workOrders);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI prototype patch implementation work order
          </p>
          <h2 className="mt-1 text-lg font-bold">Patch work order before code</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preview narrows future file groups, verification order, and rollback proof after release locks. It is
            not executable and cannot authorize app file work.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Patch implementation work order guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="No work order execution" tone="warning" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListPanel
          title="Patch implementation work order guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared patch implementation work order guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <ListPanel
          title="Patch implementation work order guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared patch implementation work order guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="space-y-3">
        {workOrders.map((workOrder) => (
          <article key={workOrder.workOrderId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{workOrder.lockId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{workOrder.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{workOrder.summary}</p>
              </div>
              <StatusPill label={statusLabel[workOrder.status]} tone={statusTone[workOrder.status]} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <ListPanel title="Required before work" items={workOrder.requiredBeforeWork} />
              <ListPanel title="Allowed future file groups" items={workOrder.allowedFutureFileGroups} />
              <ListPanel title="Dry-run verification order" items={workOrder.dryRunVerificationOrder} />
              <ListPanel title="Rollback plan" items={workOrder.rollbackPlan} />
              <ListPanel title="Blocked actions" items={workOrder.blockedActions} tone="warning" />
              <ListPanel title="Next required records" items={workOrder.nextRequiredRecords} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ListPanel({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
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
