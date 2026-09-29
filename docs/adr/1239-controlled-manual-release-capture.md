# ADR 1239: Controlled Manual Release Capture

## Decision

Add a disabled-by-default operator route that creates an immutable manual
release receipt from a fully validated delivery manifest and then delegates to
the existing custody-bound metadata writer.

## Required controls

The route requires the dedicated delivery token, an explicit release-capture
feature flag, a valid manifest, a named reviewer and role, a valid review time,
a rollback reference, and a bounded operator identity. It validates the
receipt before any filesystem operation.

## Safety boundary

The route writes no raw publisher files, does not mutate QR aliases, does not
select a persistence provider, and does not activate student-facing routes.
Conflicts remain immutable and blocked. Package assembly remains a separate
future operation with its own asset-copy and rollback contract.
