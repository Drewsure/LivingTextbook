# ADR 1111: Deployment Handoff Release-Readiness Binding

## Decision

Require the commercial deployment handoff to carry the tenant/package-scoped
white-label release-readiness identity, status, and unresolved phase blockers.

## Rationale

A continuity and activation packet can describe a deployment path without
proving that browser, privacy, tenant-isolation, package, pilot, or
accessibility evidence is complete. Binding release readiness prevents a
commercial recommendation from hiding those unresolved conditions.

## Consequences

- Every hosted, local, and packaged handoff artifact inherits the same release
  blocker set.
- Release evidence remains separate from provider selection and activation.
- A blocked release record keeps the handoff review-only even when one path is
  recommended for a future pilot.

## Verification

- `node scripts/verify-runtime-behavior.mjs`
- `npm run verify:routes`
- Full foundation verification before publication.
