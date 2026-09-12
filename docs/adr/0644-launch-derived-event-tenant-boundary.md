# ADR 0644: Launch-Derived Event Tenant Boundary

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Every event emitted by the local progression adapter from a `LaunchSession`
must copy `LaunchSession.tenantId` into its metadata. This includes entry
practice, unlock, QR guidance, launch, media, playlist, and background-media
events in addition to the canonical playable-game events.

## Rationale

Canonical game completion checks protect the game route, but a white-label
platform also needs tenant lineage across the surrounding session. Reports,
media engagement, unlock summaries, and future persistence adapters must never
have to infer tenant identity from a route, visual theme, or user-controlled
label.

## Verification

- `withTenantMetadata` is the single local-adapter helper for launch-derived
  metadata envelopes.
- The canonical game verifier requires all seven non-game launch-derived
  metadata families to use the helper.
- The helper copies the tenant identity and does not accept a caller override.
- This remains an in-memory contract; it does not enable persistence or live
  classroom reporting.

## Boundaries

- Tenant identity is copied from the platform-owned launch session.
- Media and support-language events remain non-mastery events.
- Frozen Z.ai/Phaser source remains review-only and cannot emit directly into
  the canonical progression stream.
