# Build Session: Tenant-Scoped Browser Evidence Key

## Goal

Prevent local browser rehearsal records from colliding across white-label
tenants that reuse launch codes.

## Change

The evidence storage key now includes encoded tenant, package, launch, and
student-session identity. Reads verify the embedded record against that same
lookup, and teacher review uses the scoped lookup directly.

The browser evidence version moved to `3`; old launch-only records are stale
and are not migrated into the new scope.

## Boundary

This improves local rehearsal isolation only. It does not enable hosted
persistence, student accounts, export, assignment, or release behavior.

## Verification

- `node scripts/verify-local-evidence-tenant-key.mjs`
- Persistence and runtime verification
- AI-service and web typechecks
- Production build
- Full foundation gate
