# ADR 0927: Pilot Preflight Authoritative Persistence Gate

Status: Accepted for review-only foundation

## Decision

Pilot preflight must consume the explicit persistence deployment gate returned
by the status endpoint. A healthy SQLite check is insufficient on its own:
the gate must be `ready` before persistence can satisfy pilot review.

The status endpoint must also expose the effective status as `rehearsal` for
process-memory and `blocked` whenever the durable deployment gate is blocked.

## Required invariants

- A rehearsal deployment cannot appear healthy or pilot-ready.
- Missing durable write approval, identity boundaries, school policy,
  retention, release approval, or operations readiness keeps pilot persistence
  blocked.
- Pilot preflight remains review-only and never authorizes classroom launch or
  durable writes.
- Blocker text remains safe and excludes secrets, paths, learner records, raw
  audio, and transcripts.

## Consequence

Teacher review and pilot handoff now use the same persistence decision that
controls the server write boundary. The platform cannot accidentally present a
partially configured hosted deployment as pilot-ready.
