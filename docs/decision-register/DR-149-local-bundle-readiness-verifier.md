# DR-149: Local Bundle Readiness Verifier

## Decision

Treat local companion bundle readiness as a foundation verification gate.

## Rationale

Closed local companion packages are part of the white-label product promise, especially for textbook partners. They cannot be handled as a late add-on because QR fallback, media bundles, game route coverage, reporting/export, and yearly update expectations affect the package design from the start.

## Accepted Direction

- Add `npm run verify:local-bundle`.
- Include local bundle verification in `npm run verify:foundation`.
- Keep local bundles preview-only until rights, checksums, installer/update, reporting/export, backup/restore, and school access policy gates are closed.
- Keep AI Tutor off by default in local bundles unless an explicit premium entitlement and deployment policy are accepted.

## Follow-Up

When a real export process exists, move this verifier from planning source files to generated manifest artifacts and signed release-gate records.
