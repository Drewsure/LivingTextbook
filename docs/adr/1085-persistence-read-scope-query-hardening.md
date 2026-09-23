# ADR 1085: Persistence Read-Scope Query Hardening

## Status

Accepted and implemented on `legacy-source-import`.

## Context

Persistence GET routes were tenant-authorized, but individual query strings
and operation-history limits were not consistently bounded before auth or
storage work. A white-label service must keep untrusted read scopes bounded
across tenants and providers.

## Decision

Provide shared `readBoundedQueryParam` and `readBoundedQueryLimit` helpers in
the request boundary module. Apply them to progression, event, status,
operation-evidence, and local-handoff reads. An invalid or oversized result
returns `400` before authorization, adapter access, or report aggregation.

## Consequences

- Read routes have predictable resource and identity-scope limits.
- Tenant authorization remains the authority after query validation.
- The operation-history endpoint cannot request an unbounded list.
- Future persistence GET routes must use the same helpers and verifier contract.

## Verification

Run `npm run verify:persistence-runtime`, then the full `npm run verify:foundation`
gate before publishing persistence read changes.
