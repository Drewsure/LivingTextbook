import { Card, StatusPill } from "@living-textbook/ui";

import type {
  AiPrototypeAppPatchProposal,
  AiPrototypeAppPatchProposalStatus,
  AiPrototypePatchGate,
  AiPrototypePatchGateStatus,
} from "@/data/sampleAiPrototypeAppPatchProposal";

interface AiPrototypeAppPatchProposalPanelProps {
  proposals: AiPrototypeAppPatchProposal[];
}

const statusTone: Record<AiPrototypeAppPatchProposalStatus, "neutral" | "warning" | "success"> = {
  blocked: "warning",
  "review-only": "neutral",
  "ready-for-planning": "success",
};

const statusLabel: Record<AiPrototypeAppPatchProposalStatus, string> = {
  blocked: "Patch generation blocked",
  "review-only": "Review only",
  "ready-for-planning": "Ready for patch planning",
};

const gateTone: Record<AiPrototypePatchGateStatus, "neutral" | "warning" | "success"> = {
  missing: "warning",
  blocked: "warning",
  "pending-review": "neutral",
  reviewed: "success",
};

const gateLabel: Record<AiPrototypePatchGateStatus, string> = {
  missing: "Missing",
  blocked: "Blocked",
  "pending-review": "Pending review",
  reviewed: "Reviewed",
};

export function AiPrototypeAppPatchProposalPanel({ proposals }: AiPrototypeAppPatchProposalPanelProps) {
  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI prototype app patch proposal</p>
          <h2 className="mt-1 text-lg font-bold">Patch proposal preview only</h2>
          <p className="mt-2 max-w-3xl text-sm text-[var(--tenant-muted)]">
            Future prototype integration patches must declare file scope, required evidence, tests, rollback boundaries,
            and blocked side effects before any app file can be changed.
          </p>
        </div>
        <StatusPill label="No app file writes" tone="warning" />
      </div>

      <div className="space-y-3">
        {proposals.map((proposal) => (
          <div key={proposal.proposalId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold">{proposal.label}</p>
                <p className="mt-1 text-sm text-[var(--tenant-muted)]">{proposal.summary}</p>
              </div>
              <StatusPill label={statusLabel[proposal.status]} tone={statusTone[proposal.status]} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Allowed future patch scope</p>
                <div className="mt-3 space-y-2">
                  {proposal.proposedScope.map((scope) => (
                    <div key={`${proposal.proposalId}-${scope.path}`} className="rounded-md bg-white p-3">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <p className="text-sm font-semibold">{scope.path}</p>
                        <StatusPill label={scope.action} tone="neutral" />
                      </div>
                      <p className="mt-2 text-sm text-[var(--tenant-muted)]">{scope.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <GateGroup title="Required before patch" gates={proposal.requiredBeforePatch} />
                <GateGroup title="Required test gates" gates={proposal.requiredTestGates} />

                <div className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Blocked actions</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {proposal.blockedActions.map((action) => (
                      <StatusPill key={action} label={action} tone="warning" />
                    ))}
                  </div>
                </div>

                <div className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Source records</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {proposal.sourceRecords.map((record) => (
                      <StatusPill key={record} label={record} tone="neutral" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function GateGroup({ title, gates }: { title: string; gates: AiPrototypePatchGate[] }) {
  return (
    <div className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <div className="mt-2 space-y-2">
        {gates.map((gate) => (
          <div key={`${title}-${gate.label}`} className="rounded-md bg-white p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold">{gate.label}</p>
              <StatusPill label={gateLabel[gate.status]} tone={gateTone[gate.status]} />
            </div>
            <p className="mt-2 text-xs font-semibold text-[var(--tenant-muted)]">{gate.requiredRecord}</p>
            <p className="mt-1 text-sm text-[var(--tenant-muted)]">{gate.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
