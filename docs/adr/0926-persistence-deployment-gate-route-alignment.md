# ADR 0926: Persistence Deployment Gate Route Alignment

Status: Accepted for review-only foundation

## Decision

Use one server-side persistence deployment-gate snapshot for the status
endpoint, student session issuance, durable progression writes, and durable
event-stream writes. The snapshot composes provider configuration, signed
student sessions, tenant-scoped teacher operations, school policy, retention,
release approval, and operational readiness.

## Required invariants

- Process-memory remains rehearsal-only.
- A durable student session is not issued while the durable deployment gate is
  blocked.
- Durable progression and event writes fail closed with the same blocker set
  shown by the status endpoint.
- Tenant/session authorization remains a separate check after deployment
  readiness; a ready deployment does not widen identity scope.
- No route may expose secrets, database paths, learner records, raw audio, or
  transcripts.

## Consequence

The first hosted persistence smoke path has one auditable readiness decision.
Operators can test route behavior without accidentally creating a partially
enabled persistence deployment, and future provider adapters have a single
contract to implement.
