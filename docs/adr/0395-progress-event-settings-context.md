# ADR 0395: Progress Event Settings Context

## Context

The platform now has reviewed game mode settings profiles and teacher session settings snapshots. Teacher reports need a stable way to show which settings were active for a session without allowing settings to change scoring authority.

## Decision

The shared progress event envelope now includes `settings_context`.

The context includes:

- `game_mode_settings_profile_id`
- `teacher_game_mode_settings_snapshot_id`
- `settings_contract_id`
- `progress_trigger_policy`
- support-language, media-only, and scoring override blocks

## Consequences

Every future stored event must preserve the reviewed settings context alongside taxonomy version, event effect, event acceptance gate, unit, mode, timestamp, and safe metadata.

The context is intentionally non-authoritative for scoring. Parent engines and the target-language event taxonomy continue to decide progress, mastery, and Star Dust.

## Verification

`verify:taxonomy` checks the shared contract, `verify:backend-storage` checks schema/migration/persistence preservation, and active route verification checks that teacher session monitor routes expose the settings context preview.
