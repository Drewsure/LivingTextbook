# ADR 0953: Persistence Provider Selection Preflight

Status: Accepted

## Context

The platform has a backend decision matrix, an evidence-storage adapter gate,
and a provider-neutral implementation handoff. Separate previews make it too
easy to compare one lane without noticing a missing policy or scope binding.

## Decision

Use one tenant/package-bound comparison preflight that binds those three
records. It may recommend a cost-effective first-pilot path, but it remains a
review-only artifact and keeps provider selection, migration, writes, and
activation blocked.

## Consequences

- Hosted, closed-local, and hybrid paths can be compared on equal evidence.
- White-label fit, cost posture, offline obligations, and unresolved risks stay
  visible together.
- A later provider-specific work order can consume the same preflight without
  changing the content or persistence contract.

## Verification

- `node scripts/verify-persistence-provider-selection-preflight.mjs`
- `npm run verify:foundation-composition`
- `npm run typecheck --workspace @living-textbook/web`
