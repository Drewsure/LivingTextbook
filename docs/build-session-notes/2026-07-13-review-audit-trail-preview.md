# 2026-07-13: Review Audit Trail Preview

## Summary

Added a preview-only review audit trail to the teacher draft review queue.

## Why

The review queue needs accountability before live reviewer actions exist. Teachers and tenant reviewers should see the future sequence of review events without confusing preview data for stored approvals.

## Build Notes

- Added audit trail preview events to the sample teacher draft review queue.
- Rendered the audit trail on `/teacher/review`.
- Kept all live state transitions, approvals, publishing, evidence upload, and student assignment blocked.
- Updated route, teacher-authoring, build-session, ADR, and decision-register documentation.

## Verification

- `npm run verify:teacher-authoring`
- `npm run verify:foundation`
