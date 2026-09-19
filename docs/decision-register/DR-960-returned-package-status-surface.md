# DR-960: Returned Package Status Surface

## Decision

Teacher review panels must render returned-package status from the manifest,
not from a hard-coded preview label, and must show the exact source commit when
one is supplied.

## Required Invariants

- `not-returned`, `review-only`, and `blocked` remain visibly distinct.
- A status label never implies wrapper approval, promotion, launch, or
  assignment.
- Phaser/hybrid source commit evidence remains visible when present.
- The existing no-import and review-only boundaries remain unchanged.

## Evidence

- `apps/web/src/features/content-intake/AiPrototypeReturnedPackageManifestPanel.tsx`
- `scripts/verify-prototype-review-readiness.mjs`
