# ADR 0830: Persistence Operations Diagnostics Authorization

## Status

Accepted for foundation hardening.

## Context

The persistence status endpoint reports provider, durability, schema, journal,
retention, session-boundary, and evidence-chain state. Although it returns no
learner records, those details are still deployment and operations information
that should not be publicly probeable.

## Decision

Require a tenant identifier and the expiring tenant-scoped teacher review
session before returning status diagnostics. Return only a generic protected
response otherwise. Keep the status surface read-only and separate from every
operation that can mutate data or deployment state.

## Consequences

- Anonymous users cannot fingerprint the persistence provider or deployment
  readiness.
- The teacher workbench must authenticate before it can display diagnostic
  facts.
- Provider-neutral and review-only behavior remains intact.
