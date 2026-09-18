# DR-930: Local Bundle Accessibility Readiness Parity

## Decision

Keep the same per-kind accessibility requirements in offline-ready manifest
validation, shared asset evaluation, and browser evidence review.

## Included

- Audio transcript evidence.
- Video poster and transcript/caption evidence.
- Image alt-text evidence.
- Explicit package-level blocker aggregation.

## Excluded

Media reads, generation, uploads, package writes, caching, offline activation,
and student-facing promotion.

## Verification

`node scripts/verify-local-bundle-manifest-runtime.mjs` rejects incomplete
offline-ready audio and video evidence. `node
scripts/verify-local-bundle-readiness.mjs` guards the shared evaluator, and
`npm run verify:foundation` remains the full gate.

See ADR 0858 and
`docs/adr/0858-local-bundle-accessibility-readiness-parity.md`.
