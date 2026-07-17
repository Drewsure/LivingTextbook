# DR-272: Teacher Assignment Rollout Verifier

## Decision

Add a focused verifier for teacher assignment rollout gates and include it in the foundation verification command.

## Why

Assignment rollout is where a reviewed assignment can be mistaken for a scheduled pilot. The verifier keeps MiniStar demo-preview status, sample publisher blocked status, local companion blocked status, media-rights blockers, report-policy blockers, persistence blockers, and game-audio coverage visible before school or partner pilot scheduling language changes.

## Guardrails

- Demo preview is not a scheduled pilot.
- Blocked sample publisher rollout cannot be described as pilot-ready.
- Closed local companion rollout stays blocked until local bundle, storage, QR fallback, and offline audio coverage are reviewed.
- Game audio coverage remains visible before scheduling.
- Route verification must check the teacher intake rollout panel text.

## Verification

`npm run verify:assignment-rollout` and `npm run verify:foundation` must pass after assignment rollout, private assignment, package readiness, or school pilot scheduling copy changes.
