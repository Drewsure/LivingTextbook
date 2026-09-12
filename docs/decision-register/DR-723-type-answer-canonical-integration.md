# DR-723: Type Answer Canonical Integration

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Canonical game integration / text-spelling engine

## Decision

Type Answer joins the canonical DOM slices. Its input, answer attempts,
feedback, mastery, completion, audio, scoring, tenant, launch, and replay
evidence must flow through the shared platform contracts.

## Consequences

- The text-spelling parent engine has a canonical typed-response reference.
- Teacher evidence can distinguish prompt replay and input guidance from
  mastery-bearing answers.
- Future spelling variants and Phaser text skins must preserve the same
  completion and scoring boundary.
- Frozen Z.ai/Phaser work remains isolated until separately mapped and
  approved.
