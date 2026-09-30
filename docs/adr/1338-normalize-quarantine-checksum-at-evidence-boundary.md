# ADR 1338: Normalize Quarantine Checksum At Evidence Boundary

## Status

Accepted for the foundation and pilot-review track.

## Decision

When quarantine storage provides a raw hexadecimal SHA-256 checksum, the live
source-to-package evidence binding must normalize it to the shared canonical
`sha256:<64 hex>` representation before constructing or validating the bridge.
Already-prefixed values must remain unchanged.

## Rationale

Storage and content-model contracts have different responsibilities. Storage
can retain the compact digest, while cross-system evidence records need an
explicit algorithm label. Normalizing at the boundary preserves both contracts
and prevents a real publisher submission from disappearing from the evidence
bridge because of representation drift.

## Consequences

- Source lineage remains checksum-continuous from intake through handoff.
- The content-model validator stays strict and useful.
- The publisher intake rehearsal proves the normalization, tenant isolation,
  payload exclusion, and blocked activation behavior.
- No source bytes, paths, or credentials are exposed by the normalization.
