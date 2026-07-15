# DR-226: Launch Safety Boundary Verifier

Date: 2026-07-15

## Decision

Add `npm run verify:launch-safety` to the foundation gate.

## Rationale

Launch safety now spans student launch, front-door, assignment, teacher monitor, and report package surfaces. A dedicated verifier makes the rule visible, repeatable, and harder to weaken during fast build sessions.

## Standard

- `npm run verify:launch-safety` must pass after changing launch, assignment, teacher session, report package, or classroom launch gate behavior.
- The verifier must protect `No live classroom launch`, `Target language unlocks progress`, `No production student accounts`, `Real learner data blocked`, `Report export still blocked`, and `Session launch gate boundary`.
- The verifier is a foundation guard only; it does not enable live launch, production accounts, real learner data, or report export.
