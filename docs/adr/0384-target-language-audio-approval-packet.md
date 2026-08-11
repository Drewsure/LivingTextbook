# 0384. Target-language audio approval packet

Date: 2026-08-11

## Status

Accepted

## Context

Generated packages already have audio coverage planning, but teachers need a separate review surface for the exact learner-facing audio cues that must be accepted before package teacher review, package assembly, playlists, routes, or assignments can be considered.

## Decision

Add a review-only target-language audio approval packet to the AI generator route for each tenant. The packet lists term, sentence, instruction, feedback, control, support-language, and background-media policy cues with review questions, source records, and progress boundaries.

The packet cannot capture audio approval, generate voice, bill a speech or voice API, mark package audio complete, create routes, create playlists, assign students, or count media-only listening as progress.

MiniStar packets preserve English as the target-language trigger. Foundation/Bronze/Plus Japanese support remains hiragana-only and support-only.

## Consequences

- Audio review becomes a first-class package gate instead of a vague checklist item.
- Future hosted, local, or hybrid storage can target a precise `target_language_audio_approval` record.
- Voice generation and speech API cost remain blocked until tenant approval and storage controls exist.
- Support-language audio cannot become a progress, mastery, Star Dust, approval, or student-ready shortcut.
