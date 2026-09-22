# Source Draft Import Checks

This check covers the review-only bridge between an extraction preview, a source package assembly packet, and a teacher draft preview.

## Required guarantees

- Tenant, source, target package, assembly, extraction, draft, unit, and checksum identities reconcile exactly.
- The bridge stays `review-only` and does not create a durable draft.
- Storage writes, student-facing payloads, assignment, and package promotion remain blocked.
- The bridge requires source assembly, extraction review, teacher draft, and review handoff records.
- A teacher draft preview cannot silently become a live package or route.

## Verification

Run `npm run verify:source-draft-import` for the static contract check and `npm run verify:runtime-behavior` for runtime binding and flag tests.
