# DR-958: Phaser Source Identity Content-Model Gate

## Decision

Candidate reviews and the Memory Match evidence handoff must validate the
canonical frozen Phaser repository, snapshot tag, and exact commit through one
shared content-model identity contract.

## Required Invariants

- `Drewsure/ministar-lab` is the only source repository for this frozen
  candidate evidence.
- `frozen-2026-09-12-aaa-stable` is the only accepted snapshot identifier.
- `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55` is the separately preserved
  source commit identity.
- Provenance mismatch fails closed before wrapper review, source import, route
  replacement, package promotion, or student assignment.
- File-level SHA-256 verification remains read-only and path-contained.

## Evidence

- `packages/content-model/src/phaserCandidateSourceIdentity.ts`
- `packages/content-model/src/phaserCandidateContractReview.ts`
- `apps/web/src/data/sampleMemoryMatchEvidenceHandoffPacket.ts`
- `scripts/verify-runtime-behavior.mjs`
