# ADR 0886: Phaser Source Identity Content-Model Gate

## Status

Accepted for controlled candidate review.

## Context

The candidate package verifier already required the frozen repository, tag, and
commit, but the shared TypeScript contract only required non-empty provenance
fields and a valid-looking commit hash. A future review record could therefore
pass the content-model boundary while referring to a different immutable
snapshot.

## Decision

Centralize the approved frozen Phaser source identity in the content model and
require candidate contract reviews and the Memory Match evidence handoff to
match it exactly:

- Repository: `Drewsure/ministar-lab`
- Snapshot: `frozen-2026-09-12-aaa-stable`
- Commit: `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`

The hash verifier remains the authority for file-level reproducibility. This
identity gate only rejects provenance drift; it does not import files, approve
a wrapper, replace a route, promote a package, or assign students.

## Consequences

- Web fixtures, handoffs, runtime tests, and shared contracts use one source of
  truth.
- Wrong-but-well-formed immutable snapshots fail before candidate review can
  proceed.
- The candidate remains review-only and blocked from production integration.

## Evidence

- `packages/content-model/src/phaserCandidateSourceIdentity.ts`
- `packages/content-model/src/phaserCandidateContractReview.ts`
- `apps/web/src/data/sampleMemoryMatchEvidenceHandoffPacket.ts`
- `scripts/verify-runtime-behavior.mjs`
- `scripts/verify-phaser-candidate-reviews.mjs`
