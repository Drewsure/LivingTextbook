# ADR 1099: Persistence Payload Shape Bounds

## Status

Accepted.

## Decision

The content-model persistence contracts must fail closed on structured payload
size and shape before records reach a provider or a teacher report. Event
streams are capped at 256 events; metadata is limited to 32 scalar entries
with bounded keys and values; tenant/package/launch/unit/event identities and
routes are bounded; and progression mode lists are capped at 48 entries.

The same validators are used for browser-originated requests, server-created
records, provider reads, and replay evidence. The HTTP request-body limit is a
transport safeguard, not a replacement for model-level limits.

## Rationale

Persistence is a white-label platform boundary. Unbounded structured values
can create storage-cost surprises, destabilize teacher reporting, make logs
unsafe, and create inconsistent behavior when a future provider is introduced.
Centralizing the shape rules keeps process-memory, SQLite, hosted, local, and
future adapters aligned without coupling the platform to one backend.

## Guardrails

- Limits do not grant upload, storage, assignment, package promotion, or
  deployment permission.
- Raw learner audio and learner transcripts remain excluded from core event
  persistence.
- Target-language evidence remains the only progression authority.
- Provider selection, retention, authorization, release approval, and pilot
  activation remain separate gates.
- Runtime regression uses synthetic records only.

See `packages/content-model/src/progressEventTaxonomy.ts`,
`packages/content-model/src/progressionRuntime.ts`,
`packages/content-model/src/progressEventPersistence.ts`, and
`scripts/verify-runtime-behavior.mjs`.
