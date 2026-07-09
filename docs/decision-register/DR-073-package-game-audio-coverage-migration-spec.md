# DR-073: Package Game/Audio Coverage Migration Spec

## Decision

Add a vendor-neutral backend migration spec for package game/audio coverage snapshots.

## Rationale

Persistence write intents now require game/audio coverage snapshots. The migration spec layer also needs a matching store shape so future backend work can preserve assigned game modes and audio-covered modes consistently.

## Consequences

- Package release migration planning now includes game/audio coverage metadata.
- Local classroom bundles and hosted pilots share the same vocabulary.
- Future backend implementations can map the snapshot without changing product meaning.

## Non-Goals

- Backend vendor selection.
- Production migration files.
- Raw audio storage.
