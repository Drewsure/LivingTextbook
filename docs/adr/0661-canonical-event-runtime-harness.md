# ADR 0661: Canonical Event Runtime Harness

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

The runtime behavior verifier must compile and exercise the shared canonical
game event validator. It must prove one valid sequence and reject a sequence
that drops replay-v1 evidence from a required learning event.

## Rationale

Source-level checks and application typechecks do not prove that the runtime
completion boundary is actually exercised. A small deterministic harness
keeps the shared event contract covered as canonical games and future Phaser
wrappers evolve.

## Consequences

- Tenant identity, event ordering, scoring parity, and replay evidence are
  tested together at runtime.
- A future adapter that drops replay metadata fails foundation verification.
- No external source, persistence, reward randomness, or provider behavior is
  introduced.
