# 2026-07-13: Upload Promotion Storage Contract

## Summary

Added the backend-neutral storage contract for upload promotion gates.

## Why

Reviewed uploads still need target-specific storage gates before they can create drafts, game assets, media playlists, local bundles, or assignments.

## Build Notes

- Added the shared `upload-promotion` persistence category.
- Added hosted and local adapter write intents.
- Added vendor-neutral schema, migration candidate, and migration spec coverage.
- Updated backend storage verification expectations and upload documentation.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:foundation`
