# DR-248 School Launch Policy Gate

Date: 2026-07-16

## Decision

Add a school launch policy gate preview before any live classroom launch, policy acceptance workflow, or launch-ready status exists.

## Rationale

The platform must support white-label partner demos without letting demo polish imply school launch approval. A school-approved launch requires privacy, retention, reporting, access-control, learner-data, support-language, microphone, AI Tutor, media, local deployment, storage, evidence, and dry-run decisions to be owned clearly.

## Guardrails

- No school policy acceptance workflow.
- No approval workflow.
- No live classroom launch.
- No real learner data collection.
- No teacher report export.
- No local deployment activation.
- No release-state mutation.
- No support-language-only progression.

## Verification

- `npm run verify:release-control`
- `npm run verify:foundation`
