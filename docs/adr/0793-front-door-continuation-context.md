# ADR 0793: Front-Door Continuation Context

## Status

Accepted

## Decision

The front-door flow must pass the active unit's `UnitAudioSupportPlan` into
`RecommendedGameRoutesCard`. The card must calculate each continuation route
with the same reviewed plan used by front-door entry readiness and direct game
routes.

## Rationale

The front door is the first teacher-directed student experience. If its route
list uses raw audio cues while the playable route uses a reviewed mode manifest,
students can see a misleading open action or a misleading audio block. The
shared context handoff makes the white-label readiness decision consistent.

## Consequences

- Front-door continuation cannot bypass mode-specific audio review.
- Curated and fallback route presentation use the same plan authority.
- This does not enable uploads, live AI, persistence, assignment, or Phaser
  promotion.
