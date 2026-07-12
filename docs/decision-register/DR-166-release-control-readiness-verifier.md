# DR-166: Release Control Readiness Verifier

## Decision

Add a focused verifier for package release-control readiness.

## Rationale

White-label pilots need a clear saleable path, but the platform must not overpromise. A package can be demo-visible while still blocked for live pilot use. Publish gates, approval ledgers, and release candidate logic should be checked automatically.

## Accepted Direction

- Add `scripts/verify-release-control-readiness.mjs`.
- Add `npm run verify:release-control`.
- Include the verifier in `npm run verify:foundation`.
- Show release-control readiness on `/teacher/intake` through the foundation gate.

## Follow-Up

Expand the verifier when release-control state becomes durable backend data.
