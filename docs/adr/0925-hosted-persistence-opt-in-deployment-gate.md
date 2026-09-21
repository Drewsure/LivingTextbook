# ADR 0925: Hosted Persistence Opt-In Deployment Gate

Status: Accepted for review-only foundation

## Decision

Expose one read-only deployment-gate result for hosted persistence. Durable
managed mode is ready only when the SQLite provider, explicit durable-write
approval, signed student sessions, tenant-scoped teacher operations, school
policy, retention policy, release approval, and durable operations policy are
all present.

## Required invariants

- Process-memory remains explicitly `non-durable-rehearsal`.
- Missing durable gates return `blocked`; they never silently become healthy.
- The status endpoint may expose safe booleans and blocker text only; it must
  not expose secrets, database paths, learner records, raw audio, or transcripts.
- The gate is descriptive and read-only. It cannot change configuration or
  write learner data.

## Consequence

An operator can audit exactly why a tenant deployment is not ready for hosted
persistence and can distinguish a rehearsal from an approved durable path.
This keeps optional hosted persistence saleable without coupling the core
classroom package to a provider or enabling accidental writes.
