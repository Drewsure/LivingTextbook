# ADR 1382: Store Canonical Game Evidence Confirmation in Package Review

## Status

Accepted for the review-only pilot foundation.

## Decision

The immutable package-evidence review record stores the exact canonical
platform-derived game evidence IDs confirmed by the reviewer. The required set
is:

- `curated_activity_pathway_packet`
- `canonical_game_integration_packet`
- `package_game_audio_coverage`

The live source and package-readiness bridges derive game completeness from
that stored field, not from the presence of a generic `game` lane checkbox.

## Why

The package review is the first durable tenant/quarantine-bound evidence record
available to the live routes. Storing the exact set makes the game readiness
signal auditable and prevents a lane-only review from appearing canonical.

## Boundary

This is reviewer evidence, not a release approval. Package assembly, promotion,
QR printing, persistence activation, and student-facing use remain disabled.

## Verification

The package evidence behavior verifier covers a complete set and a missing
canonical record. The source-package and package-readiness bridges consume the
stored completeness signal.
