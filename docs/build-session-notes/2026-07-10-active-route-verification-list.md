# 2026-07-10 Build Session: Active Route Verification List

## Completed

- Added a standing active route verification list.
- Added active route verification checks.
- Added decision and ADR records.

## Verification

- Typecheck required.
- Production build required.
- Minimum route checks should include home, teacher intake, one MiniStar route, one sample publisher route, one teacher session route, and the active QR alias route.
- Planned QR routes with `stableQrReady: false` should not be listed as active routes.

## Next

Update the route list whenever routes are added, renamed, or removed.
