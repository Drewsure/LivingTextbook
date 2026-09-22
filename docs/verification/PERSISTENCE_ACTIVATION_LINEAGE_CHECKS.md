# Persistence Activation Lineage Checks

Run these checks when persistence activation, deployment selection, school
policy, retention, or pilot handoff contracts change.

## Required checks

- `npm run verify:foundation-composition`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:routes`

## Required behavior

- Activation evidence carries deployment decision, policy preflight, and
  acceptance-preview identities.
- Deployment selection and policy acceptance remain review-only in the sample.
- `canActivate` and learner writes remain false.
- Missing or altered lineage fails the contract verifier.
