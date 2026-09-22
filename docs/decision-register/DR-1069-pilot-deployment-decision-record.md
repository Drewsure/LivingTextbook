# DR-1069: Explicit Pilot Deployment Decision Record

Decision: add a tenant- and package-bound review record for the first pilot
deployment model without treating a recommendation as approval.

Required invariants:

- Hosted PWA is the current lowest-cost recommendation.
- The selected option remains unset until a human school or publisher owner
  decides.
- The record is review-only, side-effect free, and activation-blocked.
- Persistence activation, classroom launch, package promotion, QR mutation,
  report export, and provider migration remain false.
- Evidence bindings retain deployment guide, persistence preflight, and pilot
  handoff scope.

Evidence: `packages/content-model/src/pilotDeploymentDecision.ts`,
`apps/web/src/data/samplePilotDeploymentDecision.ts`,
`apps/web/src/features/pilot/PilotDeploymentDecisionPanel.tsx`, and
`scripts/verify-pilot-deployment-decision.mjs`.
