# Build Session Note: Disabled Upload Intake Controls

## What Changed

- Added a disabled upload intake control preview to `/teacher/uploads/sample-publisher`.
- The preview shows selected-file state, required source metadata, scan policy, target mapping, accepted extensions, and blocked file-selection/intake-record actions.
- Verification now checks that the route states `No file input element`, `Select file blocked`, and `Create intake record blocked`.

## Verification Intent

This gives the future upload UI a concrete shape while keeping the foundation honest: no real file picker, no drag-and-drop, no storage write, no scan, no upload record creation, and no student-facing promotion.
