# Package Game/Audio Coverage Schema Draft

Document type: backend foundation contract  
Status: active scaffold  
Last updated: 2026-07-10

## Purpose

Package game/audio coverage is now a first-class backend schema entity because each white-label package must preserve which game modes are assigned, which modes have reviewed audio support, and which audio gaps block pilot publishing.

This remains vendor-neutral. It does not choose Supabase, Firebase, SQLite, Postgres, or a custom local store.

## Entity

`package_game_audio_coverage`

Required responsibilities:

- store the package release's assigned game modes,
- store the audio-covered game modes,
- store the reviewed cue source summary,
- store unresolved audio gap count,
- feed package publish gates,
- feed hosted and local package manifests.

## Non-Negotiables

- Do not store raw audio blobs in this entity.
- Do not store learner recordings.
- Do not store learner transcripts.
- Do not treat generated cue output as reviewed coverage.
- Do not allow pilot-publishable status when required game audio coverage is missing.

## Current UI Surface

Review through:

- `http://127.0.0.1:3000/teacher/intake`

## Related Files

- `apps/web/src/data/sampleBackendSchemaDraft.ts`
- `docs/BACKEND_SCHEMA_DRAFT.md`
- `docs/verification/BACKEND_SCHEMA_DRAFT_CHECKS.md`
- `docs/PACKAGE_GAME_AUDIO_COVERAGE_MIGRATION_SPEC.md`
- `docs/PACKAGE_GAME_AUDIO_COVERAGE_WRITE_INTENTS.md`
