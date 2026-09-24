# ADR 1157: Evidence Storage Handoff Preflight Identity

Status: Accepted for the review-only foundation runtime

## Decision

Evidence storage handoff bindings must carry the exact storage-selection
preflight identity used by the package handoff and evidence reconciliation,
alongside the evidence-storage gate identity.

## Rationale

The storage gate alone identifies a policy boundary but not the specific
provider-neutral comparison that produced it. Carrying both identities keeps
the packet auditable and prevents a stale handoff from being reused.

## Consequences

- Package, binding, and reconciliation identity must agree.
- The handoff remains review-only and side-effect free.
- No upload, download, promotion, activation, signed approval, or release
  mutation is enabled.

## References

- `packages/content-model/src/evidenceAttachmentStorageHandoff.ts`
- `packages/content-model/src/evidencePacketHandoff.ts`
- `docs/adr/1156-evidence-attachment-storage-identity.md`
