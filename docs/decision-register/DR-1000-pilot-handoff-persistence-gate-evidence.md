# DR-1000: Pilot Handoff Persistence Gate Evidence

Decision: the review-only pilot handoff package must carry a safe persistence
gate summary bound to its tenant, report package, and launch scope.

Required invariants:

- Gate status, mode, timestamp, and blocker text are evidence only; they never
  authorize writes, launch, export, or release mutation.
- Tenant, package, and launch scope must match the report snapshot evidence.
- Gate writes remain false, and blocked or rehearsal states must explain why
  the pilot is not yet durable-ready.
- Secrets, database paths, learner records, raw audio, and transcripts remain
  excluded.

Evidence: `docs/adr/0928-pilot-handoff-persistence-gate-evidence.md`,
`packages/content-model/src/pilotHandoff.ts`,
`apps/web/src/features/pilot/PilotHandoffPackagePanel.tsx`, and
`apps/web/src/data/samplePilotHandoffPackage.ts`.
