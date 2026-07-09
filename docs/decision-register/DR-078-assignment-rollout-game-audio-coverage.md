# DR-078: Assignment Rollout Game Audio Coverage

## Decision

Add game audio coverage as an assignment rollout scheduling gate.

## Rationale

Rollout is where a reviewed assignment becomes a scheduled class or partner pilot. Game audio coverage should be visible at this scheduling layer so missing learner audio cannot be bypassed after assignment readiness.

## Consequences

- Demo and front-door rollout plans show game audio coverage as passing.
- The local companion draft shows game audio coverage as still under review.
- Scheduling remains blocked when local/offline game audio coverage is incomplete.

## Non-Goals

- Backend writes.
- Raw audio storage.
- New game implementation.
- Premium polish.
