# DR-258 School Acceptance Record Preview Storage Contract

Date: 2026-07-16

## Decision

Persist school acceptance record preview requirements as a backend-neutral storage contract before accepted terms, signatures, evidence export, storage activation, or launch-ready status can exist.

## Rationale

White-label pilots need the future accepted-record shape to be durable and auditable across hosted and local deployments. Preserving minimum accepted-record fields and non-accepted markers makes later acceptance implementation safer while preventing early legal, storage, reporting, QR, AI Tutor, or classroom-launch behavior.

## Guardrails

- No accepted terms storage.
- No policy acceptance workflow.
- No accept button.
- No signed approval capture.
- No evidence export.
- No storage activation.
- No release-state mutation.
- No launch-ready status.
- No production QR promise.
- No AI Tutor activation.
- No support-language-only progression.
- No real learner data collection.
- No teacher report export.
- No live classroom workflow.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:foundation`
