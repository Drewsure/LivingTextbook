# Build Session 0776: Curated Unit Pathway Resolution

## Completed

- Resolved Game Sequence entries from tenant-scoped curated offer maps.
- Kept sample offer-map lookup at the page boundary rather than inside the
  reusable Game Sequence feature.
- Moved offer-map types and validation out of sample data so reusable features
  can accept hosted, local, or partner tenant records later.
- Preserved the shared catalog as a complete fallback for unpublished units.
- Kept Training Academy explicit and separate from game modes.
- Preserved parent-engine and audio contracts through catalog metadata.
- Injected the resolved offer map through launch, front-door, flashcard, and
  canonical game route boundaries so reusable route components no longer know
  how sample packages are stored.
- Added a regression verifier that guards the provider boundary against
  reusable-feature imports of sample offer-map fixtures.

## Verification

- Web typecheck passed.
- Production Webpack build passed.
- Foundation composition checks passed, including all four parent-engine
  runtime contracts.
- All 88 active route checks passed.
- Curated pathway provider-boundary verifier passed.
- Full foundation verification remains the release gate for this slice.

## Boundary

This is a pathway-resolution change only. It does not publish content, assign
learners, write live storage, or import frozen Z.ai/Phaser source.
