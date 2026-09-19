# Build Session: Evidence Bundle Returned Manifest Binding

## Goal

Make the prototype evidence packet prove identity against the actual returned
package manifest, not only against review and replay records.

## Delivered

- Added the returned package manifest to the shared evidence alignment bundle.
- Reused the returned manifest validator inside evidence alignment.
- Required tenant and generation request identity to match the return review.
- Rejected duplicate returned manifest IDs in alignment collections.
- Added runtime coverage for a cross-request returned manifest.

## Boundary

This remains a review-only evidence gate. It does not import Z.ai/Phaser code,
create routes, enable live AI, mutate scoring, or assign students.

## Verification

- `node scripts/verify-runtime-behavior.mjs`
- `npm run typecheck --workspace @living-textbook/web`
