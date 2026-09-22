# ADR 0971: White-label Nested Readiness Consistency

Status: Accepted

## Context

The top-level readiness status and quality gate were strict, but nested package
and pilot evidence could still describe blocked work while the parent record
claimed `pilot-ready`.

## Decision

When the parent readiness status is `pilot-ready`, package evidence must be
`review-only` with no unresolved lanes, and pilot evidence must be
`pilot-ready` with no blocking reasons. Contradictory nested states are
invalid even when phase and quality signals are green.

## Consequences

- Readiness summaries cannot hide blocked package or pilot evidence beneath a
  top-level status.
- Review-only records retain the ability to describe incomplete work while the
  controlled pilot is being prepared.
- The consistency gate remains separate from production approval, student
  launch, durable persistence, and package promotion.

## Verification

- `node scripts/verify-white-label-release-readiness-behavior.mjs`
- `node scripts/verify-white-label-release-readiness.mjs`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run verify:foundation-composition`
