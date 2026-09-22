# ADR 0958: White-Label Release Readiness

Status: Accepted

## Context

The platform has many separate evidence, content, game, persistence, policy,
and tenant workbenches. Without a shared control surface, a healthy demo can
be mistaken for production approval, especially when the platform is sold to
multiple publishers.

## Decision

Add a tenant- and package-bound white-label release-readiness record and
teacher-only dashboard. It reconciles eight governed phases and seven quality
signals while keeping all production actions disabled.

## Consequences

- Owners can see the next blocker without treating a dashboard as a launch
  control.
- MiniStar remains a reference tenant rather than a hard-coded platform rule.
- Future pilot and deployment work must cite this record before approval.
- The product gets a saleable readiness story without enabling unsafe writes.

## Verification

- `node scripts/verify-white-label-release-readiness.mjs`
- `npm run verify:foundation-composition`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `npm run verify:routes`
