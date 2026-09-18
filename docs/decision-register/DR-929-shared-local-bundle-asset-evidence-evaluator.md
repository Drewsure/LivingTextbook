# DR-929: Shared Local Bundle Asset Evidence Evaluator

## Decision

Use one pure content-model evaluator for local asset evidence handoff across
browser review and future package paths.

## Included

- Per-lane evidence results.
- Overall handoff readiness and blockers.
- Complete audio and incomplete video/image runtime cases.

## Excluded

Uploads, file reads, scans, rights decisions, package writes, offline
activation, caching, and student-facing promotion.

## Verification

`node scripts/verify-local-bundle-manifest-runtime.mjs` exercises the shared
evaluator. `node scripts/verify-local-bundle-readiness.mjs` guards its public
markers, and `npm run verify:foundation` remains the full gate.
