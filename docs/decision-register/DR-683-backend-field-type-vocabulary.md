# DR-683: Backend Field Type Vocabulary

Status: Accepted

## Decision

Schema fields, migration-only extensions, and migration specification fields
must use the shared backend field-type vocabulary. Unsupported provider types
are rejected by backend contract alignment.

## Evidence

- Regression coverage rejects unsupported schema field types.
- Regression coverage rejects unsupported migration specification field types.
- Backend storage readiness checks require the vocabulary and rejection guard.
- The full foundation verification gate passes with the current schema and
  migration plan.
- No backend vendor, adapter, or live storage write was enabled.

This decision is recorded in
`docs/adr/0611-backend-field-type-vocabulary.md`.
