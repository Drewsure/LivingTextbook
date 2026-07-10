# ADR 0106: Active Route Content Checks

## Status

Accepted

## Context

The active route verifier already checks local URLs. As the route count grows, a page can still return 200 while rendering stale or wrong content.

## Decision

Add expected text checks for selected high-value scaffold routes.

## Consequences

Foundation verification catches more regressions with minimal cost. The project can defer heavier Playwright automation until the UI surfaces stabilize further.
