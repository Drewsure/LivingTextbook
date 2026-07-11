# DR-142: Progress Event Acceptance Gate Write Intents

## Decision

Require progress-event write intents to depend on a passed teacher session event acceptance gate.

## Reason

Event taxonomy prevents support-only activity from becoming mastery evidence, but it does not by itself answer whether the session is allowed to store live student events. The event stream must reference the same acceptance gate used by session monitoring, launch-session storage, and report package previews.

## Standard

- Progress-event write intents preserve event effect taxonomy.
- Progress-event write intents require a passed event acceptance gate.
- Backend-neutral progress event records include `event_acceptance_gate_id`.
- Live event storage remains blocked when the launch-session event acceptance gate is blocked or demo-only.
