# Progress Event Taxonomy

Document type: reporting and persistence foundation  
Status: active scaffold  
Last updated: 2026-07-10

## Purpose

The Living Textbook platform must preserve the difference between events that affect progression, events that are report-only, and events that are support-only. This distinction protects the white-label product from accidental scoring drift as new games, media, assist languages, and speech features are added.

## Event Effects

- `progress-affecting`: may unlock activities, update mastery, or award deterministic Star Dust when all gates are satisfied.
- `report-only`: visible to teachers and useful for analytics, but not enough by itself to update mastery.
- `support-only`: helps the learner, but must not unlock progress, award mastery, or replace target-language practice.

## Active Admin Surface

The current taxonomy is visible at:

- `http://127.0.0.1:3000/teacher/intake`

The source data lives in:

- `apps/web/src/data/sampleProgressEventTaxonomy.ts`

The shared validator lives in:

- `packages/content-model/src/progressEventTaxonomy.ts`

Backend planning references the same idea through:

- `event_effect`
- `taxonomy_version`
- `event_acceptance_gate_id`

Current scaffold revision:

- `taxonomy-v2026.07.foundation`

Required event fields for hosted or local storage:

- `event_id`
- `event_type`
- `event_effect`
- `taxonomy_version`
- `event_acceptance_gate_id`
- `metadata`
- `occurred_at`

## Shared Validator

`validateProgressEventTaxonomyRegistry` is the hard guard for this scaffold. It checks that the taxonomy includes the required storage fields, has a version and label, keeps every event teacher-visible and persistence-required, and preserves each event's effect boundary.

The validator protects three fixed categories:

- Support-only events must remain support-only and must explicitly block progress, mastery, Star Dust, or scoring effects.
- Report-only events must remain report-only and must not become hidden mastery evidence.
- Progress-affecting events must remain progress-affecting and must be backed by reviewed game evidence.

The teacher intake page must show `Event taxonomy guard active`, `Event taxonomy guard blocks`, and `Event taxonomy guard warnings` so reviewers can see whether the current event contract is structurally clear before new games, media, speech, AI Tutor, rewards, uploads, reports, assignments, or storage adapters are added.

## Progress Event Envelope

The taxonomy classifies events. The envelope explains how a future stored event must be wrapped before it can feed reports, mastery, Star Dust, unlocks, local bundles, or hosted storage.

The shared envelope contract is:

- `standard-progress-event-envelope-v2026.08.foundation`

Required envelope fields:

- `event_id`
- `event_type`
- `event_effect`
- `taxonomy_version`
- `event_acceptance_gate_id`
- `metadata`
- `occurred_at`
- `unit_key`
- `game_mode`

The teacher session routes now show a `Progress event envelope gate`. This gate is read-only and validates sample event streams against `createProgressEventEnvelope`, `validateProgressEventEnvelope`, and `validateProgressEventEnvelopeStream`. It proves shape and boundaries without enabling live storage.

Envelope rules:

- `event_effect` must match the active taxonomy classification.
- `taxonomy_version` must match the active taxonomy version.
- `event_acceptance_gate_id` must point back to the session's event acceptance gate.
- Support-only envelopes cannot allow progress unlocks, mastery credit, support-language unlocks, or Star Dust awards.
- Duplicate `event_id` values are blocked.
- Missing launch context, learning evidence, or support-only signals produce review warnings.

## Hard Rules

- Support-language taps are support-only.
- Tap-to-speak learning audio requests are support-only.
- Route guidance listens are support-only.
- Background media is support-only.
- Media playback is report-only unless a later reviewed game mode explicitly turns a prompt into answer evidence.
- Entry practice completion requires target-language engagement.
- Answer results and mastery updates are the main item-level evidence events.
- Random rewards must not be introduced through event taxonomy changes.
- Backend report queries must ignore `support-only` events for mastery, Star Dust, and unlock calculations.
- New game, media, route-guidance, speech, AI Tutor, or reward events must be classified in the taxonomy before pilot release.
