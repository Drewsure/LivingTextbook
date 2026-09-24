# ADR 1152: Local Recovery Storage Identity

Status: Accepted for the review-only foundation runtime

## Decision

Local provider-approval packets and local recovery packets must carry the same
storage-selection preflight and evidence-storage gate identities. The local
recovery reconciliation must compare those identities alongside tenant,
bundle, and package identity.

Backup, restore, export, retention deletion, provider activation, and package
promotion remain blocked until the shared storage policy is approved.

## Rationale

Closed-local deployments are a first-class white-label option, not a separate
security model. Their recovery evidence must remain traceable to the same
provider-neutral storage decision as hosted and hybrid paths.

## Consequences

- Local backup and retention evidence cannot silently refer to another storage
  review packet.
- Storage identity drift becomes a mismatch requiring review.
- No local file copy, restore, export, deletion, provider activation, route
  mutation, or student-facing promotion is enabled by this contract.

## References

- `packages/content-model/src/localBundleProviderApproval.ts`
- `packages/content-model/src/localBundleRecoveryPacket.ts`
- `packages/content-model/src/localBundleRecoveryReconciliation.ts`
- `docs/adr/1151-recovery-rehearsal-storage-identity.md`
