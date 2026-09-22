# DR-1070: Pilot Policy Lineage

Decision: bind the pilot deployment decision to explicit tenant school-policy
review records without treating those records as accepted policy.

The decision references the school-policy acceptance preflight and the future
acceptance-record preview by stable identity. The sample remains
`not-accepted`, and policy lineage cannot authorize persistence, classroom
launch, report export, QR mutation, package promotion, or provider migration.

Evidence: `packages/content-model/src/pilotDeploymentDecision.ts`,
`apps/web/src/data/samplePilotDeploymentDecision.ts`,
`apps/web/src/features/pilot/PilotDeploymentDecisionPanel.tsx`, and
`scripts/verify-pilot-deployment-decision.mjs`.
