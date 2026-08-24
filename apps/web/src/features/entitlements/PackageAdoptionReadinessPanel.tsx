import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PackageAdoptionReadinessItem,
  PackageAdoptionStatus,
} from "@/data/samplePackageAdoptionReadiness";

interface PackageAdoptionReadinessPanelProps {
  items: PackageAdoptionReadinessItem[];
}

const statusLabels: Record<PackageAdoptionStatus, string> = {
  "base-ready": "Base ready",
  "approval-required": "Approval required",
  blocked: "Blocked",
};

const statusTone: Record<PackageAdoptionStatus, "success" | "warning"> = {
  "base-ready": "success",
  "approval-required": "warning",
  blocked: "warning",
};

export function PackageAdoptionReadinessPanel({ items }: PackageAdoptionReadinessPanelProps) {
  const blockedCount = items.filter((item) => item.status !== "base-ready").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package adoption readiness</p>
          <h2 className="mt-1 text-lg font-bold">School and tenant approval before premium activation</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Premium features move through proposal, policy, cost, retention, and release checks before any teacher-side
            toggle can exist. This is an adoption review packet, not a purchase flow, activation switch, or billing
            workflow.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusPill label={`${items.length} adoption review(s)`} tone="success" />
          <StatusPill label={`${blockedCount} require approval`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {items.map((item) => (
          <article key={item.adoptionId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {item.tenantId} / {item.packageId}
                </p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{item.label}</h3>
              </div>
              <StatusPill label={statusLabels[item.status]} tone={statusTone[item.status]} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{item.summary}</p>
            <p className="mt-3 text-sm font-semibold text-[var(--tenant-text)]">Owner: {item.owner}</p>

            <div className="mt-4 grid gap-3 lg:grid-cols-5">
              <AdoptionList title="Required approvals" items={item.requiredApprovals} ownerId={item.adoptionId} />
              <AdoptionList title="Required records" items={item.requiredRecords} ownerId={item.adoptionId} />
              <AdoptionList title="Cost review" items={item.costReviewItems} ownerId={item.adoptionId} />
              <AdoptionList title="Policy review" items={item.policyReviewItems} ownerId={item.adoptionId} />
              <AdoptionList title="Blocked actions" items={item.blockedActions} ownerId={item.adoptionId} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Next required step</p>
              <p className="mt-1 text-sm leading-6 text-[var(--tenant-text)]">{item.nextStep}</p>
            </section>
          </article>
        ))}
      </div>
    </Card>
  );
}

function AdoptionList({
  title,
  items,
  ownerId,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  ownerId: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${ownerId}-${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
