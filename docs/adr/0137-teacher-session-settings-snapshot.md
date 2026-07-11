# ADR 0137: Teacher Session Settings Snapshot

## Status

Accepted

## Context

Teacher session monitor routes already show settings, controls, warnings, report boundaries, and pilot readiness. Before persisting launch-session settings, the platform needs a machine-readable preview of the exact settings payload that should travel across student devices.

## Decision

Render a settings snapshot on teacher session monitor routes.

## Consequences

- Teacher-controlled audio, assist language, microphone, background media, Training Academy, AI Tutor, and reporting settings now have a visible persistence shape.
- Support-language, media, and microphone rules remain separate from progress scoring.
- Future launch-session storage work can implement the snapshot contract instead of inventing a new payload later.
