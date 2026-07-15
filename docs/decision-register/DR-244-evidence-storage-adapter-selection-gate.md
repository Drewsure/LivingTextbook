# DR-244 Evidence Storage Adapter Selection Gate

Date: 2026-07-15

## Decision

The first pilot should prefer a hosted managed evidence storage candidate while keeping closed local evidence storage and hybrid archive movement visible as policy-gated alternatives.

## Rationale

Hosted managed storage is more cost-efficient for the first controlled pilot because it tests review flow, access control, audit, export, and delete policy without building installer, backup, restore, and offline update machinery. Local storage remains important for white-label publisher and school deployments, but it should not drive the first pilot unless the partner specifically requires closed local operation.

## Guardrails

- No backend vendor selected.
- No object bucket creation.
- No local evidence folder activation.
- No signed URL generation.
- No direct file upload.
- No attachment migration.
- No production retention clock.
- No release-state mutation.

## Verification

- `npm run verify:upload-channels`
- `npm run verify:foundation`
