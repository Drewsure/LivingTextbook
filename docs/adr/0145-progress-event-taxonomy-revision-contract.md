# ADR 0145: Progress Event Taxonomy Revision Contract

## Status

Accepted

## Context

Progress-event storage now requires `taxonomy_version`, `event_effect`, and `event_acceptance_gate_id`. The active taxonomy data previously listed event classifications, but it did not expose a named revision contract on the teacher/admin intake surface.

## Decision

Wrap the sample progress event taxonomy in a visible revision contract.

## Consequences

- `/teacher/intake` shows `taxonomy-v2026.07.foundation`.
- The taxonomy panel shows required event fields for hosted or local storage.
- Future game, media, route-guidance, speech, AI Tutor, or reward events must be classified before pilot release.
- Backend schema and migration work can reference an explicit taxonomy revision rather than an implied label.
