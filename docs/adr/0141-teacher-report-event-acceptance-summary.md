# ADR 0141: Teacher Report Event Acceptance Summary

## Status

Accepted

## Context

Teacher session routes now show an event acceptance gate, and launch-session storage contracts preserve that gate before live student event writes. Teacher report package previews also need to surface the same gate so report handoff and export review cannot ignore whether events are demo-only, blocked, or ready for live storage.

## Decision

Add an event acceptance summary to teacher report package preview routes.

## Consequences

- Report package previews show event acceptance status, blocked item count, warning count, evidence, and next steps.
- Report package route verification checks for `Event acceptance summary`.
- Report export remains blocked until event acceptance, report policy, persistence, retention, access, and sensitive-data rules are accepted.
- Demo report packages stay useful for pilot review without implying live classroom storage is enabled.
