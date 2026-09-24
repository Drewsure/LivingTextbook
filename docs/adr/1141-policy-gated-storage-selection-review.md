# ADR 1141: Policy-Gated Storage Selection Review

Status: Accepted for the review-only foundation runtime

## Decision

Carry the existing provider-neutral persistence selection preflight into the
tenant evidence handoff as a storage selection review packet. The packet
compares hosted, closed-local, and hybrid deployment candidates against cost,
tenant isolation, retention, deletion/export, backup, rollback, and operating
responsibility evidence.

The packet is not a provider decision. It must remain blocked until human
tenant policy review is complete, and it must keep provider selection,
migration, writes, activation, uploads, downloads, signed URLs, and release
mutation disabled.

## Rationale

Storage readiness and attachment reconciliation show what could be supported,
but a tenant needs one bounded comparison before a future implementation work
order can be approved. Reusing the persistence preflight prevents a second
provider-selection taxonomy from emerging while the handoff binds the review
to the exact tenant, package, and evidence storage gate.

## Consequences

- Reviewers can compare practical white-label deployment paths in one evidence
  packet without accidentally selecting a vendor or destination.
- The same policy and cost questions apply to durable progress records and
  evidence/media attachment storage.
- Provider-specific implementation remains a later, human-approved phase.

## References

- `packages/content-model/src/evidencePacketHandoff.ts`
- `packages/content-model/src/persistenceProviderSelectionPreflight.ts`
- `apps/web/src/features/evidence/EvidencePacketHandoffPanel.tsx`
- `scripts/verify-evidence-storage-selection-review.mjs`
