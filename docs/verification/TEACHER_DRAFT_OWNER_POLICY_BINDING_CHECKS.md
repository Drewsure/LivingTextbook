# Teacher Draft Owner and Policy Binding Checks

This check covers the separation between tenant-scoped teacher review authorization and school policy acceptance.

## Required guarantees

- Draft, tenant, package, persistence-preflight, policy-preflight, and acceptance-preview identities reconcile exactly.
- Teacher review authorization cannot be interpreted as school policy acceptance.
- School policy evidence cannot be interpreted as teacher owner authorization.
- Policy remains `not-accepted`; persistence activation, assignment, and signature capture remain blocked.

## Verification

Run `npm run verify:source-draft-import` for the static route/contract check and `npm run verify:runtime-behavior` for identity and flag mutation checks.
