# DR-547: PWA And Offline Readiness Gate

Status: Accepted

Date: 2026-09-03

## Decision

Add a review-only PWA and offline readiness gate to `/teacher/intake`.

## Rationale

The white-label product should be able to sell hosted PWA and future closed local textbook companion options clearly. The installable app manifest is helpful, but it must not be confused with offline lesson, media, QR, report, or learner-data readiness.

## Guardrails

- No offline-ready claim, service worker registration, cache mutation, media precache, background sync, local installer export, student data offline storage, production QR mutation, or local package activation.
- Offline media requires rights proof, checksums, versioned manifests, tenant approval, and learning-audio priority preservation.
- QR fallback must use stable aliases and edition compatibility, not direct local file paths or raw localhost targets.
- Closed local companion remains blocked until storage, reporting, rollback, evidence, and school policy gates are complete.

## Verification

- `npm.cmd run verify:local-bundle`
- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
