# ADR 0849: Persistence Provider Configuration Fails Closed

## Status

Accepted.

## Decision

Treat an unsupported `LIVING_TEXTBOOK_PERSISTENCE_PROVIDER` value as a blocked
deployment configuration. An unset value remains the explicit, safe
`process-memory` rehearsal default; only `process-memory` and `sqlite` are
accepted provider values.

## Rationale

Silently treating a typo or future provider name as process-memory could make a
deployment appear operational while losing restart durability. Configuration
errors must be visible to teacher-safe status and API callers without exposing
credentials or database paths.

## Guardrails

- Browser input cannot select the provider.
- Invalid provider configuration blocks progression reads/writes and operations
  responses.
- The blocked response remains tenant-safe and contains no provider secret,
  database path, learner record, raw audio, or transcript.
- This decision does not choose a hosted cloud provider.

See `docs/verification/PERSISTENCE_ADAPTER_SEAM_CHECKS.md` and
`docs/decision-register/DR-921-persistence-provider-configuration-fail-closed.md`.
