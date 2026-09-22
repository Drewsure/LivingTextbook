# QR Alias Rollback Boundary Checks

These checks protect printed textbook QR identity while hosted, local, and
hybrid deployments remain review-only.

## Required checks

- `npm run verify:qr-alias-rollback-boundary`
- `npm run verify:foundation-composition`
- `npm run verify:foundation`

The shared contract must prove tenant, alias, package, release, fallback, and
rollback identity. Unsafe paths and incomplete active-alias prerequisites must
fail closed.

## Explicit non-goals

This contract does not create durable aliases, mutate redirects, activate
student routes, swap packages or media, activate local bundles, change learner
data, or execute rollback. Those actions require the future persistence,
release-control, authorization, local-fallback, and human approval gates.
