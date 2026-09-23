# ADR 1131: Controlled-Pilot Approval Readiness

## Decision

Add a provider-neutral, tenant/package-scoped readiness contract that joins
the accepted composite evidence release binding, the controlled pilot review
decision, and the reviewer identity/signature gate.

The contract may identify a packet as ready for a future human review, but it
must not capture approval, mutate release state, activate an assignment, or
launch students.

## State Rules

- Evidence, release-control, and reviewer-gate blockers remain distinct.
- Scope drift is an explicit release-control blocker.
- All readiness records remain `mode: review-only`.
- Approval capture, release mutation, and student launch remain false.
- A future human approval record must still define its identity, signature,
  audit, retention, and storage policy before live behavior is designed.

## Verification

- `npm run verify:controlled-pilot-approval-readiness`
- `npm run verify:routes`
- `npm run verify:foundation`
