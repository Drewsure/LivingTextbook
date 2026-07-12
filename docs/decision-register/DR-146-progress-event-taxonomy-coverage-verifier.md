# DR-146: Progress Event Taxonomy Coverage Verifier

## Decision

Make progress event taxonomy coverage an automated verification gate.

## Reason

Manual taxonomy review is too easy to skip when adding new game or media events. A small verifier is a low-cost guardrail that keeps event storage, teacher reporting, mastery, and support-only behavior aligned.

## Standard

- `npm run verify:taxonomy` must pass.
- `npm run verify:foundation` runs taxonomy verification before typecheck/build/routes.
- Every shared `GameEventType` must be classified in the progress event taxonomy.
- Taxonomy events must not exist outside the shared event union.
