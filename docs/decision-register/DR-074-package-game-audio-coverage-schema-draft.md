# DR-074: Package Game/Audio Coverage Schema Draft

## Decision

Add package game/audio coverage as a vendor-neutral backend schema entity.

## Rationale

The platform already tracks assigned game modes, audio-covered modes, write intents, and migration specs. The backend schema draft also needs this entity so future backend selection and implementation preserve audio-first game readiness for hosted and local deployments.

## Consequences

- Backend candidates must support package game/audio coverage metadata.
- Pilot publish checks can block releases when required game audio coverage is incomplete.
- Audio files remain in media manifests, object storage, or local bundles rather than this entity.

## Non-Goals

- Backend vendor selection.
- Raw audio storage.
- Learner recording or transcript storage.
- Premium visual polish.
