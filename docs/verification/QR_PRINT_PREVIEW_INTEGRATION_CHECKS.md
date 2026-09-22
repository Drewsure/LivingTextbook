# QR Print Preview Integration Checks

Run these checks when printed worksheet QR binding behavior changes.

## Required Checks

- `npm run verify:qr-print-preview-integration`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:foundation-composition`

## Required Behavior

- The printable worksheet preview consumes the shared review-only QR alias
  runtime adapter.
- Complete textbook identity resolves to a safe permanent QR path.
- Missing textbook identity remains visible and uses a safe front-door fallback.
- The request remains draft/review-only with rollback and learner-data
  mutation disabled.
- No QR image generation, alias write, redirect mutation, package swap, local
  activation, or rollback execution is present.

## Release Boundary

Browser printing remains a preview capability. Long-lived textbook printing
requires durable alias persistence, package and release approval, rights
evidence, local fallback readiness, rollback approval, and a future reviewed QR
renderer.
