# ADR 0645: Canonical Game Scoring Boundary

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Canonical game completion validation must prove that the mastery event,
completion event, and progression result all carry the same deterministic Star
Dust award. A mastery event must mark completion and identify its scoring
profile. Awards must be integer values from 0 through 1,000.

## Rationale

Event order alone is not enough for a white-label learning platform. A game
wrapper could emit a plausible sequence while reporting one score to the
teacher and granting another to the student. The shell owns the progression
result, so the shared validator compares the event stream against that result
before the completion surface accepts the evidence.

## Boundaries

- Scoring remains deterministic and mode-specific through a named scoring
  profile.
- Validation does not calculate or alter a score; it rejects inconsistent
  evidence.
- Rewards, persistence, assignments, and live reporting remain outside the
  playable game component.
- Frozen Z.ai/Phaser source remains review-only until it can satisfy this
  scoring boundary through the canonical wrapper.
