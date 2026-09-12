# ADR 0650: True or False Canonical Integration

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

True or False is promoted into the canonical DOM game integration set. It must
use the shared selection engine, route shell, progression adapter, audio event
contract, deterministic replay seed, and completion validation boundary.

## Rationale

True or False exercises binary recognition with a short, reviewable interaction
model. Promoting it now tests that the selection family can support both
multi-option assessment and binary listening review without creating a second
progression or reporting contract.

## Boundaries

- Rounds are derived from reviewed unit vocabulary only.
- Each round is completed once; incorrect answers do not earn mastery credit.
- Audio supports the learner and evidence stream but never unlocks progress.
- No AI generation, live persistence, random reward, or Phaser promotion is
  enabled by this slice.
