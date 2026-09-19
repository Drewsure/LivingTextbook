# DR-951: Persistence Operator-State Clarity

## Decision

Teacher persistence surfaces must render blocked policy, unauthorized access,
missing records, provider unavailability, and malformed transport responses as
distinct states.

## Required Invariants

- “No record” is shown only for a valid authorized lookup with no matching
  record.
- A deployment policy block remains visibly blocked.
- Provider unavailability remains visibly unavailable and is not presented as an
  empty learner result.
- No status panel reveals database paths, credentials, raw audio, transcripts,
  or learner records beyond the authorized coded result.

## Evidence

- `apps/web/src/features/persistence/HostedProgressionAdapterPanel.tsx`
- `apps/web/src/features/persistence/hostedProgressionPersistenceClient.ts`
- `docs/verification/PERSISTENCE_ADAPTER_SEAM_CHECKS.md`
