# DR-251 School Policy Handoff Storage Contract

Date: 2026-07-16

## Decision

Add the backend-neutral storage contract for school policy handoff packets.

## Rationale

The handoff packet should not remain UI-only. A white-label product needs the school meeting packet, evidence needs, deferred decisions, and blocked actions to have a hosted/local-compatible record before any future acceptance, evidence export, or launch workflow exists.

## Guardrails

- No policy acceptance workflow.
- No signed approval capture.
- No evidence export.
- No release-state mutation.
- No launch-ready status.
- No local deployment activation.
- No production QR promise.
- No live classroom workflow.
- No real learner data collection.
- No teacher report export.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:foundation`
