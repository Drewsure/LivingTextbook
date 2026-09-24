# DR-1163: Deployment Handoff Source Reconciliation

Decision: Reconcile persisted deployment handoffs against their continuity
decision source before review.

- Compare source, tenant, package, storage preflight, and storage gate IDs.
- Require the source continuity evidence binding.
- Keep all handoff side effects disabled.

References: ADR 1163, Build session 1077, and
`scripts/verify-deployment-continuity-handoff-storage-identity.mjs`.
