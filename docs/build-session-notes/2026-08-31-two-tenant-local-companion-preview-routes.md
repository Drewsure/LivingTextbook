# Build Session Note: Two-Tenant Local Companion Preview Routes

Date: 2026-08-31

## What Changed

- Added `/local/ministar` for the MiniStar local companion manifest.
- Kept `/local/sample-publisher` as the white-label partner local companion manifest.
- Linked both local preview routes from the game-readiness workbench.
- Added the MiniStar local route to the active route verification list.
- Extended local bundle and active route verification to protect both local companion preview routes.

## Why It Matters

The local companion strategy is now visibly two-tenant: one flagship school product and one partner textbook product. That supports the white-label business model without hard-coding MiniStar as the only local package shape.

## Blocked Actions

- No local export.
- No installer.
- No offline-ready claim.
- No local student-data retention.

## Verification

- Run `npm run verify:local-bundle`.
- Run `npm run typecheck --workspace @living-textbook/web`.
- Run `npm run build --workspace @living-textbook/web`.
- Run `npm run verify:routes`.
