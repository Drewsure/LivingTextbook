# Build Session: Canonical-Identity Browser Evidence Key

## Goal

Prevent local browser rehearsal records and their event histories from
colliding across white-label tenants, units, launches, and student sessions.

## Change

The evidence storage key now includes encoded tenant, package, launch, unit,
and student-session identity. Reads verify the embedded record against that
same lookup. Progression identity and every event's unit, launch,
student-session, and tenant metadata are checked before merge, and teacher
review uses the scoped lookup directly.

The browser evidence version moved to `4`; pre-v4 records are stale and are
not migrated into the new scope.

## Boundary

This improves local rehearsal isolation only. It does not enable hosted
persistence, student accounts, export, assignment, or release behavior.

## Verification

- `node scripts/verify-local-evidence-tenant-key.mjs`
- Persistence and runtime verification
- AI-service and web typechecks
- Production build
- Full foundation gate
