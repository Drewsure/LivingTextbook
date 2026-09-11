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
- `occurred_at` must be a parseable ISO/RFC3339 timestamp with an explicit timezone.
- `game_mode` must be one of the curated shared `GameModeId` values.
- `unit_key` must use the canonical tenant, curriculum, level, and unit format.
- The envelope's mode must be offered at the level encoded in its canonical `unit_key`.
- `event_type` must belong to one of the shared support-only, report-only, or progress-affecting event categories.
- A stored or reported event stream must not mix unit, launch, or student-session identities.
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
- Teacher reports may show `audio_requested` as learning-audio support evidence, but score values must remain zero.
- New game, media, route-guidance, speech, AI Tutor, or reward events must be classified in the taxonomy before pilot release.

## 86. Progress Event Mode Identity Standard

Progress evidence must identify a real curated game mode. A non-empty mode label is not enough because an unknown value could bypass catalog, engine, scoring, audio, or reporting assumptions.

Required standing rules:

- Every progress-event envelope must use a `game_mode` accepted by the shared content-model catalog.
- Mode identity validation must reuse the shared catalog helper rather than maintaining a second telemetry-only allowlist.
- Unknown or retired mode IDs are review blockers until the catalog and its contracts are updated together.
- Mode identity validation remains verification-only; it does not enable gameplay, scoring, persistence, or provider writes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-616 and `docs/adr/0544-progress-event-mode-identity.md`.

## 87. Progress Event Unit Identity Standard

Progress evidence must remain traceable to one canonical white-label content unit. A generic or locally invented unit label is not sufficient for teacher reports, replay, migration, or hosted/local reconciliation.

Required standing rules:

- Every progress-event envelope must use `tenantId:curriculumId:L[level]:U[unit]` through the shared canonical unit-key contract.
- Level values must remain within the platform's supported levels 1 through 8, and unit values must be positive integers.
- Tenant and curriculum key segments must be non-empty and must not contain the structural separator or whitespace.
- Canonical unit-key validation remains verification-only; it does not enable gameplay, scoring, persistence, or provider writes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-617 and `docs/adr/0545-progress-event-unit-identity.md`.

## 88. Progress Event Mode-Level Compatibility Standard

Event identity is not complete if the named mode is impossible for the unit level. The envelope must agree with the same curated mode contract that validates unit payloads and activity pathways.

Required standing rules:

- The level is read from the canonical unit key and compared with the shared mode contract.
- A supported mode at another level remains a review blocker for that event envelope.
- Mode-level validation must reuse the shared content-model catalog rather than a telemetry-specific matrix.
- Compatibility validation remains verification-only; it does not enable gameplay, scoring, persistence, or provider writes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-618 and `docs/adr/0546-progress-event-mode-level-compatibility.md`.

## 89. Progress Event Type Identity Standard

Runtime JSON must not be able to invent a new evidence event by supplying an arbitrary `event_type`. Every event must belong to the established taxonomy categories before it can be reviewed or enveloped.

Required standing rules:

- Support-only, report-only, and progress-affecting event sets remain the runtime event identity source.
- Unknown event types are review blockers even when a registry entry supplies an effect label.
- Adding an event requires the shared event type, taxonomy classification, teacher visibility, persistence rule, and runtime verification to move together.
- Event-type validation remains verification-only; it does not enable gameplay, scoring, persistence, or provider writes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-619 and `docs/adr/0547-progress-event-type-identity.md`.

## 90. Progress Event Stream Context Standard

Individual event validity does not guarantee stream validity. A report or persistence batch must remain within one content unit and one classroom session context, while still allowing multiple curated game modes inside that unit.

Required standing rules:

- A stream may contain multiple modes for one unit, but must not mix `unit_key` values.
- When `launch_code` values are present, a stream must not mix launch sessions.
- When `student_session_id` values are present, a stream must not mix student sessions.
- Stream-context validation remains verification-only; it does not enable gameplay, scoring, persistence, or provider writes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-620 and `docs/adr/0548-progress-event-stream-context.md`.
