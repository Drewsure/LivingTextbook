# DR-997: Hosted Persistence Opt-In Deployment Gate

Decision: compose provider, write approval, identity boundaries, school policy,
retention, release approval, and operations readiness into one read-only
hosted persistence deployment gate.

Required invariants:

- Process-memory is rehearsal-only and never durable-ready.
- SQLite is durable-ready only when every explicit gate is true.
- Missing gates fail closed without configuration mutation or learner-data
  writes.
- Status responses exclude secrets, paths, learner records, raw audio, and
  transcripts.

Evidence: `docs/adr/0925-hosted-persistence-opt-in-deployment-gate.md`,
`apps/web/src/server/persistence/persistenceReadiness.ts`,
`apps/web/src/app/api/persistence/status/route.ts`, and
`scripts/verify-persistence-readiness.mjs`.
