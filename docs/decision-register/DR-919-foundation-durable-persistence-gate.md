# DR-919: Foundation Durable Persistence Gate

## Decision

Add durable progression, recovery operations, teacher operations authorization,
and cross-route persistence verification to the canonical foundation gate.

## Included

- SQLite tenant-scoped persistence and idempotent writes.
- Server-owned policy and signed student-session boundaries.
- Backup, restore, retention deletion, checksums, integrity, and tamper-evident
  operation evidence.
- Separate tenant-scoped teacher review authorization.
- Cross-route progression handoff and gated hosted reads/writes.

## Excluded

Cloud vendor selection, automatic production activation, unrestricted writes,
raw learner audio, transcripts, and student-facing authorization bypasses.

See ADR 0847 and
`docs/verification/FOUNDATION_DURABLE_PERSISTENCE_CHECKS.md`.
