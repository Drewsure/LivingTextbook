# ADR 0930: Package Readiness Source Lineage Binding

Status: Accepted for review-only foundation

## Decision

Package readiness reconciliation must carry the exact source-assembly checksum
that produced its candidate packet. The same checksum must be preserved in
hosted and local metadata-preview persistence intents.

## Required invariants

- A reconciliation includes `sourceAssemblyPacketId` and a canonical
  `sourceAssemblyChecksum`.
- The checksum uses `sha256:` followed by exactly 64 hexadecimal characters.
- Metadata-preview persistence preserves the checksum as evidence-lane scope.
- The checksum is evidence of lineage only; it never authorizes package
  promotion, storage writes, route activation, or student assignment.

## Consequence

Reviewers can detect a stale or substituted source assembly before package
release evidence is considered complete, while hosted and closed-local paths
remain provider-neutral and write-blocked.
