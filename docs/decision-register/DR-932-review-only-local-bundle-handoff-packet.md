# DR-932: Review-Only Local Bundle Handoff Packet

## Decision

Assemble local companion readiness into a shared review-only packet before
future package writers or deployment shells are implemented.

## Verification

`node scripts/verify-local-bundle-handoff-runtime.mjs` validates identity,
required checks, blocked actions, and fail-closed offline readiness.
`node scripts/verify-local-bundle-readiness.mjs` covers the panel and package
boundary, and `npm run verify:foundation` remains the full gate.

## Excluded

No file access, package write, export, upload, cache, offline activation,
redirect mutation, or student promotion is enabled.

See ADR 0860 and
`docs/adr/0860-review-only-local-bundle-handoff-packet.md`.
