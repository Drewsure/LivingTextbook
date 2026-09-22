# Build session: Route evidence scope display

## Goal

Make the route/deployment evidence scope visible to the adult operator.

## Delivered

- Displayed tenant and package scope beside route counts.
- Kept the route evidence card review-only with no activation controls.

## Verification

- `node scripts/verify-white-label-release-readiness.mjs`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
