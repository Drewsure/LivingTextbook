# ADR 0690: Shared Next Recommended Mode Policy

## Status

Accepted

## Context

The launch, front-door, flashcard, and progress-summary surfaces each need to
show the next curated activity. Reading the first item in the recommendation
array directly caused a completed activity to be offered again, even though
later activities were available.

## Decision

Use `getNextUncompletedRecommendedMode` as the shared web policy. It searches
the tenant's ordered, reviewed recommendation list and returns the first mode
not present in `completedGameModes`. When a current mode is supplied, it keeps
the existing completion-card behavior by searching after that mode and then
wrapping to earlier recommendations.

Unlock state remains a separate check. A mode can be the next recommended
choice while still locked until entry practice or another policy grants access.
Training Academy source selection remains separate because recovery chooses the
mode that generated the recovery recommendation, not necessarily the next
student activity.

## Consequences

- Completed activities advance consistently across all current entry surfaces.
- Recommendation ordering stays tenant-configurable and data-driven.
- Unlock authority remains in progression state rather than in the display
  helper.
- Future Phaser or external wrappers can consume the same ordering contract
  after their integration boundary is approved.

## Verification

- Canonical integration verification requires the shared policy in all current
  student-facing progression surfaces.
- Web typecheck, production webpack build, and active route verification must
  pass after changes to this policy.
