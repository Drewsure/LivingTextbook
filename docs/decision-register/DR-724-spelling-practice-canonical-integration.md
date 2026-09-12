# DR-724: Spelling Practice Canonical Integration

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Canonical game integration / text-spelling engine

## Decision

Spelling Practice joins the canonical DOM slices. Its letter tiles, retries,
feedback, mastery, completion, audio, scoring, tenant, launch, and replay
evidence must flow through the shared platform contracts.

## Consequences

- The text-spelling parent engine now has typed-response and letter-ordering
  references.
- Teacher evidence can distinguish letter-level audio from answer results.
- Future spelling variants and Phaser text skins must preserve the same
  completion and scoring boundary.
- Frozen Z.ai/Phaser work remains isolated until separately mapped and
  approved.
