# ADR 0970: White-label Pilot-ready Quality Gate

Status: Accepted

## Context

The release-readiness validator derived its status from phase states and a few
package/control checks, but it did not require all seven quality signals to be
green before a record could claim `pilot-ready`. That allowed a false-ready
summary to be structurally valid.

## Decision

`pilot-ready` requires all quality checks to be `true` and every quality
evidence record to be verified. Any failed or unverified typecheck, production
build, route, runtime, browser, privacy, or tenant-isolation signal rejects
the status.

## Consequences

- A readiness summary cannot hide a failed quality lane behind ready phases.
- The gate remains separate from production approval, student launch,
  persistence activation, and package promotion.
- Review-only and blocked records may continue to expose incomplete quality
  evidence while those phases are being developed.

## Verification

- `node scripts/verify-white-label-release-readiness-behavior.mjs`
- `node scripts/verify-white-label-release-readiness.mjs`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `npm run verify:foundation-composition`
