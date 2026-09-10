# ADR-0530: Background Media Mode Policy

Status: Accepted

## Context

Multimedia plans can declare the game modes where optional music or video may be used. The relation and asset checks existed, but the allowed mode list could contain duplicates or values outside the curated platform catalog.

## Decision

Allowed background game modes must be unique and must use supported curated game-mode IDs. This is a review-time contract only; it does not enable playback or settings persistence.

## Consequences

- Background media policy can be mapped deterministically to parent engines.
- Unknown or duplicated modes become visible repair blockers.
- Target-language audio priority remains independent and protected.
- Hosted, local, and hybrid providers remain future implementation choices.

## Verification

- Runtime behavior tests cover duplicate and unsupported background mode IDs.
- The full foundation gate must pass typechecks, production build, and all active routes.
