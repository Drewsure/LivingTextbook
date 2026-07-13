# 2026-07-13: Draft Review Handoff Preview

## Summary

Added a read-only review handoff preview to the teacher draft package route.

## Why

Teacher authoring needs a visible bridge from local draft editing into future verifier/human review, but the current foundation must not imply that live submit, publish, assignment, audio regeneration, or package approval exists.

## Build Notes

- The preview shows schema, source lineage, audio coverage, rights/version, route/activity, and approval packets.
- Review packet submission is blocked.
- Student assignment remains blocked.
- Direct AI publish remains blocked.

## Verification

- `npm run verify:teacher-authoring`
- `npm run verify:foundation`
