# ADR 0699: Teacher Monitor Offer-Map Alignment

## Status

Accepted

## Context

The Level 1 sample unit game offer map now declares Sentence Builder blocked
until a supported curriculum level and reviewed segmentation evidence exist.
The teacher session monitor nevertheless maintained a separate hard-coded list
of completed and unlocked game modes. That created a reporting contradiction:
the student pathway could correctly omit Sentence Builder while the monitor
could still imply that it had been completed.

## Decision

Derive sample monitor progression scope from the tenant-scoped reviewed offer
map. Only ready, non-hidden, non-blocked, non-teacher-only, non-premium offers
may be added to the sample unlocked and completed progression state. Assigned
scope continues to come from the launch session so teacher-controlled modes
remain visible as an assignment decision without granting student progression.

## Consequences

- Teacher reporting and student pathways share one level-aware offer source.
- Blocked or future-level modes cannot appear as completed sample evidence.
- Adding a reviewed game offer updates the sample monitor without a second
  manually maintained mode list.
- This remains review-only sample behavior until persistence and live reporting
  providers are approved.

## Verification

- `npm run verify:canonical-games`
- `npm run verify:report-runtime`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run verify:routes`
