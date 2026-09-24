# ADR 1139: Per-Asset Evidence Packets In Tenant Handoff

Status: Accepted for the review-only foundation runtime

## Decision

The tenant evidence handoff carries the validated metadata-only asset evidence
packets for its reviewed image, audio, video, and other asset candidates. Each
packet remains tenant- and package-bound and is validated through the shared
content-model contract.

The handoff may show attachment identity, source lineage, file kind, MIME
metadata, byte count, checksum, review state, and blockers. It must not carry
raw bytes, storage URLs, downloads, signed URLs, or permission to promote,
release, assign, or expose an asset to students.

## Rationale

Section-level labels are not sufficient to audit a multimedia package. A
reviewer needs to trace every candidate independently while the platform
remains provider-neutral and quarantine-first.

## Consequences

- Labelled Diagram and media review can be reconciled into one tenant handoff.
- Future hosted, local, or hybrid adapters receive explicit evidence identity.
- Real file storage and student-facing activation remain separate gates.

## References

- `packages/content-model/src/assetEvidencePacket.ts`
- `packages/content-model/src/evidencePacketHandoff.ts`
- `apps/web/src/data/sampleEvidencePacketHandoffPackage.ts`
