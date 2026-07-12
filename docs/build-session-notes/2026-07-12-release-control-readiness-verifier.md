# 2026-07-12: Release Control Readiness Verifier

Added `npm run verify:release-control` and wired it into `npm run verify:foundation`.

The verifier protects the demo-visible versus pilot-publishable boundary by checking package publish gates, approval ledger signoffs, derived release candidate logic, and release-control storage previews.
