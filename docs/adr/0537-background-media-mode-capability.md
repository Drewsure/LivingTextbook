# ADR-0537: Background Media Mode Capability

Status: Accepted

## Decision

Make background-media capability part of the shared curated game-mode contract and reject multimedia plans that name a mode without that capability.

## Context

Background music or chant can enrich recall and light arcade practice, but it can interfere with precision listening, speaking, spelling, or syntax. A supported game mode ID does not by itself establish that ambient media is appropriate.

## Guardrails

- Each curated mode explicitly declares whether background media is allowed.
- The web catalog and content model capability flags must match.
- Multimedia plans naming a disallowed mode are blocked before release review.
- Learning audio, instructions, feedback, scoring, and progression remain higher priority.
- This slice does not enable playback, autoplay, persistence, or student-state changes.

## Consequence

Tenant packages receive deterministic feedback when background media is attached to an unsuitable mode, while suitable modes retain an explicit path for teacher-controlled optional media.
