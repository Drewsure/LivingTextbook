# 2026-07-14: Draft Content Entry Workbench Preview

## What Changed

- Added a disabled content-entry workbench preview to the sample teacher draft route.
- Exposed the future teacher authoring surface: title, instruction, sided cards, front/back rows, audio cue requirements, image upload positions, formatting, row actions, add item, AI draft help, flip tiles, item limits, and Done.
- Kept all actions preview-only: no save, upload, file picker writes, AI publish, template switch, assignment, or Done-to-student routing.

## Verification

- `npm run verify:teacher-authoring` must check the workbench route text.
- `npm run verify:foundation` must keep the route-level checks green.
