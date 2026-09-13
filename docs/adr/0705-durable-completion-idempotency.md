# ADR 0705: Durable Completion Idempotency Contract

## Decision

Hosted and local progress-event persistence must carry one canonical
completion idempotency key for each tenant, unit, launch, student session, and
game mode. The write boundary must reject duplicate completion writes and use
an atomic create-or-return-existing operation.

## Context

The browser flows now prevent duplicate completion callbacks in one route
session. Durable storage still needs an independent boundary because retries,
multiple tabs, offline replay, and network timeouts can repeat a completion
request after the browser guard is gone.

## Contract

Use `createCanonicalCompletionIdempotencyKey` from the content model. Its
stable field set is:

- `tenant_id`
- `unit_key`
- `launch_code`
- `student_session_id`
- `game_mode`

Progress-event durable records and hosted/local write intents must preserve
these fields, reject duplicate completion writes, and require atomic completion
writes. A progress-event write request must include the resulting key.

The key is an identity boundary, not a reward rule. The stored event must still
pass event acceptance, tenant, policy, scoring, audio, progression, and report
contracts before any downstream effect is accepted.

## Consequences

- Hosted and local adapters can converge on the same retry behavior.
- Offline synchronization can safely replay accepted events without double
  awarding Star Dust.
- A future backend may return the original accepted result for a duplicate key
  rather than creating a second event.
- Storage implementation, schema migration, and policy approval remain open;
  this ADR does not select a database or enable live writes.

See `COMPLETION_IDEMPOTENCE_CHECKS.md` and
`2026-09-13-completion-idempotence.md`.
