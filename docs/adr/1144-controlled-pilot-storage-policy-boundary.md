# ADR 1144: Controlled Pilot Storage Policy Boundary

Status: Accepted for the review-only foundation runtime

## Decision

Controlled-pilot approval readiness and the human-review packet must carry the
same provider-neutral storage-selection preflight and evidence-storage gate
identities used by evidence, deployment, and pilot handoff review.

The approval-readiness layer may determine whether a future human approval
workflow can be designed, but it must not select a provider, capture approval,
freeze a release, enable persistence, or launch students. The human-review
packet must retain the storage review references and keep them explicitly
blocked.

## Rationale

Storage policy is a release prerequisite, not an implementation detail. If the
storage review disappears at approval readiness, a reviewer could mistake
release evidence for permission to operate hosted, local, or hybrid storage.
Keeping the identity chain visible preserves cost, privacy, retention, backup,
and tenant-isolation decisions until a separately authorized policy action.

## Consequences

- Approval readiness cannot become eligible while storage selection is enabled
  or scoped to another tenant/package.
- Human-review packets carry six exact evidence references, including the
  storage preflight and gate.
- Provider selection, writes, activation, export, QR mutation, release
  mutation, assignment, and classroom launch remain blocked.

## References

- `packages/content-model/src/controlledPilotApprovalReadiness.ts`
- `packages/content-model/src/controlledPilotHumanReviewPacket.ts`
- `apps/web/src/features/pilot/ControlledPilotApprovalReadinessPanel.tsx`
- `apps/web/src/features/pilot/ControlledPilotHumanReviewPacketPanel.tsx`
