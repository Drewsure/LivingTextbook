# ADR 1155: Local Media Release-Control Storage Identity

Status: Accepted for the review-only foundation runtime

## Decision

The local media release-control binding must carry the exact storage-selection
preflight and evidence-storage gate identities from media reconciliation.
Storage identity drift forces a blocked release decision.

## Rationale

Release control is the last media review boundary before future promotion. It
must not flatten a storage mismatch into a generic evidence warning or let a
complete rights packet bypass the storage decision.

## Consequences

- Release-control review remains traceable to one storage decision.
- Promotion, writes, activation, student use, and QR mutation remain blocked.
- No media bytes or learner data are written by this binding.

## References

- `packages/content-model/src/localBundleMediaReleaseControlBinding.ts`
- `packages/content-model/src/localBundleMediaManifestReconciliation.ts`
- `docs/adr/1154-local-media-evidence-storage-identity.md`
