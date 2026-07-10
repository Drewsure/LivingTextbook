# DR-096: Active Route Verification Script

## Decision

Add `npm run verify:routes` to check active local routes listed in `docs/ACTIVE_ROUTE_VERIFICATION_LIST.md`.

## Reason

The active route list is now important enough that manual checks alone are fragile. A small script gives fast feedback without introducing a heavier browser-test stack or paid service.

## Standard

- The script checks only active local routes before the planned/not-active section.
- The planned QR route remains excluded because it is intentionally not active.
- The script requires the local dev server to be running.
- Typecheck and production build still remain required before route verification.
