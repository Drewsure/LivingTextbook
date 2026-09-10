# ADR-0541: Progression Award Normalization

Status: Accepted

## Context

Profile-level math is bounded, but game adapters can still provide malformed mastery counts or completion awards. Without an adapter boundary, negative, fractional, or non-finite values could reach progress-event metadata or local learner state.

## Decision

Normalize shared Star Dust calculation inputs to safe non-negative values, treat non-finite bonus ratios as zero, and normalize local completion awards to non-negative integers capped at 1,000. Use the normalized value for both event metadata and progression state.

## Consequences

- Malformed input cannot create negative or inflated local Star Dust.
- Event and state representations remain consistent.
- The existing review-only and provider-neutral boundaries remain unchanged.
- Future hosted adapters must preserve the same normalization rule.

## Verification

- `node scripts/verify-runtime-behavior.mjs`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run verify:foundation`
