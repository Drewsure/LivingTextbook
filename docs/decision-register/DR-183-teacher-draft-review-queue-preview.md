# DR-183: Teacher Draft Review Queue Preview

## Decision

Add a read-only teacher draft review queue route at `/teacher/review`.

## Rationale

The white-label platform needs a believable path from teacher draft edits to review, but live verifier submission and package approval remain unsafe until persistence, ownership, verifier workflow, audio, rights, and approval gates exist.

## Implications

- The app shell exposes `Review Queue`.
- Active route verification grows to 38 routes.
- Teacher authoring verification checks the queue boundaries.
- The queue cannot approve, submit, publish, or assign.

## Next

Connect review queue items to durable handoff records only after backend, auth, verifier, and approval workflow decisions are accepted.
