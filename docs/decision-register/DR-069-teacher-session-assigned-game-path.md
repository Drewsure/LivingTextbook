# DR-069: Teacher Session Assigned Game Path

## Decision

Show assigned game modes on the teacher session monitor using the launch session entry and recommended mode list.

## Rationale

Teacher reports need to distinguish assignment scope from completed event history. Showing the assigned path makes it clear which modes are intended for the session even before persistence and live classroom analytics exist.

## Consequences

- Teacher monitor pages now show intended game scope.
- Completion events remain separate from assigned modes.
- Persisted teacher customization is still deferred.

## Non-Goals

- Saving assignment changes.
- Per-student adaptive paths.
- Production analytics.
