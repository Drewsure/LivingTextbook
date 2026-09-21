# ADR 0902: Non-Blank Browser Evidence Identity

## Status

Accepted

## Decision

The browser rehearsal adapter must reject blank package, tenant, unit, launch,
student-session, timestamp, progression, and event identity strings. Primitive
type correctness alone is not enough to admit local evidence.

## Consequences

- Empty or whitespace-only records cannot appear as valid teacher evidence.
- The guard stays provider-neutral and browser-local.
- This does not authorize hosted persistence, export, assignment, or release.

## Verification

Run `node scripts/verify-local-evidence-tenant-key.mjs`,
`node scripts/verify-local-evidence-runtime.mjs`, the persistence and runtime
checks, web typecheck, production build, and the full foundation gate.
