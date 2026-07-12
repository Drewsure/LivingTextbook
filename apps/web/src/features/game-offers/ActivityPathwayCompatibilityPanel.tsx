import { Card, StatusPill } from "@living-textbook/ui";
import type {
  ActivityPathwayCompatibilityMatrix,
  ActivityPathwayCompatibilityStatus,
} from "@/data/sampleActivityPathwayCompatibility";

interface ActivityPathwayCompatibilityPanelProps {
  matrix: ActivityPathwayCompatibilityMatrix;
}

const statusTone: Record<ActivityPathwayCompatibilityStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  offered: "success",
  planned: "neutral",
  premium: "neutral",
  "teacher-review": "warning",
};

const statusLabel: Record<ActivityPathwayCompatibilityStatus, string> = {
  blocked: "Blocked",
  offered: "Offered",
  planned: "Planned",
  premium: "Premium",
  "teacher-review": "Teacher review",
};

export function ActivityPathwayCompatibilityPanel({ matrix }: ActivityPathwayCompatibilityPanelProps) {
  const offeredCount = matrix.items.filter((item) => item.status === "offered").length;
  const plannedCount = matrix.items.filter((item) => item.status === "planned").length;
  const blockedCount = matrix.items.filter((item) => item.status === "blocked").length;
  const orderedItems = [...matrix.items].sort((a, b) => (a.recommendedOrder ?? 99) - (b.recommendedOrder ?? 99));

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Activity pathway compatibility</p>
          <h3 className="mt-1 text-lg font-bold">{matrix.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{matrix.summary}</p>
        </div>
        <StatusPill label={`${offeredCount} offered`} tone="success" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Teacher promise</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{matrix.teacherPromise}</p>
      </section>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <PathwayMetric label="Offered now" value={String(offeredCount)} />
        <PathwayMetric label="Planned printables" value={String(plannedCount)} />
        <PathwayMetric label="Blocked conversions" value={String(blockedCount)} />
      </dl>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {orderedItems.map((item) => (
          <section key={item.itemId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{item.outputKind}</p>
                <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{item.label}</h4>
              </div>
              <StatusPill label={statusLabel[item.status]} tone={statusTone[item.status]} />
            </div>

            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Payload fit:</span> {item.sourcePayloadFit}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Target-language trigger:</span> {item.targetLanguageTrigger}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Compatibility rule:</span> {item.compatibilityRule}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {item.nextStep}
            </p>
          </section>
        ))}
      </div>
    </Card>
  );
}

function PathwayMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
