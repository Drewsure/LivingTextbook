# DR-1068: Printed QR Binding Preview

Decision: make printable worksheet previews consume the shared review-only QR
alias runtime before any long-lived textbook QR output exists.

Required invariants:

- Complete textbook identity resolves through the safe permanent QR path.
- Missing identity remains visible and uses a safe front-door fallback.
- The preview is draft/review-only and reports no side effect.
- QR generation, alias writes, redirect mutation, package swaps, local
  activation, rollback execution, and learner-data mutation remain blocked.

Evidence: `apps/web/src/data/samplePrintableQrAliasPreview.ts`,
`apps/web/src/features/printables/PrintableWorksheetPreview.tsx`,
`scripts/verify-qr-print-preview-integration.mjs`, and
`docs/verification/QR_PRINT_PREVIEW_INTEGRATION_CHECKS.md`.
