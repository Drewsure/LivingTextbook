# DR-728: Canonical Replay Evidence Boundary

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Foundation hardening / canonical game integration

## Decision

Make replay-v1 evidence a shared progression-adapter default for canonical game
interaction, audio-request, mastery, and completion events. Keep explicit
component-level replay metadata where it improves readability and deterministic
layout review.

## Consequences

- Older canonical slices receive the same evidence guarantee as newer slices.
- QA can compare game, audio, scoring, and completion records using one stable
  unit-and-mode identity.
- The adapter remains the authority for platform events; game components remain
  responsible only for their local interaction state.
- Z.ai and Phaser prototypes still require a separate wrapper review before
  promotion.
