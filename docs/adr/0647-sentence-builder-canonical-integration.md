# ADR 0647: Sentence Builder Canonical Integration

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Sentence Builder is promoted into the canonical DOM game integration set. It
must use the shared route shell and progression adapter, emit the complete
canonical event sequence, attach learner-facing audio requests to instruction,
sentence, feedback, and tile interactions, and carry a deterministic replay
seed.

## Rationale

Sentence Builder is the first syntax-construction engine in the platform. Its
existing UI and scoring were already structural, but it lacked a canonical
`game_started` event and tracked tile speech outside the shared audio event
contract. Those omissions would make teacher evidence and future Phaser skin
integration inconsistent with the pairing and selection slices.

## Boundaries

- Reviewed target sentences remain the only sentence source.
- The route remains local/review-only and does not generate AI content.
- Audio supports learning and evidence; it does not grant mastery or rewards.
- No Phaser source was imported or promoted.
