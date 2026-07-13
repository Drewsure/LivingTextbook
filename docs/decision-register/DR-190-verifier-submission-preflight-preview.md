# DR-190: Verifier Submission Preflight Preview

## Decision

Show a verifier submission preflight on the teacher draft review queue.

## Rationale

Drafts should not move into a live verifier workflow until schema, audio, support-language, route, evidence, and approval requirements are visible and blocked appropriately. A preflight preview makes the future handoff explicit without enabling automatic submission.

## Implications

- `/teacher/review` shows preflight checks for schema, audio, support language, route compatibility, and evidence.
- Automatic verifier submission remains blocked.
- Support language remains support-only and cannot trigger progression or review readiness by itself.

## Next

Add durable verifier submission storage only after authentication, verifier workflow ownership, evidence storage, and approval ledger rules are accepted.
