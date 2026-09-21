# DR-982: Hosted Progress Event Evidence

## Decision

Add a policy-gated hosted persistence lane for completed canonical game event
evidence, separate from the latest progression snapshot.

## Why

Teacher reporting, replay review, and support/audio auditing require the
accepted event sequence, not only the final Star Dust snapshot. Keeping the
stream separate makes the audit boundary explicit and prevents progression
reads from being mistaken for report evidence.

## Boundaries

- No raw learner audio or transcript storage.
- No support-language-only progress or media-only mastery.
- No browser-supplied policy or taxonomy authority.
- No cross-tenant reads or idempotency-key reuse.
- No default durable writes; deployment gates and signed identity remain
  required.

## Evidence

- ADR 0910
- `packages/content-model/src/progressEventPersistence.ts`
- `apps/web/src/app/api/persistence/events/route.ts`
- `scripts/verify-progress-event-persistence.mjs`
