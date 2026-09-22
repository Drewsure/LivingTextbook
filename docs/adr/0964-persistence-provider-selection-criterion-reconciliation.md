# ADR 0964: Persistence Provider Selection Criterion Reconciliation

Status: Accepted

## Context

The persistence provider preflight had source-bound aggregate evidence, but an
open-criteria count alone could be edited without preserving the criterion
statuses and ownership that produced it.

## Decision

Require a criterion-level snapshot in selection evidence. Every criterion must
have a unique identifier, supported status, and owner. The open-criteria count
must equal the number of non-passed criteria, and deployment fit and cost
posture must match the recommended candidate.

## Consequences

- The teacher workbench can show why a provider comparison remains blocked.
- Count drift and candidate posture drift fail at the shared model boundary.
- The evidence remains review-only; no provider, migration, write, or
  activation path is enabled.

## Verification

- `node scripts/verify-persistence-provider-selection-preflight.mjs`
- `node scripts/verify-persistence-provider-selection-preflight-behavior.mjs`
- `npm run typecheck --workspace @living-textbook/web`
