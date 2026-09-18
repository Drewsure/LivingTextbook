# Build Session: Read-Only Local Bundle Resolver

## Outcome

Added a shared read-only resolver for validated local bundle manifests. It
resolves only declared QR fallbacks and asset paths, requires the expected
tenant, and rejects unknown identifiers and invalid manifests.

## Safety Boundary

The resolver does not read directories or files, write or copy media, create a
bundle, register service workers, cache assets, store learner data, or activate
offline delivery.

## Verification

- `node scripts/verify-local-bundle-resolver-runtime.mjs`
- `npm run verify:local-bundle`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run verify:foundation`

Recorded as ADR 0852 and DR-924.
