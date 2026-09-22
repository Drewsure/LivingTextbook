# ADR 0961: White-Label Quality Evidence Records

Status: Accepted

## Context

Release-readiness quality signals were represented as booleans. That was useful
for a summary but too weak for a saleable white-label control surface: a
verified signal needs a source record, observation time, and notes.

## Decision

Require exactly seven quality evidence records for typecheck, production build,
active routes, runtime, browser, privacy, and tenant isolation. Each record
must agree with its corresponding boolean signal and remain separate from
production approval.

## Consequences

- A green signal is traceable to an evidence source.
- Missing, duplicate, stale-shaped, or contradictory evidence fails validation.
- The dashboard remains review-only and cannot authorize launch or data use.

## Verification

- `node scripts/verify-white-label-release-readiness.mjs`
- `node scripts/verify-white-label-release-readiness-behavior.mjs`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `npm run verify:routes`
