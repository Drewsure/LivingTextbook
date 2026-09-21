# DR-998: Persistence Deployment Gate Route Alignment

Decision: student session issuance, durable progression writes, durable event
writes, and persistence status must consume one server-side deployment-gate
snapshot.

Required invariants:

- Rehearsal remains non-durable and never reports durable readiness.
- Blocked durable deployment gates prevent session issuance and both durable
  write families.
- A matching signed student session or server-only token is still required
  after deployment readiness; the gate is not an identity grant.
- Cross-tenant requests fail closed, and status/write responses remain free of
  secrets, paths, learner records, raw audio, and transcripts.

Evidence: `docs/adr/0926-persistence-deployment-gate-route-alignment.md`,
`apps/web/src/server/persistence/persistenceDeploymentGate.ts`,
`apps/web/src/app/api/student/session/route.ts`,
`apps/web/src/app/api/persistence/progression/route.ts`,
`apps/web/src/app/api/persistence/events/route.ts`, and
`scripts/verify-persistence-deployment-gate-alignment.mjs`.
