# ADR 1115: White-Label Evidence Freshness

## Decision

Evaluate white-label release quality evidence against the packet's explicit
`verificationReferenceAt` and a seven-day default freshness period.

## Rationale

Run lineage identifies the source of a review packet, but evidence can still
become too old to represent the current deployment surface. A deterministic
freshness function makes that condition visible without relying on browser
time or enabling any release side effect.

## Consequences

- Future-dated observations are rejected.
- Observations older than the configured period are rejected.
- Tests can reproduce the same result with the stored reference time.
- Release, persistence, export, installation, provider activation, QR
  mutation, and student launch remain disabled.

## Verification

- `node scripts/verify-white-label-release-readiness.mjs`
- `node scripts/verify-white-label-release-readiness-behavior.mjs`
- `npm run verify:runtime-behavior`
- Full foundation verification before publication.
