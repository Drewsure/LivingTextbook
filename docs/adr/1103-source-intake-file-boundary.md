# ADR 1103: Source Intake File Boundary

## Status

Accepted.

## Decision

The review-only source runtime requires a MIME type compatible with the
declared source type and a positive source byte length no greater than 50 MiB.
These fields are checked before extraction, teacher-draft, package, or
student-facing decisions.

## Rationale

Checksums and declared file policy alone do not prove that a future upload
matches its claimed document channel or remains within an acceptable review
budget. Carrying MIME and size through the shared contract makes the later
upload adapter auditable and prevents silent policy drift.

## Guardrails

- The runtime remains review-only and has no file-system write or extraction
  execution side effect.
- MIME compatibility is a source-type boundary, not a malware or rights
  approval.
- The 50 MiB ceiling is a shared upper bound; tenant policies may be stricter
  after their own review.
- Raw sources cannot become student payloads through this contract.

See `packages/content-model/src/sourceRuntime.ts` and
`scripts/verify-runtime-behavior.mjs`.
