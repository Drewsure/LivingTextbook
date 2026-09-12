# ADR 0652: Spelling Practice Canonical Integration

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Spelling Practice is promoted into the canonical DOM game integration set. It
must use the shared text-spelling engine boundary, route shell, progression
adapter, audio event contract, deterministic replay seed, and completion
validation boundary.

## Rationale

Letter ordering exposes a finer-grained interaction than typed response. It
tests whether the platform can preserve audio support, retry evidence, and
deterministic completion while the student manipulates multiple semantic
controls inside one round.

## Boundaries

- Letter banks are derived from reviewed vocabulary only.
- Incorrect attempts remain visible in evidence but do not earn mastery credit.
- Audio supports the learner and evidence stream but never unlocks progress.
- No AI generation, live persistence, random reward, or Phaser promotion is
  enabled by this slice.
