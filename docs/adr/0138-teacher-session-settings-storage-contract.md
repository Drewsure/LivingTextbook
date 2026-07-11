# ADR 0138: Teacher Session Settings Storage Contract

## Status

Accepted

## Context

Teacher session monitor routes now show a machine-readable settings snapshot. Before implementing backend or local persistence, launch-session storage must preserve the same settings shape and validation state.

## Decision

Add a teacher session settings storage contract across adapter write intents, backend schema draft, migration candidates, and migration specs.

## Consequences

- Launch-session writes must preserve teacher settings snapshots.
- Hosted and local deployments share one settings vocabulary.
- Student events should not be accepted for live classroom use until session settings, policy, and report boundaries can be persisted.
- Raw microphone audio, transcripts, ungated AI Tutor state, support-language mastery credit, and background-media unlock credit remain blocked.
