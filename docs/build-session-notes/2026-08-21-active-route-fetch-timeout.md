# 2026-08-21 Build Session: Active Route Fetch Timeout

## Completed

- Added a finite 45-second per-attempt timeout to `scripts/verify-active-routes.mjs`.
- Preserved the existing three-attempt retry and short backoff behavior.
- Updated operating notes so future route-check stalls have a repeatable procedure.
- Added focused decision and ADR records.

## Preserved Boundaries

- Expected-text checks remain strict.
- Failed routes remain failures.
- Route count and app behavior are unchanged.
- The timeout only improves local verification failure clarity.

## Verification

- `node --check scripts/verify-active-routes.mjs`
- `npm run verify:routes`
