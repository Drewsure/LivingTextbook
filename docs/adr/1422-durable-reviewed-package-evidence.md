# ADR 1422: Durable Reviewed Package Evidence

## Decision

The first saleable-pilot human evidence packet must include a create-once
`package-review-evidence.json` record. It is the durable review boundary for
the publisher's content, curated games, audio, video, images, fonts,
accessibility, and rights lanes.

## Rationale

Release policy and release authorization alone do not prove that the actual
multimedia/game package was reviewed. Requiring this record keeps technical
platform proof, package review, and final release approval distinct while
binding them to the same source and package checksums.

## Safety boundary

The record is metadata-only. It never uploads, assembles, prints QR codes,
activates persistence, or enables students. Every lane requires an explicit
evidence reference; `not-applicable` is allowed only with an explanation.

## Verification

`node scripts/verify-pilot-package-review-evidence.mjs --self-test`

`node scripts/verify-pilot-human-evidence.mjs --self-test`
