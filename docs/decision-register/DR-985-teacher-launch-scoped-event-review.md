# DR-985: Teacher Launch-Scoped Event Review

## Decision

Provide teachers with a read-only, launch-scoped list of validated progress
event streams so the session monitor can evolve from exact-record probes to a
class-launch review model.

## Rationale

Teacher reporting needs a bounded class view, but a general tenant-wide event
query would be too broad for the current pilot foundation. The launch code is
the smallest useful review scope and preserves the existing privacy boundary.

## Required Invariants

- Teacher authorization is checked before listing.
- Tenant, package, and launch code are mandatory.
- Student reads continue to require an exact student session identity.
- Invalid or taxonomy-mismatched stored records are omitted rather than
  presented as trustworthy evidence.
- No raw learner audio or transcript data is added to the response.

## Evidence

- ADR 0913
- `apps/web/src/app/api/persistence/events/route.ts`
- `apps/web/src/server/persistence/progressionPersistenceAdapter.ts`
