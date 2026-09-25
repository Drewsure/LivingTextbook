# DR-1193: Local Bundle Composite Readiness Assessment

Decision: reconcile the local companion manifest, tenant identity, read-only
route and asset resolver, media evidence, persistence admission, deployment
preflight, and release checks through one shared review-only assessment.

The assessment returns `blocked`, `review-ready`, or
`offline-ready-candidate`. The last status is deliberately only a candidate:
export, offline activation, and student-facing promotion remain false.

This keeps the white-label local deployment promise honest while giving future
installers and partner handoffs one machine-readable gate to consume. It also
prevents the UI snapshot and the runtime resolver from silently making
different readiness decisions.

Evidence: `packages/content-model/src/localBundleReadinessAssessment.ts`,
`apps/web/src/data/localBundleReadinessAssessment.ts`,
`scripts/verify-local-bundle-readiness-assessment.mjs`, and ADR 1193.
