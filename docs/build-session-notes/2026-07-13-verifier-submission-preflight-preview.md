# 2026-07-13: Verifier Submission Preflight Preview

## Summary

Added a preview-only verifier submission preflight to the teacher draft review queue.

## Why

The review queue needs to show what a real verifier workflow would check before any draft can leave preview review.

## Build Notes

- Added preflight checks for schema, audio regeneration, support-language boundaries, route compatibility, and evidence readiness.
- Rendered the preflight on `/teacher/review`.
- Kept automatic verifier submission, package approval, publishing, and student assignment blocked.
- Updated route, teacher-authoring, build-session, ADR, and decision-register documentation.

## Verification

- `npm run verify:teacher-authoring`
- `npm run verify:foundation`
