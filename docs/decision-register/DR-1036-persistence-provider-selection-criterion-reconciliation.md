# DR-1036: Persistence Provider Selection Criterion Reconciliation

Decision: preserve criterion-level backend selection evidence rather than
trusting an aggregate open-criteria count.

Required invariants:

- Every criterion has a unique ID, supported status, and owner.
- The open-criteria count equals the number of non-passed criteria.
- Deployment fit and cost posture match the recommended candidate.
- Criterion evidence remains bound to the tenant, package, matrix, gate, and
  implementation-readiness records.
- Provider selection, migration, writes, and activation remain false.

Evidence: `docs/adr/0964-persistence-provider-selection-criterion-reconciliation.md`,
`packages/content-model/src/persistenceProviderSelectionPreflight.ts`,
`apps/web/src/features/persistence/PersistenceProviderSelectionPreflightPanel.tsx`,
and `scripts/verify-persistence-provider-selection-preflight-behavior.mjs`.
