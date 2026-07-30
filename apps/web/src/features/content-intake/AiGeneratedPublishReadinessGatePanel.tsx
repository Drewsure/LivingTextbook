import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiGeneratedPublishReadinessCheckStatus,
  AiGeneratedPublishReadinessGate,
  AiGeneratedPublishReadinessStatus,
} from "@/data/sampleAiGeneratedPublishReadinessGate";

interface AiGeneratedPublishReadinessGatePanelProps {
  gates: AiGeneratedPublishReadinessGate[];
}

const gateStatusTone: Record<AiGeneratedPublishReadinessStatus, "success" | "warning"> = {
  blocked: "warning",
  "ready-for-review": "success",
};

const checkStatusTone: Record<AiGeneratedPublishReadinessCheckStatus, "success" | "warning"> = {
  "ready-preview": "success",
  blocked: "warning",
  missing: "warning",
};

export function AiGeneratedPublishReadinessGatePanel({ gates }: AiGeneratedPublishReadinessGatePanelProps) {
  const blockerCount = gates.reduce(
    (total, gate) => total + gate.checks.filter((check) => check.status !== "ready-preview").length,
    0,
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generated publish readiness gate</p>
          <h2 className="mt-1 text-lg font-bold">No generated package can skip release control</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This last-mile gate gathers manifest, verifier, audio, reward, approval, and release-control blockers before
            a generated package can write routes, playlists, assignments, local bundles, or student-ready markers.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Route creation blocked" tone="warning" />
          <StatusPill label={`${blockerCount} publish blocker(s)`} tone={blockerCount > 0 ? "warning" : "success"} />
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
                <StatusPill label={gate.status} tone={gateStatusTone[gate.status]} />
                <StatusPill label={gate.publishState} tone="warning" />
              </div>
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Future student route</p>
                  <p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{gate.futureStudentRoute}</p>
                </div>
                <StatusPill label="Preview only" tone="neutral" />
              </div>
            </section>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Publish readiness checks</h4>
                <StatusPill label={String(gate.checks.length)} tone="warning" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {gate.checks.map((check) => (
                  <article key={check.checkId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h5 className="text-sm font-bold text-[var(--tenant-text)]">{check.label}</h5>
                      <StatusPill label={check.status} tone={checkStatusTone[check.status]} />
                    </div>
                    <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
                      <PublishFact label="Evidence" value={check.evidence} />
                      <PublishFact label="Required record" value={check.requiredRecord} />
                      <PublishFact label="Student-use effect" value={check.studentUseEffect} />
                    </dl>
                  </article>
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <PublishList title="Allowed now" items={gate.allowedNow} />
              <PublishList title="Blocked publish actions" items={gate.blockedActions} tone="warning" />
              <PublishList title="Next publish records" items={gate.nextRecords} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function PublishFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words">{value}</dd>
    </div>
  );
}

function PublishList({
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
