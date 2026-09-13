# ADR 0704: Canonical Completion Idempotence

## Decision

Canonical playable routes accept one validated completion per game mode and
session. Duplicate callbacks and completed replays are idempotent no-ops.

## Context

The progression adapter already returns no completion event for a game mode
that is complete. Route handlers previously treated that expected replay
response as a malformed completion, and a duplicate callback could repeat
completion handling before React state visibly settled. This is especially
important for touch controls, slow devices, and teacher-led transitions.

## Boundary

The first completion still passes the canonical event-sequence validator. Once
accepted, the route records the accepted mode in an in-memory guard. A later
callback for that mode is ignored. If the progression state already identifies
the mode as complete but no event is returned, the route clears stale contract
errors and remains stable without awarding dust or appending events.

This is deliberately a route-session guard, not a persistence implementation.
Hosted and local adapters must eventually enforce the same idempotency rule at
their durable write boundary.

## Consequences

- Duplicate taps cannot create duplicate visible completion evidence.
- A completed route can be revisited without a false red error state.
- Each mode is tracked independently in the front-door and student flows.
- Durable idempotency keys remain a future backend requirement.

See `COMPLETION_IDEMPOTENCE_CHECKS.md` and `verify:completion-idempotence`.
