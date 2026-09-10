# ADR-0542: Reserved Completion Metadata

Status: Accepted

## Context

The local completion adapter accepts optional mode metadata for attempts, parent-engine context, and scoring profile identifiers. If that metadata is merged after the normalized award, a caller can overwrite `earnedStarDust` in the completion event while learner state uses the normalized value.

## Decision

Merge optional completion metadata first, then write normalized `earnedStarDust` as a platform-owned reserved field.

## Consequences

- Completion events and local progression state cannot disagree because of metadata merge order.
- Game modes retain explanatory metadata without owning score authority.
- The review-only/provider-neutral boundary remains unchanged.

## Verification

- `npm run typecheck --workspace @living-textbook/web`
- `npm run verify:foundation`
