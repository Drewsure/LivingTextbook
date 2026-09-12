# ADR 0656: Canonical Replay Evidence Boundary

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

The shared progression adapter adds the deterministic replay seed to canonical
game interaction, audio-request, mastery, and completion metadata by default.
Individual game components may also include the seed in their local metadata,
but platform evidence must not depend on every component remembering to do so.

## Rationale

Replay evidence supports deterministic QA, teacher review, future replay
debugging, and a controlled handoff from DOM prototypes to reviewed Phaser
skins. Centralizing the default prevents older canonical slices from silently
producing incomplete evidence.

## Boundaries

- The seed is derived from the unit key and game mode; it is not random.
- Replay evidence never grants mastery or changes progression.
- No persistence provider, external replay service, or Phaser source is
  introduced by this decision.
- Existing tenant, launch, student-session, audio, and scoring boundaries stay
  unchanged.
