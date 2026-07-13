# 2026-07-13: Review Evidence Storage Contract

## Summary

Added the backend-neutral storage contract for teacher draft review evidence packets.

## Why

Evidence requirements are visible in the review queue, but uploads and signatures need a durable metadata shape before implementation.

## Build Notes

- Added the shared `teacher-draft-review-evidence` persistence category.
- Added hosted and local adapter write intents.
- Added vendor-neutral schema, migration candidate, and migration spec coverage.
- Updated backend storage verification expectations and authoring documentation.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:foundation`
