# DR-928: Local Bundle Asset Evidence Handoff

## Decision

Track rights, checksum, scan, target mapping, and accessibility evidence per
asset before local package handoff.

## Included

- Review-only asset handoff status.
- Offline-ready validation for scan and mapping.
- Offline image alt-text requirement.

## Excluded

Uploads, file reads, scanning, rights approval, mapping writes, alt-text
editing, package writes, caching, activation, and student-facing promotion.

## Verification

`node scripts/verify-local-bundle-manifest-runtime.mjs` rejects incomplete
offline image evidence. `node scripts/verify-local-bundle-readiness.mjs` and
`npm run verify:foundation` cover the UI and full application gate.
