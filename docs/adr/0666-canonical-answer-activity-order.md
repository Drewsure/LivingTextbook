# ADR 0666: Canonical Answer Activity Order

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

The canonical event validator must reject any event stream where an
`answer_submitted` or `answer_result` event occurs after `mastery_updated` or
`game_completed`. All answer activity must finish before the platform accepts
mastery and completion.

## Rationale

Checking only the first answer event allowed a malformed or late interaction
to appear after the result had already been finalized. That could make event
reports disagree with the awarded score and would weaken the shared boundary
for future game wrappers.

## Consequences

- Canonical games retain a closed answer window at mastery/completion.
- Late event streams fail visibly instead of mutating a completed result.
- The runtime harness protects the rule with an intentionally late answer
  regression fixture.
