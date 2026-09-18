# DR-911: Persistence Handoff Behavior Verification

## Decision

Extend the runtime behavior harness with persistence handoff tests for valid
review-only packets, provider injection, and missing tenant-bound coverage.

## Included

- Functional shared-validator coverage.
- Provider-neutral and no-side-effect assertions.
- Missing-category failure evidence.

## Excluded

Provider activation, durable writes, migrations, exports, backups, restores,
policy acceptance, and live student data.

See ADR 0839 and
`docs/verification/PERSISTENCE_HANDOFF_PACKET_CHECKS.md`.
