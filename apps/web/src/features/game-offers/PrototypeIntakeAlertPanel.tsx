import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PrototypeIntakeAlert,
  PrototypeIntakeAlertStatus,
} from "@/data/samplePrototypeIntakeAlert";

interface PrototypeIntakeAlertPanelProps {
  alert: PrototypeIntakeAlert;
}

const statusLabels: Record<PrototypeIntakeAlertStatus, string> = {
  "not-ready": "Not ready",
  "ready-for-review": "Ready for review",
  blocked: "Blocked",
};

export function PrototypeIntakeAlertPanel({ alert }: PrototypeIntakeAlertPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">{alert.label}</p>
          <h2 className="mt-1 text-lg font-bold">Controlled outside prototype intake timing</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{alert.summary}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusPill label={statusLabels[alert.status]} tone="warning" />
          <StatusPill label="Codex alert required" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <IntakeList title="Ready when" items={alert.readyWhen} ownerId={alert.alertId} />
        <IntakeList title="Required evidence" items={alert.requiredEvidence} ownerId={alert.alertId} />
        <IntakeList title="Blocked until ready" items={alert.blockedUntilReady} ownerId={alert.alertId} tone="warning" />
      </div>

      <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Owner rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{alert.ownerRule}</p>
      </section>
    </Card>
  );
}

function IntakeList({
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
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${ownerId}-${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
