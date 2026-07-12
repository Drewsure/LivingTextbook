# ADR 0165: Backend Storage Readiness Verifier

## Status

Accepted

## Context

The project is approaching backend selection, but the storage model must remain vendor-neutral and white-label compatible. Schema, migration candidates, migration specs, durable record plans, and adapter plans need to preserve the same product contract before any Supabase, Firebase, SQLite, or custom local implementation is chosen.

## Decision

Add `npm run verify:backend-storage` and include it in `npm run verify:foundation`.

## Consequences

- Backend selection work gets an automated readiness guard.
- Raw audio/transcript exclusions, event effect taxonomy, event acceptance gates, teacher session settings, and hosted/local adapter parity are checked before build/test.
- `/teacher/intake` shows backend storage readiness in the foundation gate.
- The verifier remains source-based and cheap to run.
