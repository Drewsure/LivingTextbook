# 2026-07-13: Reviewer Decision Preview

## Summary

Added disabled reviewer decision previews to `/teacher/review`.

## Why

The review queue needs to show how reviewer outcomes will work without implying live approval, publish, or assignment exists.

## Build Notes

- Added `Return for edits`, `Needs audio`, and `Ready for approval` outcome previews.
- Added evidence requirements and blockers for each outcome.
- Kept decision actions disabled.
- Updated authoring and active-route verification.

## Verification

- `npm run verify:teacher-authoring`
- `npm run verify:foundation`
