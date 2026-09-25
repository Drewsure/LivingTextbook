# ADR 1197: SQLite Provider Cache Lifecycle

## Decision

When the configured progression database path changes, the cached SQLite store
must be closed before a new store is created. The provider adapter remains
provider-neutral and keeps the existing explicit configuration boundary.

## Why

Local closed deployments, controlled rehearsals, and process configuration can
change the database path between runs. Leaving the previous connection open
can leak file handles and leave stale WAL resources alive on Windows.

## Consequences

- Reconfiguration is deterministic and safe for local deployment rehearsals.
- Existing records remain on their original database and are not copied.
- The foundation conformance check guards the lifecycle behavior.
