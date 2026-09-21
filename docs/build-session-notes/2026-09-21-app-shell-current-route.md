# Build Session: App Shell Current Route

## Goal

Make the shared teacher and learner navigation understandable across the
white-label route surface.

## Change

Added a reusable navigation component that derives one most-specific active
route from the current pathname, exposes `aria-current="page"`, and applies
tenant-configured active styling. No route or progression behavior changed.

## Verification

- `npm run verify:app-shell-navigation`
- Web typecheck
- Production build
- Full foundation gate
