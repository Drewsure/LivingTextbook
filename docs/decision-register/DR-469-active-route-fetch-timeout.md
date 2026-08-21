# DR-469: Active Route Fetch Timeout

## Status

Accepted.

## Decision

The active route verifier should use a finite per-route fetch timeout in addition to retry/backoff behavior.

The timeout is intentionally generous at 45 seconds per attempt because `/teacher/intake` is a large foundation review page on a slow local Windows/Next setup. The timeout still prevents a stalled local server from leaving `npm run verify:routes` silent indefinitely.

## Rationale

The route verifier protects the white-label foundation by checking many local routes and important expected text. As the route matrix grows, local preview-server stalls should produce a clear, actionable failure instead of a hanging verification command.

## Guardrails

- Expected-text checks remain unchanged.
- Failed statuses remain failures.
- Missing required text remains a failure.
- The timeout does not reduce route coverage.
- Repeated timeout after retries should be treated as a local server or route issue, not ignored.

## Verification

- `node --check scripts/verify-active-routes.mjs`
- `npm run verify:routes`
