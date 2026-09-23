# ADR 1105: Asset Evidence Binding

Status: Accepted for the review-only foundation runtime

## Decision

Asset evidence packets must bind the validated asset file boundary to the
review record. Each attachment carries tenant scope, asset identity, source
lineage, kind, MIME type, positive byte length, checksum, review status, and
explicit blocked side effects. Representative Labelled Diagram and media
review flows expose these fields to teacher reviewers.

The packet is metadata-first. It does not carry raw bytes, storage URLs, or
download links, and it cannot authorize upload, storage, download, playlist
creation, game-manifest mutation, promotion, assignment, or student-facing use.

## Rationale

The platform needs one reliable handoff between future file intake and the
existing evidence/review system. Keeping asset metadata in a typed packet
prevents later adapters from accepting an unscoped file or treating a review
preview as a stored object. It also gives hosted, local, and hybrid tenants a
provider-neutral contract.

## Consequences

- Teacher review surfaces can inspect the same metadata that future adapters
  must enforce.
- Tenant mismatch and malformed file metadata fail closed before storage.
- Real upload and storage work remains a later, separately gated phase.

## References

- `packages/content-model/src/assetEvidencePacket.ts`
- `apps/web/src/data/sampleAssetEvidencePacket.ts`
- `docs/verification/CONTENT_INTAKE_CHECKS.md`
