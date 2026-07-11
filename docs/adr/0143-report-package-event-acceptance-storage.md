# ADR 0143: Report Package Event Acceptance Storage

## Status

Accepted

## Context

Teacher report package previews now show event acceptance summaries. If report package storage does not preserve the same summary, future exports could lose whether a session was demo-only, blocked, or live-event-ready when the package was generated.

## Decision

Require teacher report package storage contracts, schema drafts, and migration specs to preserve event acceptance summaries.

## Consequences

- Teacher report package write intents must preserve event acceptance summaries.
- Backend-neutral report package records include `event_acceptance_summary`.
- Hosted and local report package exports cannot hide blocked or demo-only event status.
- This remains a storage contract only; it does not enable real report export.
