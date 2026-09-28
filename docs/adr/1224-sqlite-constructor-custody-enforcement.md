# ADR 1224: SQLite Constructor Custody Enforcement

**Status:** Accepted  
**Date:** 2026-09-29

## Context

The deployment gate validates the configured SQLite path before durable writes
are allowed. The store constructor is also a server-side boundary, however,
and could previously be called directly with an arbitrary filesystem path.
That left a lower-layer bypass for future routes, jobs, or provider adapters.

## Decision

`SqliteProgressionStore` must validate its resolved database path against the
configured data custody root before creating directories or opening SQLite.
Direct construction therefore uses the same realpath-aware policy as the
deployment gate and rejects missing roots, unsafe paths, and filesystem
escapes.

## Consequences

- Lower-level callers cannot bypass database custody by constructing the store
  directly.
- Conformance tests must provision an explicit temporary data root.
- This strengthens the boundary without enabling durable writes, provider
  selection, or learner-data collection.

## Verification

Run `node scripts/verify-persistence-provider-conformance.mjs`,
`npm run verify:persistence-runtime`, and
`npm run verify:foundation-composition`.
