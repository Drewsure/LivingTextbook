# 2026-07-13: Draft Review Handoff Storage Contract

## Summary

Added the backend-neutral storage contract for teacher draft review handoff packets.

## Why

Teacher authoring needs a future submit-for-review path, but the current foundation must not imply live submission, publish, assignment, or verifier workflow exists.

## Build Notes

- Added the shared `teacher-draft-review-handoff` persistence category.
- Added hosted and local adapter write intents.
- Added vendor-neutral schema, migration candidate, and migration spec coverage.
- Updated backend storage verification expectations and documentation.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:foundation`
