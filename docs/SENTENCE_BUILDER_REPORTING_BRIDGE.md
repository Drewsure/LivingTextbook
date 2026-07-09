# Sentence Builder Reporting Bridge

## Purpose

Sentence Builder is now visible to teacher reporting as a normal student progression activity. This keeps the first text-spelling game aligned with the shared event vocabulary before deeper scoring, persistence, or analytics work begins.

## Current Implementation

- The sample teacher monitor stream includes `sentence-builder` events between Memory Match and Speak It.
- The stream records `game_started`, `answer_result`, and `mastery_updated`.
- Sentence Builder events include `parentEngine: "text-spelling"` and `scoringProfileId: "syntax-construction-v1"` metadata.
- The sample progression state includes `sentence-builder` in unlocked and completed game modes.
- The sample earned Star Dust reflects the added syntax-construction completion.

## Acceptance Standard

- Teacher session pages must load for both MiniStar and sample publisher launch codes.
- The teacher event log must be able to display Sentence Builder events without new component-specific plumbing.
- The reporting model must not imply backend persistence until the backend adapter decision is accepted.
- Support-language usage must remain assistive only; English target-language actions are the progression trigger.

## Deliberate Limits

This slice does not add durable analytics, downloadable reports, classroom comparison, or school-level rollups. It only proves that a playable text-spelling game can feed the same reporting surface as the existing pairing and speech slices.
