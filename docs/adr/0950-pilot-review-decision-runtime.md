# ADR 0950: Pilot Review Decision Runtime Verification

Status: Accepted

## Context

Static markers and typecheck prove that the snapshot adapter is shaped
correctly, but they do not prove that malformed or cross-tenant inputs fail
closed at runtime.

## Decision

Run an executable TypeScript-compiled rehearsal that covers valid review-only
operation, wrong-tenant access, fingerprint tampering, activation blocking,
and no-side-effect results.

## Consequences

- Provider-neutral persistence behavior has runtime evidence before a provider
  is selected.
- Future provider adapters must preserve the same fail-closed behavior.
- Passing the rehearsal never authorizes production writes or launch.

## Verification

- `node scripts/verify-pilot-review-decision-snapshot-runtime.mjs`
- `npm run verify:foundation-composition`
