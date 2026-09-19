# ADR 0885: Phaser Snapshot Identity Normalization

## Status

Accepted for controlled candidate review.

## Context

The frozen Z.ai snapshot has both a public immutable tag and a commit SHA.
The review packet used a hash-derived label while the freeze record,
candidate-package gate, and agent briefs used the tag. Multiple labels for one
source can make provenance appear inconsistent during a white-label review.

## Decision

Use `frozen-2026-09-12-aaa-stable` as the canonical `sourceSnapshotId` across
candidate contract reviews, integration gates, runtime fixtures, agent briefs,
and returned packages. Preserve
`eb79ddf5940ab47cc3c45c119c67ee1b6b958e55` separately as the immutable source
commit SHA. The local source-hash verifier continues to prove the recorded
files against that snapshot and commit.

## Consequences

- Candidate review, package return, and freeze documentation share one
  unambiguous source identity.
- The commit SHA remains the stronger content identity and is never replaced
  by a mutable branch or deployment label.
- Existing candidate status remains blocked or review-only; normalization does
  not approve a wrapper or import source files.

## Evidence

- `apps/web/src/data/samplePhaserCandidateContractReview.ts`
- `scripts/verify-phaser-source-evidence.mjs`
- `scripts/verify-phaser-candidate-reviews.mjs`
- `scripts/verify-phaser-candidate-package.mjs`
- `docs/FOUNDATION_TO_ZAI_INTAKE_GATE.md`

