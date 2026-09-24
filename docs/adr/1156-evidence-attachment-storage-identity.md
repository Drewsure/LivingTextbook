# ADR 1156: Evidence Attachment Storage Identity

Status: Accepted for the review-only foundation runtime

## Decision

Evidence attachment storage reconciliation must carry the exact storage
selection preflight and evidence-storage gate identities used by the package
storage review. Evidence handoff validation must compare those identities
before the packet can be considered structurally complete.

## Rationale

Evidence packets are the bridge between upload intake and media/package
release. A binding ID alone is not enough to prove that an attachment belongs
to the reviewed storage decision.

## Consequences

- Attachment coverage remains traceable to one provider-neutral decision.
- Upload, download, promotion, signed approval, activation, and release
  mutation remain blocked.
- The reconciliation remains metadata-only and side-effect free.

## References

- `packages/content-model/src/evidenceAttachmentStorageReconciliation.ts`
- `packages/content-model/src/evidencePacketHandoff.ts`
- `docs/adr/1155-local-media-release-control-storage-identity.md`
