# ADR 1374: Publisher Media Format Contract

## Status

Accepted for the first publisher intake workflow.

## Context

The platform upload policy already advertised formats beyond the first source
manifest starter, including M4A/OGG audio, MOV video, SVG images, and
Markdown/CSV source files. Leaving those formats out of the source preflight
would make the publisher-facing contract internally contradictory.

## Decision

Align the starter declaration and source preflight detector with the existing
v1 upload policy. Use MIME types for every accepted declaration and cover the
expanded formats in the real temporary-folder self-test.

## Consequences

- Publisher media that the platform advertises can pass the inventory stage
  without a format vocabulary mismatch.
- Each future format change must update the visible policy, declaration,
  detector, documentation, and fixtures together.
- Rights, accessibility, review, promotion, package, release, QR, persistence,
  and student-use gates remain independent and blocked.

## Verification

- `node scripts/create-publisher-source-manifest.mjs --self-test`
- `node --experimental-strip-types scripts/publisher-source-preflight.mjs --self-test`
- `npm run verify:publisher-source-preflight`
