# ADR 0670: Canonical Game Retry Attempts

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Canonical teacher-report evidence must split repeated plays of the same game
mode into separate attempts using the next `game_started` event as the
boundary. Each attempt is validated independently against the shared sequence,
identity, replay, timestamp, and completion rules.

## Rationale

Retries are normal in a classroom and are part of mastery recovery. Combining
two plays into one group can create false duplicate-event failures, hide which
attempt earned a score, or allow an incomplete retry to contaminate a complete
attempt. Attempt separation keeps reports useful without changing progression
authority.

## Consequences

- Multiple valid retries remain separately reportable.
- An incomplete retry is blocked without invalidating an earlier valid attempt.
- Standalone support audio still does not create a game attempt.
- No additional persistence, reward, or export behavior is introduced.
