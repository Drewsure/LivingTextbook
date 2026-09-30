# ADR 1317: Tenant-Empty Release-Control Boundary

## Status

Accepted for the white-label pilot foundation.

## Decision

The tenant-scoped release-control route must resolve the requested tenant and
show a governed empty state when no tenant-specific release candidate exists.
The Sample Publisher release room remains visible only for the Sample Publisher
tenant and its reference package. Empty tenants must not inherit that package's
release evidence, QR identities, or approval records.

## Consequences

- A real publisher can reach the release workspace as part of the full
  intake-to-release journey before its package exists.
- Reference release data cannot be mistaken for a new publisher's evidence.
- Release actions remain blocked until package, rights, QR, delivery, policy,
  rollback, and human approval gates are complete.
