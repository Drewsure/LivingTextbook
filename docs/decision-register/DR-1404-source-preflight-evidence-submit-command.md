# DR-1404: Guarded Source Preflight Evidence Submission

## Decision

Provide a credential-gated command for submitting the create-once source
preflight evidence request to the tenant-bound review endpoint.

## Boundary

The command sends metadata only. It rejects requests that do not explicitly
remain review-only, never accepts raw publisher files, never logs the bearer
token, and preserves package assembly, promotion, QR printing, persistence,
and student-facing use as blocked.

## Next gate

The authorized service must still bind the report to the exact quarantine
record and source checksum. Human review of rights, accessibility, content,
games, audio, media, release, and delivery remains required.
