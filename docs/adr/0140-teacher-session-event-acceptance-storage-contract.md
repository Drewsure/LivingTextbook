# ADR 0140: Teacher Session Event Acceptance Storage Contract

## Status

Accepted

## Context

Teacher session monitor routes now show an event acceptance gate. That gate cannot remain UI-only if the platform later stores real classroom events. The launch-session record must preserve the gate decision before event writes are accepted.

## Decision

Add event acceptance gate preservation to launch-session storage contracts.

## Consequences

- Launch-session write intents must preserve event acceptance gates.
- Backend schema and migration specs include `event_acceptance_gate` and `live_event_storage_allowed`.
- Live event writes cannot be enabled by a manual toggle that bypasses reviewed settings, report policy, event taxonomy, coded identity, and sensitive-data exclusions.
- Hosted and local deployments share the same event acceptance vocabulary.
