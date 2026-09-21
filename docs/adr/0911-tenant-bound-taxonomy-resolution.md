# ADR 0911: Tenant-Bound Taxonomy Resolution

## Decision

Hosted progress-event persistence resolves its taxonomy from the requested
tenant and reviewed package identity. Unknown bindings are blocked; the route
does not fall back to a global or MiniStar taxonomy.

## Required Invariants

- The browser cannot provide or override taxonomy policy.
- Every supported tenant/package pair must have an explicit reviewed binding.
- An unknown package cannot write or read event evidence.
- MiniStar remains a sample tenant binding, not a platform-wide rule.
- A future package registry may replace the sample binding table without
  changing the persistence contract.

## Evidence

- `apps/web/src/server/persistence/progressEventTaxonomyResolver.ts`
- `apps/web/src/app/api/persistence/events/route.ts`
- `scripts/verify-progress-event-persistence.mjs`
