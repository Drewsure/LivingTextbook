# DR-270: School Rollback Safe Fallback Restoration Preview

## Decision

Add a review-only future safe fallback restoration record preview.

## Why

Safe fallback planning should include the way back to normal operation. Schools need to see the exact future restoration record fields before any implementation can restore QR routes, local packages, media playlists, reports, or assignment state.

## Guardrails

- No restore normal route button.
- No restoration activated marker.
- No release-state mutation.
- No production QR redirect mutation.
- No live notification.
- No classroom restart workflow.
- No local bundle restoration.
- No report export.
- No media replacement.
- No student reassignment.

## Verification

`npm run verify:release-control` and active route verification must confirm the restoration preview is visible and blocked.
