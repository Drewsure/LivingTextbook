# DR-1037: Active Route Count Source of Truth

Decision: align current route health evidence to the 89-entry active route
matrix and include the deployment decision workbench in foundation composition.

Required invariants:

- Current dashboards and checklists say 89 active routes.
- Current route, deployment, pilot, entitlement, partner-intake, and generator
  verifiers expect the same count.
- Historical notes remain historical and are not rewritten as current evidence.
- Deployment workbench verification is part of the foundation composition gate.
- Route health never authorizes student launch, storage, offline delivery,
  installer export, or Z.ai source promotion.

Evidence: `apps/web/src/data/sampleActiveRouteMatrix.ts`,
`scripts/verify-active-routes.mjs`,
`scripts/verify-foundation-composition.mjs`, and
`docs/adr/0965-active-route-count-source-of-truth.md`.
