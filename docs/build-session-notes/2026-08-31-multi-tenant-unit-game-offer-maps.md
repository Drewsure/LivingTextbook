# Build Session Note: Multi-Tenant Unit Game Offer Maps

Date: 2026-08-31

## What Changed

- Added a MiniStar unit game offer map for Level 1 Unit 1.
- Kept the sample publisher unit game offer map as the non-MiniStar white-label example.
- Exported both maps through `sampleUnitGameOfferMaps`.
- Updated teacher intake and game-readiness surfaces to render all sample maps through the same component.
- Added verifier expectations for MiniStar and sample publisher package bindings.

## Why It Matters

This keeps the foundation honest: MiniStar can remain the flagship curriculum while the platform still behaves like a saleable white-label product.

## Blocked Actions

- No live game publishing.
- No direct prototype import.
- No unrestricted activity switching.
- No student-facing game offer without reviewed audio, route, scoring, and teacher controls.

## Verification

- Run `npm run verify:package-readiness`.
- Run `npm run verify:routes` with the dev server available.
- Run `npm run verify:review-keys`.
