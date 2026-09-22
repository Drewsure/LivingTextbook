# ADR 0963: Persistence Provider Selection Evidence

Status: Accepted

## Context

The provider-neutral persistence preflight already compared hosted, local, and
hybrid candidates. Its recommendation was not yet bound to one typed set of
source records, so a future provider choice could drift from the backend
matrix, selection gate, or implementation-readiness handoff.

## Decision

Add cross-source selection evidence to the persistence provider preflight. The
record must identify the backend matrix, selection gate, implementation
readiness, tenant, package, recommended candidate, deployment fit, cost
posture, open criteria, and at least three source records. The selection
remains review-only and provider-neutral.

## Consequences

- Provider comparison is traceable across the authoritative planning records.
- A blocked preflight cannot claim zero open criteria.
- Package or matrix drift is rejected before provider-specific work is opened.
- Provider selection, migration, writes, and activation remain disabled.

## Verification

- `node scripts/verify-persistence-provider-selection-preflight.mjs`
- `node scripts/verify-persistence-provider-selection-preflight-behavior.mjs`
- `npm run verify:foundation-composition`
