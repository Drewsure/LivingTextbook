# Build Session: Phaser Provenance Verifier Identity

## Goal

Keep frozen Z.ai/Phaser source reviewable without allowing provenance drift or
source promotion.

## Change

The read-only frozen-source hash verifier now reads the snapshot tag and exact
commit from the shared content-model identity module. The contract verifier
guards that dependency. The isolated snapshot remains outside the repository.

## Verification

- `npm run verify:phaser-source-evidence`
- `npm run verify:phaser-source-evidence-contract`
- `npm run verify:phaser-scene-inventory`

The frozen snapshot matched all five declared source hashes and the 32-scene
inventory remained valid. This is provenance evidence, not integration approval.
