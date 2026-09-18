# DR-935: Local Bundle Handoff Review Access

## Decision

Protect future local handoff record review behind a tenant-, bundle-, and
packet-scoped teacher-review request and the existing teacher persistence
authorization seam.

## Required Invariants

- Access mode is exactly `teacher-review`.
- The request is explicitly non-student-facing.
- Teacher claims must have the persistence-read scope and matching allowed
  tenant.
- Missing provider configuration returns blocked with no records.
- No package, media, filesystem, database, redirect, or student route is
  touched by the route.

## Verification

`node scripts/verify-local-bundle-handoff-review-access.mjs` checks the shared
contract, route, and authorization markers. It runs from local bundle
readiness and the full foundation gate.

See ADR 0863 and
`docs/adr/0863-local-bundle-handoff-review-access.md`.
