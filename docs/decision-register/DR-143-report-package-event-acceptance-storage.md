# DR-143: Report Package Event Acceptance Storage

## Decision

Preserve event acceptance summaries in teacher report package storage.

## Reason

Report package previews surface whether live student event storage is blocked, demo-only, or ready. The same status must survive durable storage and export review so a report cannot be interpreted without its event acceptance context.

## Standard

- Teacher report package write intents preserve event acceptance summaries.
- Backend schema and migration specs include `event_acceptance_summary`.
- Report exports cannot hide blocked or demo-only event acceptance status.
- Report packages continue to reject raw learner audio, transcripts, ungated AI Tutor state, and support-only mastery credit.
