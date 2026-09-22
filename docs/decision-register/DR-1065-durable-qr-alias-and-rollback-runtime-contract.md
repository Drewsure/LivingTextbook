# DR-1065: Durable QR Alias And Rollback Runtime Contract

Decision: establish one provider-neutral QR alias and rollback evidence shape
before hosted, local, or hybrid route mutation is implemented.

Required invariants:

- Alias, tenant, package, current release, and previous release identities are
  explicit and bound together.
- Target and fallback paths are safe internal routes; direct files, localhost,
  traversal, and raw media paths are rejected.
- Active alias readiness requires release approval, persistence readiness,
  local-fallback readiness, and rollback approval evidence.
- The review-only adapter reports no side effect and cannot mutate QR
  redirects, route registries, packages, local bundles, learner data, or
  rollback state.

Evidence: `packages/content-model/src/qrAliasRuntime.ts`,
`apps/web/src/data/sampleQrAliasRollbackEvidence.ts`,
`scripts/verify-qr-alias-rollback-boundary.mjs`, and
`docs/adr/0993-durable-qr-alias-and-rollback-runtime-contract.md`.
