# ADR 1207: Phaser Return Replay Seed Boundary

**Status:** Accepted  
**Date:** 2026-09-25

## Context

The canonical game replay contract accepts only bounded `replay-v1` seeds.
Returned Phaser event evidence previously checked only that a seed was a
non-empty string with the right prefix.

## Decision

Require returned replay events to use the same bounded `replay-v1` seed shape
as canonical games. Reject path-like, empty, control-character, or malformed
seed values before replay evidence is accepted.

## Consequences

- External replay evidence and canonical replay evidence share one seed shape.
- Deterministic review remains portable and resistant to malformed identity
  input.
- This remains review-only; it does not execute candidates or authorize source,
  route, scoring, persistence, reward, or assignment changes.

## Verification

- Contract markers cover the bounded seed rule.
- Package behavior rejects an unsafe replay seed while the valid candidate
  fixtures continue to pass.
