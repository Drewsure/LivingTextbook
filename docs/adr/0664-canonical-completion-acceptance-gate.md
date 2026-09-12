# ADR 0664: Canonical Completion Acceptance Gate

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

The playable game route shell must accept a game completion result only after
the complete event stream passes `validateCanonicalGameEventSequence`. A
missing completion event or any validation error pauses progression, Star
Dust, and next-activity state while exposing the contract errors for review.

## Rationale

Reporting a contract failure while still granting its result would make the
validator advisory and could award progress from incomplete or cross-tenant
evidence. The shell is the shared boundary where every canonical game result
passes, so acceptance belongs there rather than in individual game skins.

## Consequences

- Canonical game slices share one completion acceptance rule.
- A broken event stream becomes visible and cannot silently grant mastery.
- Phaser wrappers, if later approved for review, inherit the same gate.
