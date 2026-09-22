# DR-1016: Pilot Handoff Approval Evidence

The canonical pilot handoff now carries the scoped approval-ledger summary.
Counts are derived from required sign-offs and must reconcile. Tenant/package
drift, invalid counts, signature capture, and package promotion remain blocked.

Evidence:

- `packages/content-model/src/pilotHandoff.ts`
- `apps/web/src/data/samplePilotHandoffPackage.ts`
- `apps/web/src/features/pilot/PilotHandoffPackagePanel.tsx`
- `scripts/verify-runtime-behavior.mjs`
