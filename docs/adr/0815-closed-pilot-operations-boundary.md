# ADR 0815: Closed-Pilot Operations Boundary

## Decision

Add a server-only operations layer around the first SQLite progression
provider. It provides health diagnostics, policy-gated backup, policy-gated
restore, and identity-scoped retention deletion. The browser receives only a
teacher-safe status summary. Backups carry a SHA-256 manifest so restore
evidence can prove that the reviewed file is the file being restored.

## Rationale

Durable student progression is not pilot-ready until continuity can be
checked, recovered, and deleted under an explicit school policy. Exposing
backup or deletion controls directly to a teacher browser would create an
unsafe authority boundary and would imply a production workflow before access
control, audit, and export policy are complete.

## Guardrails

- Operations require an explicit operations gate plus school, retention, and
  release approvals.
- Backup and restore are evidence procedures, not student-facing actions.
- Deletion is scoped to the complete tenant/package/launch/session identity.
- Backup manifests include a checksum, schema version, retention period, and
  explicit raw-audio/transcript exclusion markers.
- Restore rejects a checksum mismatch before the restored file is accepted as
  evidence.
- The status endpoint returns no learner records, credentials, database paths,
  raw audio, or transcripts.
- The operations layer does not activate cloud launch, teacher exports, or
  local package synchronization.

## Verification

Run `npm run verify:durable-operations`, web typecheck, the production build,
and active-route verification. See
`docs/verification/DURABLE_PROGRESSION_OPERATIONS_CHECKS.md`.
