# DR-254 School Policy Acceptance Preflight Storage Contract

Date: 2026-07-16

## Decision

Add the backend-neutral storage contract for school policy acceptance preflight records.

## Rationale

The acceptance preflight should not remain UI-only. A white-label product needs durable hosted/local metadata for identity, policy text, evidence storage, release-control binding, support-language limits, microphone and AI Tutor opt-ins, rollback, revocation, minimum acceptance fields, and blocked actions before any future acceptance workflow can exist.

## Guardrails

- No accept button.
- No policy acceptance workflow.
- No signed approval capture.
- No evidence export.
- No storage activation.
- No release-state mutation.
- No launch-ready status.
- No production QR promise.
- No AI Tutor activation.
- No support-language-only progression.
- No live classroom workflow.
- No real learner data collection.
- No teacher report export.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:foundation`
