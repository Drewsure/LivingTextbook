# Pilot Policy Lineage Checks

Run these checks when pilot deployment, school policy, retention, or hosted
and local persistence boundaries change.

## Required checks

- `npm run verify:pilot-deployment-decision`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:routes`

## Required behavior

- The deployment decision carries tenant/package-bound policy preflight and
  future acceptance-preview identities.
- The sample policy status is `not-accepted`.
- Missing policy lineage and accepted/activated policy status fail validation.
- The pilot panel shows policy lineage and keeps the surface review-only.
- Policy lineage cannot authorize persistence, classroom launch, report export,
  QR mutation, package promotion, or provider migration.
