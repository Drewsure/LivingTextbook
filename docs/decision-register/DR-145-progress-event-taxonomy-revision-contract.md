# DR-145: Progress Event Taxonomy Revision Contract

## Decision

Expose a named progress event taxonomy revision and required event field contract.

## Reason

Event storage depends on a stable taxonomy version. Without a visible revision, future game or media events could be added informally and later become hard to interpret in reports or exports.

## Standard

- `/teacher/intake` shows the current taxonomy revision.
- Progress-event storage requires `event_id`, `event_type`, `event_effect`, `taxonomy_version`, `event_acceptance_gate_id`, `metadata`, and `occurred_at`.
- New event types must be classified before pilot-ready package release.
- Support-only events remain blocked from mastery, Star Dust, and unlock logic.
