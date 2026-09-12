# ADR 0649: Quiz Canonical Integration

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Quiz is promoted into the canonical DOM game integration set. It must use the
shared selection engine, route shell, progression adapter, audio event contract,
deterministic replay seed, and completion validation boundary.

## Rationale

Quiz is the assessment reference for the selection parent engine. Its existing
round and scoring logic was deterministic, but it lacked canonical start and
audio evidence. Bringing it into the shared contract gives future Gameshow,
True or False, and arcade-selection skins a reliable reference path.

## Boundaries

- Reviewed vocabulary and sentence choices remain the only content source.
- Incorrect answers complete their reviewed round but do not earn mastery credit.
- Audio supports the learner and evidence stream; it never unlocks progress.
- No AI generation, persistence, live reporting, or Phaser promotion is enabled.
