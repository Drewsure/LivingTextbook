# ADR 1381: Use Canonical Game Completeness for Readiness Signals

## Status

Accepted for the review-only pilot foundation.

## Decision

The source-to-package evidence bridge must use an explicit
`canonicalGameEvidenceComplete` signal. A reviewed `game` lane by itself is
not proof that the canonical game evidence set is complete.

The live quarantine and package-readiness routes currently pass `false` because
their stored review record cannot prove all three required platform-derived
records:

- `curated_activity_pathway_packet`
- `canonical_game_integration_packet`
- `package_game_audio_coverage`

## Why

Without this distinction, one lane-level review flag could make a package look
game-verified in one workspace while reconciliation correctly says it is
incomplete in another. The bridge must fail closed until a trusted
reconciliation record is bound.

## Boundary

This signal controls review metadata only. It does not authorize assembly,
promotion, QR printing, persistence activation, or student-facing use.

## Verification

The bridge verifier covers both the explicit complete signal and the partial
game-review failure path. The live-route marker verifier confirms that the
routes use `canonicalGameEvidenceComplete` rather than lane presence.
