# DR-1071: Persistence Activation Lineage

Decision: require pilot handoff activation evidence to carry the exact
deployment decision and school-policy lineage used by the persistence gate.

Activation evidence names the deployment decision, policy preflight, and future
acceptance-record preview. The foundation sample remains unselected,
`not-accepted`, and `canActivate: false`; learner writes remain blocked.

Evidence: `packages/content-model/src/pilotHandoff.ts`,
`apps/web/src/data/samplePilotHandoffPackage.ts`,
`apps/web/src/features/pilot/PilotHandoffPackagePanel.tsx`, and
`scripts/verify-persistence-activation-preflight.mjs`.
