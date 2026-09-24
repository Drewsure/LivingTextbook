# ADR 1173: Reproducible Production-Preview Route Verification

## Status

Accepted

## Context

The active-route verifier is authoritative browser evidence, but historically
it required a manually running server on port 3000. That made the foundation
gate fragile on Windows and made a successful production build insufficiently
reproducible.

## Decision

Add `verify:routes:preview`, which starts the built web workspace with a
cross-platform production preview on a free local port, waits for readiness,
passes `ACTIVE_ROUTE_BASE_URL` to the existing active-route verifier, and
cleans up the child process on every exit path. Windows cleanup terminates the
entire `npm` process tree asynchronously, detaches the child streams, and
unrefs the preview handle so a wrapper close event cannot hold the foundation
gate open after route verification has completed.

## Consequences

The route gate can be run without occupying port 3000 or relying on another
terminal. It remains a read-only browser verification step and does not grant
storage, launch, promotion, or tenant-configuration permissions.

## Verification

Run `npm run build --workspace @living-textbook/web`, then
`npm run verify:routes:preview`.
