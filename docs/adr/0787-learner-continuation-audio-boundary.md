# ADR 0787: Learner Continuation Audio Boundary

## Status

Accepted

## Decision

The Next Game card and recommended route list must combine progression readiness
with shared target-language audio readiness before showing an active learner
continuation action. The route builder receives the resolved tenant target
language and uses it for coverage and audio guidance.

## Rationale

Direct route protection is necessary but not sufficient. A learner-facing card
that says an activity is ready or offers an open action while that route will
pause for missing audio creates a misleading pathway. The interface should
show the effective state at the earliest point possible.

## Consequences

- Incomplete audio is displayed as review-required and active open/start
  actions are withheld.
- Support-language audio remains assistive and cannot satisfy the target
  language gate.
- White-label tenants retain their own resolved target language.
- This foundation change does not enable live services or promote external
  Phaser source.
