# DR-921: Persistence Provider Configuration Fails Closed

## Decision

Reject unsupported persistence provider configuration values as a blocked
deployment state instead of silently falling back to process-memory rehearsal.

## Included

- Explicit `process-memory` and `sqlite` provider values.
- Safe process-memory default when the variable is unset.
- Blocked progression, status, and operations responses for invalid values.
- No disclosure of credentials, database paths, learner records, raw audio, or
  transcripts.

## Excluded

Hosted cloud provider selection, browser provider selection, durable-write
authorization, and production deployment approval.

See ADR 0849 and
`docs/verification/PERSISTENCE_ADAPTER_SEAM_CHECKS.md`.
