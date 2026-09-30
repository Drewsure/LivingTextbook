# ADR 1351: Publisher Source Preflight Fingerprints

Date: 2026-10-01
Status: Accepted

## Decision

Every publisher source preflight report must carry two explicit SHA-256
fingerprints:

- `manifestChecksumSha256`: the bytes of `publisher-source-manifest.json`.
- `inventoryChecksumSha256`: a deterministic hash of the sorted observed file
  metadata, including asset identity, relative path, existence, size, file
  checksum, and detected type.

The fingerprints are evidence for later source-review reconciliation. They do
not authorize quarantine writes, promotion, package assembly, QR printing,
hosted persistence, learner records, or student use.

## Rationale

Per-file checksums prove the files that were seen, but a publisher can change
the manifest or add/remove files while retaining the same package identifiers.
The two aggregate fingerprints make that drift visible without copying source
payloads into the application. A changed fingerprint means a new source
submission and requires a new preflight.

## Consequences

- The teacher intake panel can show the exact evidence identifiers that must
  travel with the later review packet.
- The preflight remains local, deterministic, and side-effect-free.
- Rights, accessibility, source review, audio, game, delivery, release, QR,
  persistence, and student gates remain independent.

