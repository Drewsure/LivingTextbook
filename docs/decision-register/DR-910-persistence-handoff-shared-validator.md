# DR-910: Persistence Handoff Shared Validator

## Decision

Move the persistence handoff packet schema and validation rules into the shared
content model and expose validator findings on the teacher persistence
workbench.

## Included

- Shared packet types and review-only invariants.
- Required tenant-bound category coverage rows.
- Visible validator findings when coverage is incomplete.
- Runtime marker verification for the shared contract.

## Excluded

Provider selection, storage writes, migrations, exports, backups, restores,
policy acceptance, and live student data.

See ADR 0838 and
`docs/verification/PERSISTENCE_HANDOFF_PACKET_CHECKS.md`.
