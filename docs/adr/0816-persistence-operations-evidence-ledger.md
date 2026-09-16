# ADR 0816: Persistence Operations Evidence Ledger

## Decision

Record completed backup, checksum-verified restore, and identity-scoped
retention-deletion operations in a SQLite metadata-only evidence table. Expose
the receipts through a read-only teacher-safe route and no browser mutation
route.

## Rationale

A recovery procedure without a receipt is difficult to review, support, or
hand off to a school. The receipt must prove what happened without becoming a
second learner-data store. A one-way scope digest allows deletion evidence to
be related to a request without retaining the raw student-session identity.

## Guardrails

- Receipt creation is server-side and follows the existing operations gates.
- Receipts contain no progression payload, student-session ID, raw audio,
  transcript, credential, or database path.
- The teacher route is read-only and cannot start backup, restore, deletion,
  export, or classroom launch.
- Missing evidence must not be presented as successful recovery.

## Verification

Run `npm run verify:durable-operations`, web typecheck, production build, and
active-route verification after changes. See
`docs/verification/PERSISTENCE_OPERATIONS_EVIDENCE_CHECKS.md`.
