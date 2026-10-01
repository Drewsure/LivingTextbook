# ADR 1380: Bind the Canonical Game Evidence Set at Reconciliation

## Status

Accepted for the review-only pilot foundation.

## Decision

Publisher submission package reconciliation will require these three derived
game evidence records on the game lane:

- `curated_activity_pathway_packet`
- `canonical_game_integration_packet`
- `package_game_audio_coverage`

The game lane cannot claim publisher source assets, and non-game lanes cannot
claim platform-derived evidence records.

## Why

The platform's first pilot promise is curated, reviewed game pathways with
shared audio and scoring contracts. The reconciliation layer must therefore
bind the complete canonical game evidence set instead of accepting a partial
or ambiguously sourced game lane.

## Boundary

This is package-review evidence only. It does not authorize assembly,
promotion, QR printing, persistence activation, or student-facing use.

## Verification

The publisher submission package evidence reconciliation verifier covers the
complete set, game source-asset rejection, non-game derived-record rejection,
and incomplete canonical-set rejection.
