# DR-1033: White-Label Quality Evidence Records

Decision: require source-backed evidence records for every white-label release
quality signal.

Required invariants:

- Exactly seven unique records cover typecheck, production build, active
  routes, runtime, browser, privacy, and tenant isolation.
- Each record has a source record, ISO observation timestamp, notes, and a
  verified value matching the quality signal.
- Quality evidence is not production approval and cannot authorize student
  launch, data collection, or provider activation.

Evidence: `docs/adr/0961-white-label-quality-evidence-records.md`,
`packages/content-model/src/whiteLabelReleaseReadiness.ts`,
`apps/web/src/data/sampleWhiteLabelReleaseReadiness.ts`, and
`scripts/verify-white-label-release-readiness-behavior.mjs`.
