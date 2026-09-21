# DR-1012: Gated Persistence Phase Transition

Decision: treat the first interactive progression slice as complete and move
into a persistence-hardening phase without activating production learner
writes.

Required invariants:

- Process-memory remains the default non-durable rehearsal provider.
- The server-only SQLite adapter is the reference durable-managed provider,
  not an automatic production backend selection.
- Durable writes remain blocked until session identity, teacher authorization,
  school policy, retention, release, operations, and deployment gates all
  pass.
- Readiness and evidence surfaces remain safe and review-only; no secrets,
  database paths, learner records, raw audio, or transcripts are exposed.
- The persistence contract remains provider-neutral for hosted and local
  companion deployments.

Evidence: `docs/adr/0940-gated-persistence-phase-transition.md`,
`apps/web/src/server/persistence/progressionPersistenceAdapter.ts`, and
`apps/web/src/data/sampleBuildStageMap.ts`.
