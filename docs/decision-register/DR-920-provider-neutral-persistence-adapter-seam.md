# DR-920: Provider-Neutral Persistence Adapter Seam

## Decision

Put process-memory rehearsal and server-only SQLite progression persistence
behind one provider-neutral server adapter seam.

## Included

- Explicit provider and durability types.
- Central provider selection helper.
- Adapter-owned reads, writes, idempotency, and rehearsal state.
- Route independence from the concrete SQLite implementation.
- Shared provider selection for progression, status, and operations routes.

## Excluded

Cloud vendor selection, provider credentials, browser-controlled provider
selection, unrestricted durable writes, and student-data policy approval.

See ADR 0848 and
`docs/verification/PERSISTENCE_ADAPTER_SEAM_CHECKS.md`.
