# ADR 0454: Teacher Audio Request Evidence Lane

Status: Accepted

Date: 2026-08-29

## Context

The shared student game audio contract emits `audio_requested` as support-only evidence. Teacher session monitors and report package previews must show this event clearly so schools can see whether audio support is being used, while still blocking audio taps from becoming score or mastery shortcuts.

## Decision

Show `audio_requested` events in teacher session monitor and report package previews as a dedicated support-only learning-audio evidence lane.

## Consequences

- Teacher reports can explain target-language audio engagement without treating it as answer evidence.
- `audio_requested` rows carry zero score value and cannot unlock games, award mastery, or change Star Dust.
- Core report export remains blocked until policy, persistence, access-control, retention, and event-storage gates close.
