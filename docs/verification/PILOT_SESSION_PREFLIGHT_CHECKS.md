# Pilot Session Preflight Checks

## Purpose

Protect the deterministic, review-only preflight for the tenant-scoped pilot
evidence envelope.

## Required invariants

- The evaluator checks tenant and session identity.
- The evaluator checks canonical workflow completion.
- The evaluator requires a target language.
- The evaluator rejects any enabled privacy-exclusion violation.
- The launch-boundary check remains blocked.
- `launchAllowed` is always `false`.
- `durableWriteAllowed` is always `false`.
- Invalid or incomplete evidence cannot unlock activity, award mastery, mutate
  rewards, create a live record, export a report, or authorize an assignment.
- The teacher preflight display is read-only and provider-neutral.

## Verification command

```text
npm run verify:pilot-rehearsal
```

This focused verifier must pass alongside web typecheck, production build, and
the active-route checks before the slice is considered ready for human review.
