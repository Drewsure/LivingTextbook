# ADR 0833: Unauthorized Operations Privacy Parity

## Status

Accepted for foundation hardening.

## Context

The persistence status endpoint withheld deployment diagnostics from anonymous
callers, but the operation-history endpoint still returned the selected
provider in its unauthorized response. Even without learner records, that
revealed deployment information before teacher authorization.

## Decision

Return only the generic unauthorized status, empty records, errors, and safe
privacy copy from the unauthorized operation-history branch. Provider and
durability details remain available only after tenant-scoped teacher
authorization.

## Consequences

- Anonymous callers cannot fingerprint the persistence provider through either
  diagnostics endpoint.
- Authorized teacher review remains read-only and metadata-only.
- Future operations endpoints must copy the same fail-closed response shape.
