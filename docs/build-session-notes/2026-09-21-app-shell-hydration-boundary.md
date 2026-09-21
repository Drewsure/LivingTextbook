# Build Session: App Shell Hydration Boundary

## Goal

Prevent route-dependent navigation markup from becoming a source of hydration
drift in the white-label app shell.

## Change

The shared navigation renders with no active route during the server and first
client render. Once mounted, it derives the most-specific active route from
the browser pathname and exposes the same `aria-current="page"` semantics as
before.

## Verification

- `npm run verify:shared-app-shell-navigation`
- Web typecheck
- Production build
- Full foundation gate

## Boundary

This is presentation hardening only. It does not authorize routes or create a
second scoring, persistence, reward, or progression path.
