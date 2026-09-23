# ADR 1097: Persistence Provider Conformance Gate

## Status

Accepted.

## Decision

The mandatory persistence runtime gate must execute provider conformance for
both the process-memory rehearsal adapter and the server-only SQLite reference
adapter, plus the progress-event persistence regression.

The conformance suite must prove equivalent idempotency and conflict behavior,
tenant-scoped reads and lists, event-stream privacy exclusions, and SQLite
restart durability using temporary test databases. It must not use learner
records or activate a browser-facing provider.

## Rationale

The platform promises a white-label local/hosted seam. A type-compatible
adapter interface is not enough: a tenant must not experience different
identity, replay, privacy, or event-reporting semantics merely because a
deployment selects a different provider. Making the existing conformance
checks part of the foundation gate catches drift before pilot or provider
selection work.

## Guardrails

- Process-memory remains rehearsal-only.
- SQLite remains server-only and explicitly configured.
- Temporary databases and synthetic identities are used by the regression.
- Raw learner audio and learner transcripts remain excluded from event-stream
  persistence.
- This gate does not enable anonymous browser writes, hosted cloud credentials,
  production accounts, or school rollout.

See `scripts/verify-persistence-provider-conformance.mjs`,
`scripts/verify-progress-event-persistence.mjs`, and
`docs/verification/DURABLE_PROGRESSION_STORAGE_CHECKS.md`.
