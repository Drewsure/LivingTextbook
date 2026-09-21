# Build Session: Shared App Shell Skip Navigation

## Goal

Harden the shared route shell for keyboard and assistive-technology users
without changing the canonical game or progression contracts.

## Change

`AppShell` now exposes a keyboard-visible skip link before repeated tenant
navigation and a programmatically focusable `main-content` target. The link
uses tenant CSS variables, so white-label branding remains configurable.

## Verification

- `npm run verify:app-shell-accessibility`
- Web typecheck
- Production build
- Full foundation gate
