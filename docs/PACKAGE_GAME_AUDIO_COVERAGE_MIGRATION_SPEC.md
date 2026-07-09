# Package Game/Audio Coverage Migration Spec

## Purpose

The backend migration plan now includes a vendor-neutral package game/audio coverage snapshot. This carries the reviewed package game path and audio coverage into future hosted or local storage.

## Current Spec

`spec-package-game-audio-coverage` records:

- `coverage_snapshot_id`
- `package_release_id`
- `assigned_game_modes`
- `audio_covered_game_modes`
- `cue_source_summary`

## Why It Exists

The platform now treats assigned game paths and audio-covered modes as package-readiness requirements. Those fields need durable release metadata before any real pilot so approved content cannot drift silently.

## Boundary

This is not a real migration yet and does not choose Supabase, Firebase, SQLite, Postgres, or any other backend. It is a product contract that future migrations must preserve.
