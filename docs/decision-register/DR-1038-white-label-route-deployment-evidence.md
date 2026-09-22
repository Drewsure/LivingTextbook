# DR-1038: White-label route and deployment evidence binding

Decision: bind current route health and deployment review evidence directly to
the white-label release-readiness record.

Required invariants:

- Active and expected route counts reconcile exactly.
- The route matrix, active-route verifier, and deployment guide are named.
- Deployment status remains review-only.
- Route health cannot authorize student launch, persistence, QR mutation,
  offline delivery, installer export, or package promotion.

Evidence: `packages/content-model/src/whiteLabelReleaseReadiness.ts`,
`apps/web/src/data/sampleWhiteLabelReleaseReadiness.ts`,
`apps/web/src/features/release/WhiteLabelReleaseReadinessPanel.tsx`, and
`scripts/verify-white-label-release-readiness-behavior.mjs`.

