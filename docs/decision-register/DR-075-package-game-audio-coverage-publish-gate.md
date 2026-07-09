# DR-075: Package Game/Audio Coverage Publish Gate

## Decision

Add game audio coverage as a release-blocking package publish gate item.

## Rationale

The package now tracks assigned game modes, audio-covered modes, write intents, migration specs, and schema draft records. The publish gate must also block release when an assigned game mode lacks reviewed audio support, because young learners and English learners cannot rely on text-only game instructions.

## Consequences

- A game can be demo-visible while audio coverage is under review.
- A package cannot be marked pilot-publishable while assigned game modes have unresolved audio gaps.
- Raw audio files remain outside this gate and belong in media manifests, hosted storage, or local bundles.

## Non-Goals

- New game implementation.
- Backend vendor selection.
- Raw audio storage.
- Premium polish.
