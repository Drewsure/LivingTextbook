# 2026-07-16: School Rollback Safe Fallback Preflight

## Added

- Read-only safe fallback preflight data contract.
- Teacher/admin panel for child-safe copy, school communication, printed QR fallback, local companion fallback, media playlist fallback, and assignment/report policy checks.
- Route wiring for teacher intake, classroom launch gate, and school policy handoff.
- Release-control and active-route verifier coverage.

## Boundary

The preflight is not an activation workflow. It cannot mutate routes, send notifications, shut down classrooms, deactivate local bundles, replace media, reassign students, export reports, or change learner-data state.
