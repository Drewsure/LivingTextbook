# 2026-07-16: School Rollback Safe Fallback Activation Preview

## Added

- Review-only future safe fallback activation record data.
- Teacher/admin panel for minimum activation fields, not-activated markers, blocked actions, and review rules.
- Route wiring for teacher intake, classroom launch gate, and school policy handoff.
- Release-control and active-route verifier coverage.

## Boundary

The preview is not an activation workflow. It cannot mutate releases or QR routes, send notifications, shut down classrooms, deactivate local bundles, replace media, export reports, or reassign students.
