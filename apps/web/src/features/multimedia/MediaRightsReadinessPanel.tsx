import { Card, StatusPill } from "@living-textbook/ui";
import type { MediaRightsPlan, MediaRightsRecord, MediaRightsStatus } from "@/data/sampleMediaRightsPlan";
import { countMediaRightsByStatus } from "@/data/sampleMediaRightsPlan";

interface MediaRightsReadinessPanelProps {
  plan: MediaRightsPlan;
}

const statusTone: Record<MediaRightsStatus, "neutral" | "success" | "warning"> = {
  "cleared-for-demo": "success",
  "needs-proof": "warning",
  blocked: "warning",
};

export function MediaRightsReadinessPanel({ plan }: MediaRightsReadinessPanelProps) {
  const demoCount = countMediaRightsByStatus(plan, "cleared-for-demo");
  const needsProofCount = countMediaRightsByStatus(plan, "needs-proof");
  const blockedCount = countMediaRightsByStatus(plan, "blocked");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Media rights</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={`${blockedCount} blocked`} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Release rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.releaseRule}</p>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <RightsMetric label="Demo cleared" value={String(demoCount)} tone="success" />
        <RightsMetric label="Needs proof" value={String(needsProofCount)} tone="warning" />
        <RightsMetric label="Blocked" value={String(blockedCount)} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-4">
        {plan.records.map((record) => (
          <MediaRightsCard key={record.mediaAssetId} record={record} />
        ))}
      </div>
    </Card>
  );
}

function MediaRightsCard({ record }: { record: MediaRightsRecord }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{record.tenantId} / {record.kind}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{record.label}</h3>
          <p className="mt-1 break-words text-sm text-[var(--tenant-muted)]">{record.sourceReference}</p>
        </div>
        <StatusPill label={record.status} tone={statusTone[record.status]} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <RightsFact label="Owner" value={record.ownerName} />
        <RightsList title="Allowed uses" items={record.allowedUseCases} emptyLabel="No production use approved." tone="success" />
        <RightsList title="Missing proof" items={record.missingProof} emptyLabel="No missing proof listed." tone="warning" />
      </div>

      <p className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-text)]">
        <span className="font-semibold">Fallback:</span> {record.fallbackPlan}
      </p>
    </article>
  );
}

function RightsMetric({
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
      <p className="mt-2 text-lg font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function RightsFact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function RightsList({
  title,
  items,
  emptyLabel,
  tone,
}: {
  title: string;
  items: string[];
  emptyLabel: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      {items.length > 0 ? (
        <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{emptyLabel}</p>
      )}
    </section>
  );
}
