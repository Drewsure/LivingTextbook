# ADR 0323: AI Prototype Event Replay Report

## Status

Accepted

## Context

Returned game prototypes can appear playable while emitting incomplete, reordered, or hidden progress events. That would undermine teacher reports, mastery, earned collection, assignment state, and future backend storage.

After fixture replay proves the prototype can load reviewed JSON, the next gate must prove the prototype emits the LivingTextbook event contract without owning progress, score, reward, route, report, playlist, local bundle, or assignment state.

## Decision

Add review-only AI prototype event replay reports to `/teacher/generator/sample-publisher` and `/teacher/generator/ministar`.

The report must show source records, replay purpose, standard event coverage, required event order, allowed payload fields, accepted progress effects, failure triggers, and blocked actions.

## Consequences

- Returned prototypes must prove `game_started`, `round_shown`, `audio_requested`, `answer_submitted`, `answer_result`, `mastery_updated`, and `game_completed` behavior before integration review continues.
- Target-language events remain the only learning progress candidates.
- Support-language, media-only, and background-audio events remain support-only.
- Event replay reports remain review-only and cannot write progress, score, rewards, routes, reports, playlists, local bundles, or assignments.
