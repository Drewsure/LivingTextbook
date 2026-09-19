# DR-957: Phaser Snapshot Identity Normalization

## Decision

All frozen Z.ai/Phaser candidate evidence must use the immutable tag
`frozen-2026-09-12-aaa-stable` as `sourceSnapshotId` and preserve the exact
freeze commit SHA separately.

## Required Invariants

- Candidate review packets, integration gates, agent briefs, and returned
  package checks use the same immutable snapshot tag.
- The freeze commit remains
  `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`.
- A snapshot identity change does not authorize source copying, route
  replacement, wrapper approval, package promotion, or assignment.
- Hash verification remains read-only and path-contained.

## Evidence

- `apps/web/src/data/samplePhaserCandidateContractReview.ts`
- `scripts/verify-phaser-candidate-reviews.mjs`
- `scripts/verify-memory-match-integration-gate.mjs`
- `scripts/verify-runtime-behavior.mjs`

