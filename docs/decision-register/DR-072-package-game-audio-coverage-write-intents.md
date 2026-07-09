# DR-072: Package Game/Audio Coverage Write Intents

## Decision

Add package game/audio coverage snapshot write intents to hosted and local persistence adapter plans.

## Rationale

Assigned game paths and audio-covered modes are now part of package readiness. If they are not persisted with release metadata, a pilot package could drift after approval and lose audio-first guarantees.

## Consequences

- Hosted and local adapter plans must preserve game/audio coverage snapshots.
- Release-control work remains backend-neutral.
- Future migrations must account for reviewed game/audio coverage metadata.

## Non-Goals

- Selecting a database.
- Writing real package release records.
- Storing raw learner audio.
