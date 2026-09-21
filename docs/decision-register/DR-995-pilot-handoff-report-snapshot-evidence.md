# DR-995: Pilot Handoff Report Snapshot Evidence

Decision: include sanitized report snapshot evidence in the partner pilot
handoff package for hosted-managed and local-classroom rehearsal modes.

Required invariants:

- Tenant, package, launch, and deployment scope remain visible and aligned.
- Recovery packet validity is evidence only, not execution permission.
- Export, writes, provider activation, classroom launch, raw learner audio,
  transcripts, and real learner identifiers remain blocked or excluded.
- The packet must fail closed when its evidence contract is incomplete.

Evidence: `docs/adr/0923-pilot-handoff-report-snapshot-evidence.md`,
`packages/content-model/src/pilotHandoff.ts`,
`apps/web/src/features/pilot/PilotHandoffPackagePanel.tsx`, and
`scripts/verify-active-routes.mjs`.
