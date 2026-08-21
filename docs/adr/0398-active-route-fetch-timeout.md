# ADR 0398: Active Route Fetch Timeout

## Context

The active route verifier already uses small-batch fetching and retry behavior. During long foundation runs, a sluggish local Next server can still leave route verification quiet for too long.

## Decision

Add a 45-second per-attempt timeout to each active route fetch.

## Consequences

The verifier remains strict but fails more clearly when the local server stalls. This does not change expected-text coverage, route count, app behavior, or production build behavior.

## Verification

- `node --check scripts/verify-active-routes.mjs`
- `npm run verify:routes`
