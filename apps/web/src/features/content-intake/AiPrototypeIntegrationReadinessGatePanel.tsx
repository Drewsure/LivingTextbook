import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiPrototypeIntegrationEvidenceCheck,
  AiPrototypeIntegrationEvidenceStatus,
  AiPrototypeIntegrationReadinessGate,
  AiPrototypeIntegrationReadinessGateStatus,
} from "@/data/sampleAiPrototypeIntegrationReadinessGate";

interface AiPrototypeIntegrationReadinessGatePanelProps {
  gates: AiPrototypeIntegrationReadinessGate[];
}

const gateTone: Record<AiPrototypeIntegrationReadinessGateStatus, "neutral" | "warning" | "success"> = {
  blocked: "warning",
  "review-only": "neutral",
  "ready-for-codex-review": "success",
};

const gateLabel: Record<AiPrototypeIntegrationReadinessGateStatus, string> = {
  blocked: "Integration blocked",
  "review-only": "Review only",
  "ready-for-codex-review": "Ready for Codex review",
};

const evidenceTone: Record<AiPrototypeIntegrationEvidenceStatus, "neutral" | "warning" | "success"> = {
  missing: "warning",
  "pending-review": "neutral",
  blocked: "warning",
  reviewed: "success",
};

const evidenceLabel: Record<AiPrototypeIntegrationEvidenceStatus, string> = {
  missing: "Missing",
  "pending-review": "Pending review",
  blocked: "Blocked",
  reviewed: "Reviewed",
};

export function AiPrototypeIntegrationReadinessGatePanel({
  gates,
}: AiPrototypeIntegrationReadinessGatePanelProps) {
  const evidenceCount = gates.reduce((total, gate) => total + gate.evidenceChecks.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI prototype integration readiness gate</p>
          <h2 className="mt-1 text-lg font-bold">All prototype evidence before integration</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This rollup keeps returned prototypes review-only until wrapper, fixture, event, audio, mobile,
            scoring, and Codex decision evidence all exist. It is a gate for future integration planning, not a
            live merge or student-route workflow.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`${evidenceCount} evidence check(s)`} tone="success" />
          <StatusPill label="No apps/web patch" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {gates.map((gate) => (
          <article key={gate.gateId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{gate.integrationPlanId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{gate.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={gateLabel[gate.status]} tone={gateTone[gate.status]} />
                <StatusPill label="Codex decision missing" tone="warning" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-4">
              <GateList title="Source records" items={gate.sourceRecords} />
              <GateList title="Integration policy" items={gate.integrationPolicy} />
              <GateList title="Next required records" items={gate.nextRequiredRecords} />
              <GateList title="Blocked actions" items={gate.blockedActions} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Evidence readiness checks</h4>
                <StatusPill label={String(gate.evidenceChecks.length)} tone="warning" />
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {gate.evidenceChecks.map((check) => (
                  <EvidenceCheckCard key={`${gate.gateId}-${check.checkId}`} check={check} />
                ))}
              </div>
            </section>
          </article>
        ))}
      </div>
    </Card>
  );
}

function EvidenceCheckCard({ check }: { check: AiPrototypeIntegrationEvidenceCheck }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{check.sourceRecord}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{check.label}</h5>
        </div>
        <StatusPill label={evidenceLabel[check.status]} tone={evidenceTone[check.status]} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{check.blocker}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <StatusPill label="Required before integration" tone={check.requiredBeforeIntegration ? "warning" : "neutral"} />
      </div>
    </article>
  );
}

function GateList({
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
