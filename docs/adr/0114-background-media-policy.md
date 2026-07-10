# ADR 0114: Background Media Policy

## Status

Accepted

## Context

The Living Textbook product must support music, chants, videos, and optional game-background media for white-label textbook companions. At the same time, every learner-facing text item needs clear audio support, especially for early learners and students who cannot yet read English fluently.

## Decision

Add a background media policy surface to `/teacher/intake`. Background media is teacher-controlled enrichment and must never replace, mask, or trigger progress instead of core English learning audio.

## Consequences

- Multimedia remains part of the core platform rather than a bolt-on.
- Teachers can use music or chants during selected games without weakening the audio-first learning rule.
- Reports can track background media engagement without treating it as mastery.

