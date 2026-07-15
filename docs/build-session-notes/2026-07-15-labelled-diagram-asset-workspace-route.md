# 2026-07-15: Labelled Diagram Asset Workspace Route

## Summary

Added a teacher-only Labelled Diagram asset workspace route for a reviewed image candidate.

## Why

Uploaded images need a governed game-asset landing zone before live file inputs, image editors, coordinate editors, or student-facing Labelled Diagram games are implemented.

## Changed

- Added a sample Labelled Diagram asset workspace data model.
- Added a teacher/admin route at `/teacher/assets/labelled-diagram/sample-publisher-l1-u1-labelled-diagram`.
- Added a structural workspace panel for manifest, anchor, audio, support-language, packet, and blocked-action review.
- Added route helper, navigation, partner-demo link, active route matrix, and verification coverage.

## Verification

- `npm run verify:upload-channels`
- `npm run verify:foundation`
