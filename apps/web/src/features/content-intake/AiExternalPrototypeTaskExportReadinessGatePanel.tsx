import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiExternalPrototypeTaskExportCheck,
  AiExternalPrototypeTaskExportReadinessGate,
} from "@/data/sampleAiExternalPrototypeTaskExportReadinessGate";

interface AiExternalPrototypeTaskExportReadinessGatePanelProps {
  gates: AiExternalPrototypeTaskExportReadinessGate[];
}

export function AiExternalPrototypeTaskExportReadinessGatePanel({
  gates,
}: AiExternalPrototypeTaskExportReadinessGatePanelProps) {
  const blockedChannelCount = gates.reduce((total, gate) => total + gate.exportChannels.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI external task export readiness gate</p>
          <h2 className="mt-1 text-lg font-bold">Export readiness blocked</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This gate keeps copy-ready task packets from becoming live outside-builder handoffs. It shows the evidence
            needed before any prompt copy, repository issue, archive export, or Z.ai handoff can exist.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`${blockedChannelCount} blocked channel(s)`} tone="warning" />
          <StatusPill label="No task export" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {gates.map((gate) => (
          <article key={gate.gateId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{gate.taskPacketId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{gate.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={gate.status} tone="warning" />
                <StatusPill label="No live handoff" tone="warning" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
              <ExportList title="Source records" items={gate.sourceRecords} />
              <ExportList title="Blocked export actions" items={gate.blockedActions} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Export channels</h4>
                <StatusPill label="All blocked" tone="warning" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                {gate.exportChannels.map((channel) => (
                  <section key={channel.channelId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="text-sm font-bold text-[var(--tenant-text)]">{channel.label}</h5>
                      <StatusPill label={channel.status} tone="warning" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{channel.purpose}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{channel.blockedReason}</p>
                  </section>
                ))}
              </div>
            </section>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Readiness checks</h4>
                <StatusPill label={String(gate.readinessChecks.length)} tone="neutral" />
              </div>
              <div className="mt-3 grid gap-3">
                {gate.readinessChecks.map((check) => (
                  <ReadinessCheckCard key={check.checkId} check={check} />
                ))}
              </div>
            </section>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ReadinessCheckCard({ check }: { check: AiExternalPrototypeTaskExportCheck }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{check.checkId}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{check.label}</h5>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{check.blocksUntil}</p>
        </div>
        <StatusPill label={check.status} tone={check.status === "blocked" ? "warning" : "success"} />
      </div>
      <div className="mt-3">
        <ExportList title="Evidence required" items={check.evidenceRequired} />
      </div>
    </article>
  );
}

function ExportList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
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
