# DR-184: Reviewer Decision Preview

## Decision

Show disabled reviewer decision options on the teacher draft review queue.

## Rationale

Reviewers need to see how drafts will move through return-for-edits, audio-review, and approval lanes, but real decisions require identity, evidence storage, verifier workflow, package approval, and release-control policy.

## Implications

- `/teacher/review` shows `Return for edits`, `Needs audio`, and `Ready for approval`.
- Decision actions remain disabled.
- Approval, publishing, and student assignment remain blocked.
- Future workflow implementation must preserve evidence requirements and blockers.

## Next

Add durable reviewer decision storage only after auth, verifier workflow, evidence storage, and approval ledger contracts are accepted.
