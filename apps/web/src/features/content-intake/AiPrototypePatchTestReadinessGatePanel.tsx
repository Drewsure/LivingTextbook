import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiPrototypePatchTestReadinessGateCollectionWarnings,
  validateAiPrototypePatchTestReadinessGates,
} from "@living-textbook/content-model/src/aiPrototypePatchTestReadinessGate";

import type {
  AiPrototypePatchTestLane,
  AiPrototypePatchTestLaneStatus,
  AiPrototypePatchTestReadinessGate,
  AiPrototypePatchTestReadinessGateStatus,
} from "@/data/sampleAiPrototypePatchTestReadinessGate";

interface AiPrototypePatchTestReadinessGatePanelProps {
  gates: AiPrototypePatchTestReadinessGate[];
}

const statusTone: Record<AiPrototypePatchTestReadinessGateStatus, "neutral" | "warning" | "success"> = {
  blocked: "warning",
  "review-only": "neutral",
  "ready-for-test-planning": "success",
};

const statusLabel: Record<AiPrototypePatchTestReadinessGateStatus, string> = {
  blocked: "Patch tests blocked",
  "review-only": "Review only",
  "ready-for-test-planning": "Ready for test planning",
};

const laneTone: Record<AiPrototypePatchTestLaneStatus, "neutral" | "warning" | "success"> = {
  missing: "warning",
  blocked: "warning",
  "pending-review": "neutral",
  planned: "success",
};

const laneLabel: Record<AiPrototypePatchTestLaneStatus, string> = {
  missing: "Missing",
  blocked: "Blocked",
  "pending-review": "Pending review",
  planned: "Planned",
};

export function AiPrototypePatchTestReadinessGatePanel({
  gates,
}: AiPrototypePatchTestReadinessGatePanelProps) {
  const guardBlocks = validateAiPrototypePatchTestReadinessGates(gates);
  const guardWarnings = getAiPrototypePatchTestReadinessGateCollectionWarnings(gates);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI prototype patch test readiness gate
          </p>
          <h2 className="mt-1 text-lg font-bold">Patch tests before file work</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            App patch proposals still need fixture, event, audio, mobile, scoring, route, storage, and rollback
            checks before any future file change can be planned.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Patch test readiness guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="No test execution" tone="warning" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListPanel
          title="Patch test readiness guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared patch test readiness guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <ListPanel
          title="Patch test readiness guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared patch test readiness guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="space-y-3">
        {gates.map((gate) => (
          <article key={gate.gateId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{gate.proposalId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{gate.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
              </div>
              <StatusPill label={statusLabel[gate.status]} tone={statusTone[gate.status]} />
            </div>

            <section className="mt-4 rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Required test lanes</p>
                <StatusPill label={String(gate.testLanes.length)} tone="neutral" />
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {gate.testLanes.map((lane) => (
                  <PatchTestLaneCard key={`${gate.gateId}-${lane.laneId}`} lane={lane} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <ListPanel title="Rollback requirements" items={gate.rollbackRequirements} />
              <ListPanel title="Next required records" items={gate.nextRequiredRecords} />
              <ListPanel title="Blocked actions" items={gate.blockedActions} tone="warning" />
            </div>

            <div className="mt-4 rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Source records</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {gate.sourceRecords.map((record) => (
                  <StatusPill key={`${gate.gateId}-${record}`} label={record} tone="neutral" />
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function PatchTestLaneCard({ lane }: { lane: AiPrototypePatchTestLane }) {
  return (
    <article className="rounded-md border border-[var(--tenant-border)] bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lane.requiredRecord}</p>
          <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h4>
        </div>
        <StatusPill label={laneLabel[lane.status]} tone={laneTone[lane.status]} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{lane.evidenceNeeded}</p>
    </article>
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
