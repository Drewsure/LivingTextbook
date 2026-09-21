# Build Session: Persistence Deployment Gate Route Alignment

## Goal

Make the first hosted persistence smoke path agree across status, student
session issuance, progression writes, and progress-event writes.

## Change

Added a shared server-only deployment-gate snapshot. It composes the selected
provider, explicit durable-write approval, signed student-session boundary,
tenant-scoped teacher boundary, school policy, retention policy, release
approval, and operational readiness.

Student session issuance now returns rehearsal-only for process-memory and
fails closed for a blocked SQLite deployment. Durable progression and event
writes return the same gate blockers before checking identity authorization.
Authenticated session reads report the configured provider and durability
instead of always claiming SQLite durability.

## Boundary

This remains review-only foundation work. It does not enable durable writes,
create credentials, widen tenant access, or import the frozen Z.ai/Phaser
source.

## Verification

- `node scripts/verify-persistence-deployment-gate-alignment.mjs`
- persistence runtime/read authorization verification
- web typecheck
- production build
- active route verification
