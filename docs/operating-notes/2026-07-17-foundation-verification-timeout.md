# 2026-07-17: Foundation Verification Timeout Window

## Symptom

`npm run verify:foundation` can exceed a 300-second managed command timeout even when the code is healthy.

## Confirmed Recovery

Rerun the same command with a longer timeout window. In the observed case, the rerun completed successfully and included the new assignment-rollout verifier, production build, and all 47 route checks.

## Rule

Do not treat a bare command timeout as a verifier failure. Treat explicit verifier `FAIL` output, TypeScript errors, build errors, or route-check failures as real failures.

## Route Sweep Recovery

The active-route verifier performs a sequential recovery request for any route
that timed out during the concurrent sweep. Recovery uses the same expected
text and forbidden-text checks with a longer request window; it never removes a
route from the matrix or weakens coverage.

If recovery passes, record the result as a Windows/Next cold-load concurrency
signal and continue. If recovery fails, treat the route failure as real and
inspect the route and dev-server output before changing source.
