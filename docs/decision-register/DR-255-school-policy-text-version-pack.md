# DR-255 School Policy Text Version Pack

Date: 2026-07-16

## Decision

Add a review-only school policy text version pack before any school acceptance text, accept button, or signature workflow exists.

## Rationale

White-label school adoption cannot rely on vague meeting notes. The platform needs versioned policy clause areas for privacy, learner data, QR/progression, publisher media, local package, microphone, AI Tutor, storage, rollback, evidence, signature method, and revocation before future acceptance workflow design.

## Guardrails

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

- `npm run verify:release-control`
- `npm run verify:foundation`
