# ADR 0766: Pairing Engine Runtime Contract

## Status

Accepted

## Context

Memory Match is the first canonical pairing slice, and later pairing modes
reuse the same parent engine. Static route checks and replay validation did not
prove the engine's actual selection state transitions.

## Decision

Require a deterministic runtime harness for the reusable Pairing engine. It
must cover first selection, duplicate taps, cross-pair mismatch recovery,
correct matching, completion, terminal retry safety, and progress summaries.

## Consequences

The parent engine now has executable foundation evidence independent of a
visual skin or Phaser implementation. This does not authorize source
promotion, persistence, or additional game-mode behavior.

## Verification

Run `npm run verify:pairing-engine-runtime` and the complete
`npm run verify:foundation` suite.
