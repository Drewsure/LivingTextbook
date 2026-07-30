import { Card, StatusPill } from "@living-textbook/ui";
import type { AiRewardReadinessGate, AiRewardReadinessStatus } from "@/data/sampleAiRewardReadinessGate";

interface AiRewardReadinessGatePanelProps {
  gates: AiRewardReadinessGate[];
}

const statusTone: Record<AiRewardReadinessStatus, "success" | "warning"> = {
  blocked: "warning",
  "ready-for-review": "success",
};

export function AiRewardReadinessGatePanel({ gates }: AiRewardReadinessGatePanelProps) {
  const blockedCheckCount = gates.reduce(
    (total, gate) => total + gate.checks.filter((check) => check.status === "blocked").length,
    0,
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI reward readiness gate</p>
          <h2 className="mt-1 text-lg font-bold">Generated rewards stay deterministic</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            AI can draft scoring and collection mappings, but it cannot publish rewards, write inventory, issue Spin Wheel
            tickets, evolve avatars, or assign students until reviewed learning-event and correction gates pass.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="No generated surprise rewards" tone="success" />
          <StatusPill label={`${blockedCheckCount} reward block(s)`} tone={blockedCheckCount > 0 ? "warning" : "success"} />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {gates.map((gate) => (
          <article key={gate.gateId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{gate.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{gate.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={gate.status} tone={statusTone[gate.status]} />
                <StatusPill label={gate.rewardCurrency} tone="neutral" />
              </div>
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Reward readiness checks</h4>
                <StatusPill label={String(gate.checks.length)} tone="neutral" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {gate.checks.map((check) => (
                  <article key={check.checkId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h5 className="text-sm font-bold text-[var(--tenant-text)]">{check.label}</h5>
                      <StatusPill label={check.status} tone={statusTone[check.status]} />
                    </div>
                    <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
                      <RewardFact label="Evidence" value={check.evidence} />
                      <RewardFact label="Required before student use" value={check.requiredBeforeStudentUse} />
                    </dl>
                  </article>
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <RewardList title="Blocked reward actions" items={gate.blockedActions} tone="warning" />
              <RewardList title="Next reward records" items={gate.nextRecords} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function RewardFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words">{value}</dd>
    </div>
  );
}

function RewardList({
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
