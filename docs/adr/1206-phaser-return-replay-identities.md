# ADR 1206: Phaser Return Replay Identity Boundaries

**Status:** Accepted  
**Date:** 2026-09-25

## Context

The Phaser return-package verifier checked replay identity consistency, event
ordering, audio timing, scoring, and completion. It did not yet reject a
path-like unit, launch, or student-session identity inside an otherwise
consistent replay.

## Decision

Apply the canonical identity shapes to returned event replay evidence. Unit
keys retain namespaced separators; launch codes and student-session IDs use the
narrower portable shape. Reject unsafe replay identities before the evidence
package can pass.

## Consequences

- External replay evidence matches the canonical event identity contract.
- A replay cannot use path-like identity values to influence later review or
  reporting joins.
- This remains a review-only package check and does not authorize execution,
  source import, route replacement, score ownership, persistence, or assignment.

## Verification

- The package behavior harness rejects unsafe replay unit, launch, and session
  identities.
- The complete synthetic Memory Match and Balloon Pop packages continue to
  pass.
