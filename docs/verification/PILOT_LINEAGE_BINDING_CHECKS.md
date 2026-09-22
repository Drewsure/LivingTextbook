# Pilot Lineage Binding Checks

Run these checks when pilot deployment, school policy, persistence handoff,
or acceptance-preview contracts change.

## Required checks

- `npm run verify:pilot-lineage-binding`
- `npm run verify:runtime-behavior`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:routes`

## Required behavior

- Deployment, policy-preflight, and acceptance-preview ids resolve exactly.
- All lineage sources match tenant and package scope.
- Selection and policy status remain synchronized and non-accepted.
- Reconciliation remains review-only and cannot enable side effects.
