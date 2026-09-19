# DR-950: Persistence Review-Probe Provider Parity

## Decision

Use the declared access purpose as the authorization boundary for hosted
progression reads. Teacher review probes use tenant-scoped teacher authorization;
student continuity reads use the matching learner session boundary.

## Required Invariants

- A teacher probe never requires a learner cookie solely because the selected
  provider is durable SQLite.
- A student continuity read never falls back to teacher authorization.
- Tenant, package, launch, and student-session identity remain validated before
  a record is returned.
- Browser clients distinguish blocked, unauthorized, not-found, unavailable,
  conflict, and transport-error states.
- This decision adds no student-data write, export, activation, or release
  mutation behavior.

## Evidence

- `apps/web/src/app/api/persistence/progression/route.ts`
- `apps/web/src/features/persistence/hostedProgressionPersistenceClient.ts`
- `scripts/verify-persistence-read-authorization.mjs`
