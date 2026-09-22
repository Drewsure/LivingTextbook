# DR-1014: Pilot Handoff Activation Evidence

Decision: bind the durable-write activation preflight into the canonical pilot
handoff package.

Required invariants:

- Tenant and package identity must match the handoff package.
- Requested mode, passed/open/blocked counts, and blocker reasons remain
  explicit.
- `canActivate` remains false and handoff mode remains review-only.
- The package cannot activate storage, approve a school, create an assignment,
  or accept learner data.

Evidence: `docs/adr/0942-pilot-handoff-activation-evidence.md`,
`packages/content-model/src/pilotHandoff.ts`, and
`apps/web/src/features/pilot/PilotHandoffPackagePanel.tsx`.
