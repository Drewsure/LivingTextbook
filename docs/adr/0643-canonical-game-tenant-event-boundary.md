# ADR 0643: Canonical Game Tenant Event Boundary

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Canonical game event helpers must copy the tenant identity from
`LaunchSession.tenantId` into event metadata. The shared completion guard must
reject a completed event stream whose tenant metadata is missing or belongs to
another tenant.

## Rationale

White-label isolation cannot depend only on route selection or CSS branding. A
future publisher package, Phaser wrapper, or local companion must not be able to
submit valid-looking game evidence under another tenant. The launch session is
the platform-owned identity boundary, so game views do not get to invent or
override it.

## Boundaries

- Tenant identity is copied, not inferred from visual labels.
- The game view remains unable to write reports, persistence, rewards, or
  assignments directly.
- A tenant mismatch is a contract failure, not something the shell repairs.
- Frozen Z.ai/Phaser source remains review-only; this guard is necessary but not
  sufficient for promotion.
