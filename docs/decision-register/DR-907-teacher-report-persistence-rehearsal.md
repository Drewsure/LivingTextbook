# DR-907: Teacher Report Persistence Rehearsal

## Decision

Join the teacher report request, the tenant-bound persistence write intent,
and the durable teacher-report-package record in a review-only rehearsal
before any provider is allowed to write or export report packages.

## Verification

- `npm run verify:report-runtime`
- `npm run verify:runtime-behavior`
- `npm run verify:backend-storage`

## Excluded

Live report persistence, report export, raw audio, transcripts, learner
identity promotion, progression mutation, reward mutation, and provider
selection remain blocked.
