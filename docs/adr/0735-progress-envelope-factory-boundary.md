# ADR 0735: Progress Envelope Factory Boundary

## Status

Accepted

## Context

Progress-event stream validation already rejected unknown or unclassified event
types. The envelope factory could still receive an untrusted runtime event and
silently assign `report-only` when the taxonomy lookup failed, creating a
misleading envelope before the validator ran.

## Decision

Require `createProgressEventEnvelope` to validate the shared event vocabulary
and taxonomy classification before producing an envelope. It must throw an
actionable error for an unsupported event type or a known type missing from the
supplied registry. There is no fallback event effect.

## Consequences

Browser games, Phaser wrappers, imports, teacher reports, and progression
adapters cannot manufacture misclassified evidence through a typo or incomplete
registry. New events require coordinated vocabulary and taxonomy updates. This
is a validation boundary only; it does not authorize live persistence, report
export, progression, or assignment.

## Verification

Run `npm run verify:runtime-behavior`, `npm run verify:taxonomy`, both workspace
typechecks, and `npm run verify:foundation`.
