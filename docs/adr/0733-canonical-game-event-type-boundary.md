# ADR 0733: Canonical Game Event Type Boundary

## Status

Accepted

## Context

Canonical game sequence validation already checked required event presence,
identity, chronology, audio, replay, scoring, mastery, and completion. The
runtime `GameProgressEvent` type was compile-time safe, but JSON evidence could
still carry an unrecognized event string and pass the object-shape filter.

## Decision

Keep the complete event vocabulary in the shared content model as
`GAME_EVENT_TYPES` and derive `GameEventType` from it. Canonical game sequence
validation must reject every runtime event whose type is not in that list before
the event is considered part of the accepted sequence.

## Consequences

Browser, Phaser, import, and teacher-report evidence cannot silently introduce
an unclassified event type through a typo or an unreviewed feature. Adding a
new event requires updating the shared vocabulary, taxonomy classification,
and regression coverage together. This remains a validation boundary only; it
does not authorize live persistence, route activation, source promotion, or
student assignment.

## Verification

Run `npm run verify:runtime-behavior`, the workspace typechecks, and the full
foundation verification suite.
