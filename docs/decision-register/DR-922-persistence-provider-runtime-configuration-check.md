# DR-922: Persistence Provider Runtime Configuration Check

## Decision

Keep provider configuration behavior executable through a focused runtime
verification script in addition to static adapter and route checks.

## Included

- Unset `process-memory` rehearsal default.
- Supported `process-memory` and `sqlite` values.
- Whitespace trimming for deployment configuration.
- Invalid provider values reported as invalid and unable to select a durable
  provider.

## Excluded

Database creation, hosted vendor selection, credential handling, learner data,
durable write activation, and deployment approval.

See ADR 0850 and
`docs/verification/PERSISTENCE_ADAPTER_SEAM_CHECKS.md`.
