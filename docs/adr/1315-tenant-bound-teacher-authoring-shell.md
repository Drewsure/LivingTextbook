# ADR 1315: Tenant-Bound Teacher Authoring Shell

## Status

Accepted for the white-label pilot foundation.

## Decision

The dynamic teacher authoring route must resolve its tenant shell from the
loaded draft's `tenantId`. It may not use a fixed reference tenant for all
drafts. If the draft tenant cannot be resolved, the route fails closed rather
than rendering another tenant's branding, navigation, policy, or evidence.

## Consequences

- MiniStar, Sample Publisher, and future publisher drafts retain their own
  branding and tenant-scoped navigation on the authoring surface.
- Existing review-only persistence, approval, audio, rights, and assignment
  gates are unchanged.
- A tenant resolver remains the provider-neutral boundary until real tenant
  storage is introduced.
