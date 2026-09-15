# ADR 0788: Completion Navigation Audio Boundary

## Status

Accepted

## Decision

The shared playable-game completion card must calculate next-activity
target-language audio readiness before offering an active navigation action.
The route shell passes the current unit and audio cues into the card, while the
card owns the next-activity calculation.

## Rationale

A completed current game and a ready next game are separate facts. Without a
second check, a learner can be shown an open action that leads directly to a
route which must pause for missing reviewed audio. Keeping the calculation in
the reusable completion card covers every canonical game route consistently.

## Consequences

- Incomplete next-activity audio is shown as review-required.
- Current-game completion evidence remains distinct from next-route readiness.
- White-label target languages continue to flow from the route handoff.
- This foundation change does not enable live services or promote external
  Phaser source.
