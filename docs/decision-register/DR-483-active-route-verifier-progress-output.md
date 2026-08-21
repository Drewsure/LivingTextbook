# DR-483: Active Route Verifier Progress Output

Date: 2026-08-21

## Decision

Keep active route verification streaming, concise, and bounded as the route matrix grows.

## Rationale

The foundation route list now covers teacher workbenches, student game routes, media routes, package review routes, generator routes, and prototype review routes. A verifier that waits until the full sweep finishes can appear frozen and waste build time when one dynamic page is slow.

## Implementation

- `scripts/verify-active-routes.mjs` prints a route result as each route completes.
- Passing routes report path and expected-text count rather than dumping every expected string.
- Route checks use smaller worker batches.
- Heavy shell routes run as full sequential checks before the concurrent sweep.
- Route fetches stay bounded with retries and finite per-attempt timeouts.

## Guardrails

- Do not remove expected-text coverage to make the verifier faster.
- Do not let one stalled route hide the route path that needs attention.
- Treat missing expected text, forbidden text, bad status, or repeated timeout as real foundation failures.
