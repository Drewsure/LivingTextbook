# ADR 0087: Progress Event Taxonomy Storage

## Status

Accepted

## Context

The teacher/admin UI now exposes a progress event taxonomy. If backend planning stores only a raw event type and payload, future reports could accidentally treat support-only activity as mastery evidence.

## Decision

Add `event_effect` and `taxonomy_version` to the vendor-neutral progress event schema and migration specs. Update migration candidates to index by event effect and explicitly block support-only events from scoring, mastery, and unlock calculations.

## Consequences

Future Supabase, Firebase, SQLite, or local classroom implementations can preserve the same event interpretation. Teacher reports can show support activity without changing deterministic learning progress.

