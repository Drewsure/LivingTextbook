# DR-273: Teacher Assignment Rollout Storage Contract

Date: 2026-07-17

## Decision

Create a backend-neutral storage contract for `teacher_assignment_rollout_gate`.

## Rationale

Assignment rollout is the point where a reviewed assignment can be mistaken for a scheduled pilot. The storage contract keeps rollout status, gate evidence, blockers, and scheduling copy durable while blocking live classroom behavior.

## Guardrails

- Hosted and local implementations must preserve the same rollout gate vocabulary.
- Rollout gate records do not schedule classes.
- Rollout gate records do not launch students.
- Rollout gate records do not collect real learner data.
- Rollout gate records do not export teacher reports.
- Support-language activity cannot satisfy target-language progression.

## Verification

`npm run verify:backend-storage` and `npm run verify:foundation` must pass after assignment rollout storage changes.
