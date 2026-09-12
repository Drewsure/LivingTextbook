# ADR 0638: Canonical Game Integration Verification Gate

**Status:** Accepted  
**Date:** 2026-09-12

## Decision

Add a focused `verify:canonical-games` gate for the accepted Memory Match and
Balloon Pop web slices. The gate checks that each canonical component preserves
the shared progression helpers, learner-audio hook, interaction events,
completion callback, route demo flow, and state-ownership boundary.

The gate also checks that the shared progression adapter contains the standard
game event vocabulary. It rejects direct `Math.random`, `localStorage`, or
`sessionStorage` ownership in these canonical components.

## Rationale

The catalog and route checks can pass while a leaf game silently bypasses the
platform contract. A small source-level gate gives us a cheap regression signal
before browser review and before any Phaser wrapper is considered.

This is a verification boundary, not a claim that the two games are complete
production engines. The frozen Z.ai Phaser scenes remain isolated review
artifacts and must be compared against these canonical contracts before
promotion.

## Consequences

- `npm run verify:foundation` now includes `npm run verify:canonical-games`.
- New canonical game slices must add their component and route-flow contract to
  the verifier before they are treated as accepted integrations.
- Phaser scenes may provide a visual or motion layer later, but they cannot own
  platform scoring, identity, persistence, or progression state.
