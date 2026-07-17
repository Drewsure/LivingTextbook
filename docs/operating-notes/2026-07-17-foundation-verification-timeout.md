# 2026-07-17: Foundation Verification Timeout Window

## Symptom

`npm run verify:foundation` can exceed a 300-second managed command timeout even when the code is healthy.

## Confirmed Recovery

Rerun the same command with a longer timeout window. In the observed case, the rerun completed successfully and included the new assignment-rollout verifier, production build, and all 47 route checks.

## Rule

Do not treat a bare command timeout as a verifier failure. Treat explicit verifier `FAIL` output, TypeScript errors, build errors, or route-check failures as real failures.
