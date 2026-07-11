# ADR 0142: Progress Event Acceptance Gate Write Intents

## Status

Accepted

## Context

Launch sessions now preserve event acceptance gates, and report previews surface those gates. Progress-event write intents also need an explicit requirement that live student events may only be stored after the related launch-session gate passes.

## Decision

Add event acceptance gate requirements to progress-event write intents, the persistence adapter validator, the admin adapter map, and the backend-neutral schema/migration drafts.

## Consequences

- Progress-event write intents that contain student data must require a passed event acceptance gate.
- The persistence adapter UI shows `Event acceptance` for progress-event streams.
- Backend-neutral progress event records include `event_acceptance_gate_id`.
- Hosted and local event stores cannot treat event taxonomy alone as enough for live event storage.
