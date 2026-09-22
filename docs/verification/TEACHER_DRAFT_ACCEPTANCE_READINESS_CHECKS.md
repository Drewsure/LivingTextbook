# Teacher Draft Acceptance Readiness Checks

This check reconciles the future acceptance-record preview with draft ownership, retention, export, recovery, rollback, and persistence activation evidence.

## Required guarantees

- The readiness packet matches the exact tenant, draft, package, release candidate, owner-policy binding, and acceptance preview.
- Retention and audit acceptance remain false until the appropriate school or publisher policy is accepted.
- Export, deletion, backup, restore, rollback, persistence activation, signature capture, and assignment remain blocked.
- Raw learner audio and transcripts remain excluded from core retention and export paths.
- The packet remains provider-neutral and review-only.

## Verification

Run `npm run verify:source-draft-import` for the static contract check and `npm run verify:runtime-behavior` for identity and mutation checks.
