# 2026-07-13: Review Evidence Packet Preview

## Summary

Added a blocked evidence packet preview to `/teacher/review`.

## Why

Reviewer decisions need evidence, but evidence upload, signature capture, approval, publish, and assignment must remain unavailable until storage and policy gates exist.

## Build Notes

- Added evidence packet requirements to the sample review queue.
- Added an evidence preview section to the review queue panel.
- Updated authoring and active-route verification.

## Verification

- `npm run verify:teacher-authoring`
- `npm run verify:foundation`
