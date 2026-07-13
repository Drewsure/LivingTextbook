# 2026-07-13: Upload Review Storage Contract

## Summary

Added the backend-neutral storage contract for upload review decisions.

## Why

The upload review queue preview needs durable records before live approve, return, rights-request, OCR promotion, image-label promotion, media playlist promotion, or local-bundle promotion workflows can be built.

## Build Notes

- Added the shared `upload-review` persistence category.
- Added hosted and local adapter write intents.
- Added vendor-neutral schema, migration candidate, and migration spec coverage.
- Updated backend storage verification expectations and upload documentation.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:foundation`
