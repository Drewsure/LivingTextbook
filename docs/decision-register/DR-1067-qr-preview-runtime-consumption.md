# DR-1067: QR Preview Runtime Consumption

Decision: make the reviewed QR preview consume the shared review-only alias
adapter so its visible state cannot drift from the future activation contract.

Required invariants:

- The preview shows tenant, release, fallback, and rollback evidence from the
  shared runtime request.
- The preview explicitly reports no live mutation.
- The route must not write redirects, activate routes, swap packages, or
  execute rollback.

Evidence: `apps/web/src/app/q/[...segments]/page.tsx`,
`scripts/verify-qr-alias-preview-integration.mjs`, and
`docs/adr/0995-qr-preview-runtime-consumption.md`.
