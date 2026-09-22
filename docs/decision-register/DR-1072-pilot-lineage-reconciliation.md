# DR-1072: Pilot Lineage Reconciliation

Decision: resolve pilot activation evidence against its deployment, policy,
and acceptance-preview source records before treating the handoff as aligned.

Required invariants:

- Source ids match exactly.
- Tenant and package scope match the handoff.
- Selection and non-accepted policy status remain aligned.
- Review-only and activation-blocked flags remain intact.

Evidence: `packages/content-model/src/pilotHandoff.ts`,
`apps/web/src/data/samplePilotLineageValidation.ts`,
`scripts/verify-pilot-lineage-binding.mjs`, and
`scripts/verify-runtime-behavior.mjs`.
