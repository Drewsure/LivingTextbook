# ADR 0713: Canonical Replay Seed Consistency

## Status

Accepted for canonical game integration.

## Decision

The canonical game event validator must require one identical `replay-v1:`
seed across every replay-evidence event in a sequence, including
`audio_requested`. A seed that is individually well-formed but differs from
the sequence seed is rejected.

## Rationale

Deterministic layouts, timing evidence, and audio requests must describe one
replay. Mixed seeds can make a candidate appear reproducible while combining
events from different arrangements or sessions, weakening progression,
reporting, and wrapper review.

## Verification

The runtime behavior harness mutates the audio event seed and expects the
canonical validator to reject it. The canonical integration verifier checks
the shared replay-seed marker.
