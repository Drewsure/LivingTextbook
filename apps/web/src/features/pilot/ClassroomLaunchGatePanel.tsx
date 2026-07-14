import { Card, StatusPill } from "@living-textbook/ui";
import type {
  ClassroomLaunchGate,
  ClassroomLaunchGateItem,
  ClassroomLaunchGateStatus,
} from "@/data/sampleClassroomLaunchGate";

interface ClassroomLaunchGatePanelProps {
  gate: ClassroomLaunchGate;
}

const statusLabel: Record<ClassroomLaunchGateStatus, string> = {
  ready: "Ready",
  "needs-policy": "Needs policy",
  blocked: "Blocked",
};

const statusTone: Record<ClassroomLaunchGateStatus, "neutral" | "success" | "warning"> = {
  ready: "success",
  "needs-policy": "warning",
  blocked: "warning",
};

export function ClassroomLaunchGatePanel({ gate }: ClassroomLaunchGatePanelProps) {
  const readyCount = gate.items.filter((item) => item.status === "ready").length;
  const needsPolicyCount = gate.items.filter((item) => item.status === "needs-policy").length;
  const blockedCount = gate.items.filter((item) => item.status === "blocked").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Classroom launch gate</p>
          <h2 className="mt-1 text-lg font-bold">{gate.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
          <a
            href={gate.workspacePath}
            className="mt-3 inline-flex rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 text-sm font-semibold text-[var(--tenant-text)] underline decoration-[var(--tenant-border)] underline-offset-4 transition hover:text-[var(--tenant-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
          >
            Open launch gate workspace
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={gate.launchStatus} tone="warning" />
          <StatusPill label="No launch button" tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <LaunchGateMetric label="Release candidate" value={gate.releaseCandidate} tone="neutral" />
        <LaunchGateMetric label="Ready items" value={String(readyCount)} tone={readyCount > 0 ? "success" : "neutral"} />
        <LaunchGateMetric label="Needs policy" value={String(needsPolicyCount)} tone={needsPolicyCount > 0 ? "warning" : "success"} />
        <LaunchGateMetric label="Blocked items" value={String(blockedCount)} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{gate.sourceOfTruth}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              No live student session. Real learner data blocked. Report export still blocked. This panel is the final
              preview boundary before a future launch workflow exists.
            </p>
          </div>
          <StatusPill label="Preview only" tone="neutral" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {gate.items.map((item) => (
          <LaunchGateItemCard key={item.itemId} item={item} />
        ))}
      </div>

      <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Operating rules</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">What must be true before children are invited</h3>
          </div>
          <StatusPill label="Launch blocked" tone="warning" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] md:grid-cols-2">
          {gate.operatingRules.map((rule) => (
            <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function LaunchGateMetric({
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
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function LaunchGateItemCard({ item }: { item: ClassroomLaunchGateItem }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {item.source} / Owner: {item.owner}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{item.label}</h3>
        </div>
        <StatusPill label={statusLabel[item.status]} tone={statusTone[item.status]} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{item.evidence}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {item.nextStep}
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <LaunchGateMiniList title="Required before launch" items={item.requiredBeforeLaunch} tone="neutral" />
        <LaunchGateMiniList title="Blocked actions" items={item.blockedActions} tone="warning" />
      </div>
    </article>
  );
}

function LaunchGateMiniList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
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
