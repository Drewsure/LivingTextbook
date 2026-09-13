# ADR 0728: Phaser Evidence Artifact-Path Uniqueness

## Status

Accepted

## Context

The Phaser candidate return package requires separate evidence artifacts for
source identity, fixture, README, event replay, audio coverage, scoring replay,
mobile evidence, and wrapper notes. The verifier already checked artifact kind,
identifier, review status, checksum, and safe path, but did not prevent two
artifact records from referencing the same file.

## Decision

Reject a candidate package when any two artifact records share a
`relativePath`. Each evidence obligation must point to its own reviewed file.
The verifier continues to require unique kinds and identifiers and to hash the
file at the safe candidate-relative path.

## Consequences

Evidence packets cannot satisfy multiple obligations by duplicating one file
under different metadata. The package remains portable, hash-verified, and
review-only. The synthetic package behavior test must retain both the passing
profiles and the deliberate duplicate-path rejection case.

## Verification

Run `npm run verify:phaser-candidate-package-contract` and
`npm run verify:phaser-candidate-package-behavior`.
