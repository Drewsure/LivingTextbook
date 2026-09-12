# ADR 0641: Canonical Game Event Sequence Guard

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

The shared playable-game route shell must validate a completed canonical game
event stream before treating the route as a contract-valid integration.

The required learning sequence is:

`game_started -> round_shown -> answer_submitted -> answer_result -> mastery_updated -> game_completed`

Audio requests and report-only events may appear between those events. They may
not change the ordering, scoring authority, or support-language boundary.

## Rationale

The DOM Memory Match and Balloon Pop slices already use shared content, audio,
scoring, and progression adapters. Recording events alone is not enough for a
future Phaser wrapper: a returned prototype could emit a plausible set of
events in the wrong order, duplicate completion, or allow support-language
signals to unlock progress. The guard makes the completion boundary explicit
and reusable across tenants and parent engines.

## Boundaries

- The route shell remains the owner of session event collection.
- The platform remains the owner of score, mastery, rewards, and persistence.
- Audio events remain non-mastery signals.
- The guard reports a contract error; it does not silently repair or reorder an
  invalid stream.
- Frozen Z.ai/Phaser source remains outside `apps/web` and is not approved by
  this guard alone.
