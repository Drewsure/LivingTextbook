# Pilot Deployment Decision Checks

Run these checks when pilot deployment choice or persistence activation rules
change.

## Required Checks

- `npm run verify:pilot-deployment-decision`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:foundation-composition`

## Required Behavior

- The decision is bound to one tenant, package, and deployment guide.
- Hosted PWA is visible as the current recommendation for cost efficiency.
- No option is selected by default.
- The route shows hosted, local, and packaged alternatives.
- Policy acceptance, persistence activation, and classroom launch remain false.
- The panel contains no write controls, provider activation, package
  promotion, QR mutation, report export, or classroom launch action.
