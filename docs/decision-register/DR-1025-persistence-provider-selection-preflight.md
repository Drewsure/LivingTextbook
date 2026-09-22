# DR-1025: Persistence Provider Selection Preflight

Decision: use one provider-neutral comparison preflight before selecting or
implementing hosted, closed-local, or hybrid persistence.

The sample binds the backend matrix, evidence-storage gate, and implementation
readiness handoff to the same tenant and package. It remains blocked and has
no provider, migration, write, or activation authority.

Evidence: `docs/adr/0953-persistence-provider-selection-preflight.md`,
`packages/content-model/src/persistenceProviderSelectionPreflight.ts`, and
`scripts/verify-persistence-provider-selection-preflight.mjs`.
