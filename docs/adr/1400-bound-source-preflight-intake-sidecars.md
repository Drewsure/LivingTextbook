# ADR 1400: Bound Source Preflight Intake Sidecars

## Status

Accepted for the publisher pilot source handoff.

## Context

The pilot intake kit contains an intake brief, README, and evidence records in
addition to the publisher source and media files. The canonical source
preflight must scan the same folder without misclassifying those operator
records as source assets, while retaining its protection against undeclared
content.

## Decision

Ignore exactly `publisher-pilot-intake.json`, the kit `README.md`, and the
`evidence/` subtree during source inventory. Continue to report every other
unlisted file as a blocker. Intake and evidence preflights remain responsible
for validating the ignored records.

## Consequences

- A completed pilot kit can pass the canonical source inventory after the
  intake-to-manifest bridge runs.
- Unknown files cannot be smuggled into the source folder through the sidecar
  exception.
- Sidecar recognition is inventory behavior only; it does not approve rights,
  accessibility, package release, QR printing, persistence, or student use.

## Verification

- `node scripts/verify-publisher-source-preflight.mjs`
- `node scripts/create-publisher-source-manifest-from-pilot-kit.mjs --self-test`
- `npm run verify:foundation-composition`
