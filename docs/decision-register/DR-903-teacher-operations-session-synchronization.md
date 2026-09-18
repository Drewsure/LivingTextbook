# DR-903: Teacher Operations Session Synchronization

## Decision

Synchronize the teacher persistence workbench's read-only panels after a
tenant-scoped teacher review session changes. Use a browser event containing
only the tenant identifier; keep the server cookie and authorization checks as
the sole source of access.

## Included

- Sign-in and sign-out notifications from the teacher access panel.
- Automatic refresh of persistence status and operation-history panels for the
  matching tenant.
- No refresh or data disclosure for a different tenant.

## Excluded

- Review-code or token transport through the event.
- Durable writes, backup, restore, deletion, export, classroom launch, or
  provider selection.

See ADR 0831 and
`docs/verification/PERSISTENCE_READ_AUTHORIZATION_CHECKS.md`.
