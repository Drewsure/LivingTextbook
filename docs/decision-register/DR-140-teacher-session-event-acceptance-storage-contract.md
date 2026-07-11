# DR-140: Teacher Session Event Acceptance Storage Contract

## Decision

Promote teacher session event acceptance gates into launch-session persistence contracts.

## Reason

The product needs a durable answer to a simple classroom question: may this session store real student events? The answer must be derived from settings persistence, report policy, event taxonomy, coded identity, and sensitive-data exclusions, not from a loose UI toggle.

## Standard

- Launch-session write intents preserve event acceptance gates.
- Backend schema draft includes `event_acceptance_gate` and `live_event_storage_allowed`.
- Migration specs include event acceptance fields in `spec-launch-session-settings`.
- Live event storage remains blocked until the event acceptance gate passes.
- Manual live-event-storage override is forbidden.
