# Build Session: Returned Package Request Lineage

## Goal

Close the identity gap between the prototype intake queue, return checklist,
returned package manifest, and later evidence bundle.

## Delivered

- Added generation `requestId` to prototype intake queue items and return
  checklist records.
- Required returned-package alignment to match request identity against both
  the checklist and original intake queue item.
- Updated sample returned manifests to use the originating generation request
  rather than an unrelated package-preview identifier.
- Exposed request identity on teacher review surfaces.
- Added negative runtime coverage for checklist and intake request mismatches.

## Boundary

This is evidence-chain hardening only. It does not import Z.ai/Phaser source,
create routes, enable live AI dispatch, change scoring, or authorize student
assignment.

## Verification

- `node scripts/verify-runtime-behavior.mjs`
- `node scripts/verify-prototype-review-readiness.mjs`
- `npm run typecheck --workspace @living-textbook/web`
