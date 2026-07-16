# DR-256 School Policy Text Pack Storage Contract

Date: 2026-07-16

## Decision

Persist school policy text pack requirements as a backend-neutral storage contract before any school acceptance text can become accepted terms.

## Rationale

White-label pilots need exact, versioned school policy language for privacy, learner data, QR/progression, publisher media, local package, microphone, AI Tutor, storage, rollback, evidence, signature method, and revocation. The platform should preserve those clause versions across hosted and local implementations without enabling live acceptance, storage activation, or launch status.

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

- `npm run verify:backend-storage`
- `npm run verify:foundation`
