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

## Hard Rules

- Support-language taps are support-only.
- Route guidance listens are support-only.
- Background media is support-only.
- Media playback is report-only unless a later reviewed game mode explicitly turns a prompt into answer evidence.
- Entry practice completion requires target-language engagement.
- Answer results and mastery updates are the main item-level evidence events.
- Random rewards must not be introduced through event taxonomy changes.

