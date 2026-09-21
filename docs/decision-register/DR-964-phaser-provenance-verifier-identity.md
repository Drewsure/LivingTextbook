# DR-964: Phaser Provenance Verifier Identity

## Decision

The frozen Phaser source evidence verifier must read the immutable snapshot
tag and commit from `packages/content-model/src/phaserCandidateSourceIdentity.ts`.
It must not parse those values from a duplicated sample review fixture.

## Required Invariants

- The verifier remains read-only and hashes only declared repository-relative
  files inside the isolated review root.
- Shared identity is the single source of truth for snapshot and commit
  validation.
- A successful hash check remains evidence only; it does not authorize source
  import, wrapper approval, promotion, route replacement, or assignment.

## Evidence

- `scripts/verify-phaser-source-evidence.mjs`
- `scripts/verify-phaser-source-evidence-contract.mjs`
- `packages/content-model/src/phaserCandidateSourceIdentity.ts`
