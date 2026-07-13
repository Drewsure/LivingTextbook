# 2026-07-13: Reviewer Decision Storage Contract

## Summary

Added the backend-neutral storage contract for teacher draft reviewer decisions.

## Why

Disabled decision previews need a future durable audit shape before return-for-edits, needs-audio, or ready-for-approval can become real workflow actions.

## Build Notes

- Added the shared `teacher-draft-review-decision` persistence category.
- Added hosted and local adapter write intents.
- Added vendor-neutral schema, migration candidate, and migration spec coverage.
- Updated backend storage verification expectations and authoring documentation.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:foundation`
