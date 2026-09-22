# DR-1035: Persistence Provider Selection Evidence

Decision: bind provider-neutral persistence comparison to the authoritative
backend matrix, selection gate, and implementation-readiness records before a
provider-specific work order can be created.

Required invariants:

- Selection evidence matches the preflight tenant, package, backend matrix,
  implementation handoff, and recommended candidate.
- Deployment fit and cost posture remain explicit and reviewable.
- A blocked preflight exposes at least one open selection criterion.
- At least three source records support the comparison.
- Provider selection, migration, persistence writes, and activation remain
  false until human policy and implementation gates pass.

Evidence: `docs/adr/0963-persistence-provider-selection-evidence.md`,
`packages/content-model/src/persistenceProviderSelectionPreflight.ts`,
`apps/web/src/data/samplePersistenceProviderSelectionPreflight.ts`, and
`scripts/verify-persistence-provider-selection-preflight-behavior.mjs`.
