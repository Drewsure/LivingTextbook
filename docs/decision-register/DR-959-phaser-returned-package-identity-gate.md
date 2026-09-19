# DR-959: Phaser Returned-Package Identity Gate

## Decision

The shared returned-package manifest validator must enforce the canonical
frozen Phaser identity for every returned `phaser` or `hybrid` package.

## Required Invariants

- The repository is `Drewsure/ministar-lab`.
- The snapshot is `frozen-2026-09-12-aaa-stable`.
- The exact commit is
  `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`.
- The commit is recorded separately from the snapshot tag.
- Identity failure blocks wrapper review, source import, route replacement,
  promotion, and assignment.
- DOM-reference not-returned previews do not receive Phaser-only requirements.

## Evidence

- `packages/content-model/src/aiPrototypeReturnedPackageManifest.ts`
- `scripts/verify-runtime-behavior.mjs`
- `docs/verification/PHASER_CANDIDATE_PACKAGE_CHECKS.md`
