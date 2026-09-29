# ADR 1236: Pilot Delivery Release Receipt

## Decision

Introduce a side-effect-free manual release receipt between the governed pilot
delivery manifest and any future package writer. The receipt is tenant- and
package-scoped and binds the exact source checksum to a named reviewer, review
timestamp, release decision, QR-print decision, and rollback reference.

## Why

The first saleable pilot needs an auditable handoff boundary. A manifest can
show that package, game, audio, QR, local, hosted, policy, and release lanes
agree, but it should not imply that a human has approved the handoff or that a
writer has executed. Separating those decisions protects publishers, schools,
students, and white-label tenant data.

## Constraints

- The current sample receipt remains blocked.
- Approval and QR printing are separate decisions.
- Receipt creation has no filesystem, route, playlist, QR, persistence, or
  learner-data side effects.
- A future writer must re-check the manifest checksum, tenant authorization,
  custody snapshot, post-write verification, and rollback reference.

## Verification

Run `node scripts/verify-pilot-delivery-release-receipt.mjs`, web typecheck,
production build, route verification, and the full foundation composition suite.
