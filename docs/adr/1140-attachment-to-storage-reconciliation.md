# ADR 1140: Attachment-To-Storage Reconciliation

Status: Accepted for the review-only foundation runtime

## Decision

Add a tenant/package-bound reconciliation record that joins every reviewed
asset packet and attachment to the provider-neutral storage candidate set.
The record names unresolved policy gates and blocked actions while keeping
hosted, closed-local, and hybrid destinations unselected.

The reconciliation cannot create a provider, bucket, folder, archive, signed
URL, upload, download, promotion, release mutation, assignment, or
student-facing attachment.

## Rationale

Asset evidence and storage readiness need an explicit relationship. Without
one, a future adapter could silently select a destination for one attachment
while the tenant package is still under review.

## Consequences

- Reviewers can see whether every attachment has a policy path to a future
  storage decision.
- Hosted, local, and hybrid deployments remain interchangeable planning lanes.
- Storage activation remains a separate approval and implementation phase.

## References

- `packages/content-model/src/evidenceAttachmentStorageReconciliation.ts`
- `packages/content-model/src/evidencePacketHandoff.ts`
- `apps/web/src/data/sampleEvidenceAttachmentStorageReconciliation.ts`
