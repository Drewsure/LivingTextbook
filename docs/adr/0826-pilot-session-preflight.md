# ADR 0826: Pilot Session Preflight

## Status

Accepted for foundation hardening.

## Context

The pilot evidence envelope now gives the teacher one coherent summary of the
controlled Front Door -> Flashcards -> Memory Match -> Sentence Builder
rehearsal. A complete summary must be distinguishable from approval to use the
package with real learners or to write a durable record.

## Decision

Evaluate the envelope with a typed preflight that reports identity, workflow,
target-language, privacy, and launch-boundary checks. The evaluator may return
`ready-for-review`, `incomplete`, or `invalid`, but always returns
`launchAllowed: false` and `durableWriteAllowed: false`.

The teacher surface may show this result as read-only review evidence. It must
not grant progression, mutate rewards, authorize assignments, export data, or
enable hosted persistence.

## Consequences

- Human reviewers can see exactly why a rehearsal is review-ready or blocked.
- The production boundary stays explicit while backend and integration work
  continues.
- A later release gate must be added rather than inferring authorization from
  this preflight.
