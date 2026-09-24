# ADR 1159: Controlled Pilot Storage Reconciliation

Status: Accepted for the review-only foundation runtime

## Decision

Controlled-pilot approval readiness must compare the storage-selection
preflight and evidence-storage gate identity from provider selection, the
canonical pilot decision, and the composite evidence release binding.

## Rationale

The approval readiness record is the last review boundary before a human
approval workflow could be designed. Copying storage identity from only one
input would allow stale evidence or a changed binding to appear eligible.

## Consequences

- Storage identity drift becomes an explicit release-control blocker.
- Enabled storage state remains ineligible for this review-only runtime.
- Approval capture, release mutation, student launch, hosted writes, and
  student data collection remain blocked.

## References

- `packages/content-model/src/controlledPilotApprovalReadiness.ts`
- `scripts/verify-controlled-pilot-approval-readiness.mjs`
- `docs/adr/1158-browser-evidence-pilot-storage-lineage.md`
