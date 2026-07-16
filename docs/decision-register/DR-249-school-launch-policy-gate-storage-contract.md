# DR-249 School Launch Policy Gate Storage Contract

Date: 2026-07-16

## Decision

Add the backend-neutral storage contract for school launch policy gates.

## Rationale

The visible school launch policy gate must not remain UI-only. A white-label platform needs a durable, hosted/local-compatible record before any school policy acceptance, local deployment activation, live classroom launch, report export, or launch-ready status exists.

## Guardrails

- No school policy acceptance workflow.
- No approval workflow.
- No live classroom launch.
- No real learner data collection.
- No teacher report export.
- No local deployment activation.
- No release-state mutation.
- No launch-ready status.
- No support-language-only progression.
- No backend vendor selection.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:foundation`
