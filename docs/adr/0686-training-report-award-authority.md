# ADR 0686: Training Report Award Authority

## Status

Accepted

## Context

Training Academy emits response evidence and a completion event in the same
local event stream. Both may carry the accepted Star Dust value so the record
is useful for inspection. Treating every metadata copy as a new award causes
teacher summaries to double-count recovery rewards.

## Decision

Teacher recovery summaries must count `earnedStarDust` only from
`training_completed` events. `training_answer_result` remains evidence of the
learner response and must not contribute an additional award. The completion
event is the authoritative recovery award record until a durable provider
contract is introduced.

## Consequences

- Teacher reports match the progression adapter's accepted recovery award.
- Evidence events remain rich without becoming hidden progression writers.
- Future durable reports must preserve the same authority rule or provide an
  explicit deduplication key.
- No live persistence or upload behavior is introduced by this change.

## Verification

- Recovery verification checks the report authority marker.
- Web typecheck and production build remain required after report changes.
