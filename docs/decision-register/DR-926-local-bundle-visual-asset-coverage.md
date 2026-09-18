# DR-926: Local Bundle Visual Asset Coverage

## Decision

Carry reviewed image entries in the tenant local bundle planning manifests
alongside audio and video, without activating image upload or gameplay.

## Included

- MiniStar and sample-publisher image planning entries.
- Resolver visibility and checksum/rights-pending evidence.
- Labelled Diagram compatibility at the package-shape level.

## Excluded

File reads, uploads, image editing, label anchors, alt-text approval,
student-facing image gameplay, caching, offline activation, and release.

## Verification

`node scripts/verify-local-bundle-readiness.mjs` requires audio, video, and
image planning kinds. `npm run verify:foundation` remains the full gate.
