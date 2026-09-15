# ADR 0784: Audio-Gated Entry Paths

## Status

Accepted

## Decision

All flashcard entry paths must calculate shared target-language audio coverage
and require it before the learner can advance to the next activity. The rule
applies to the dedicated flashcard route, the front-door access flow, and the
normal student launch flow.

## Rationale

Young learners may not be able to read the instructional text reliably. A
card-level warning is not sufficient if a parent flow can still unlock the
next activity after card engagement. One shared readiness rule keeps route
behavior consistent and preserves the distinction between learner progress and
content-package review readiness.

## Consequences

- Missing target-language audio blocks progression with a review message.
- Support-language audio can assist comprehension but cannot unlock the next
  game.
- All future entry routes must use the same content-model coverage contract.
- This remains a foundation boundary and does not enable uploads, live AI,
  persistence, assignment, or Phaser source promotion.
