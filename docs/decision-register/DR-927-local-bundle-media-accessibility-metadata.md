# DR-927: Local Bundle Media Accessibility Metadata

## Decision

Represent transcript/caption and poster paths in local audio/video planning
entries and carry them through resolver rehearsal.

## Included

- Learning-audio transcript paths.
- Video caption and poster paths.
- Tenant-scoped manifest and resolver evidence.

## Excluded

File access, generation, upload, transcoding, rights approval, media caching,
offline activation, and media-only progression.

## Verification

`node scripts/verify-local-bundle-readiness.mjs` checks representative
supporting paths. `npm run verify:foundation` remains the full gate.
