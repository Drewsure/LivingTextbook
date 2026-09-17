# DR-895: Teacher Rehearsal Reconciliation

## Decision

Teacher rehearsal evidence is displayed only after tenant, package, and
student-session binding checks pass. The teacher page derives a read-only
cross-route journey summary from the validated local event stream.

## Included

- Observed canonical activity modes in first-seen order.
- Coded counts for starts, answer results, completion, mastery, and learning
  audio requests.
- Latest progression snapshot and package identity.

## Excluded

- Hosted writes, exports, classroom records, raw audio, transcripts, reward
  mutation, progression mutation, and unlock authority.

See ADR 0823 and
`docs/verification/TEACHER_REHEARSAL_RECONCILIATION_CHECKS.md`.
