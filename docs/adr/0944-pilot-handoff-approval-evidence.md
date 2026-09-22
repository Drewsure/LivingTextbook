# ADR 0944: Pilot Handoff Approval Evidence

Status: Accepted

## Context

The pilot handoff already carried release-control, report, persistence, and
durable-write activation evidence, but the human approval ledger remained a
separate teacher workspace. That allowed a handoff summary to omit open or
blocked sign-offs.

## Decision

Add an approval-evidence snapshot to `PilotHandoffPackage`. It carries the
ledger identity, tenant/package scope, derived sign-off counts, derived status,
and explicit no-capture/no-promotion flags. The shared validator rejects scope
drift and unreconciled counts.

## Consequences

- Partner handoff conversations see the human approval state in the same packet
  as technical release and persistence evidence.
- Signature capture, package promotion, and classroom launch remain blocked.
- A future backend can persist the ledger and evidence links without changing
  the review-only contract.

## Verification

- `node scripts/verify-runtime-behavior.mjs`
- `node scripts/verify-pilot-handoff-scope.mjs`
- `npm run verify:pilot`
