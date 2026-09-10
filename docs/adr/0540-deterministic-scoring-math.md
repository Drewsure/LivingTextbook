# ADR-0540: Deterministic Scoring Math

Status: Accepted

## Context

Scoring profiles now declare which modes they support, but their reward values still need an explicit arithmetic boundary. Without one, a profile could contain negative values, a cap that differs from its components, or a caller-supplied minimum that exceeds the cap.

## Decision

The game-mode verification gate validates non-negative integer profile values, requires the completion cap to equal the component sum, and enforces the 1,000-dust unit ceiling. The shared accuracy helper clamps its result to the profile cap.

## Consequences

- Profile changes remain deterministic and explainable.
- Invalid reward math blocks foundation verification instead of reaching game integration.
- Existing game components cannot accidentally award above their profile contract through a minimum value.
- No persistence, inventory, progression, or provider behavior is introduced.

## Verification

- `npm run verify:game-modes`
- `npm run verify:foundation`
