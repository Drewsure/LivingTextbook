# DR-087: Progress Event Taxonomy Storage

## Decision

Backend planning must store progress event effect and taxonomy version with each event.

## Reason

The platform now has events that look similar in a report stream but have different learning consequences. Route guidance, support-language usage, and background media can be useful but must not become scoring evidence in future report queries or backend migrations.

## Standard

- `progress_event` records include `event_effect`.
- `progress_event` records include `taxonomy_version`.
- Support-only events are excluded from mastery, Star Dust, and unlock aggregation.
- Hosted and local event stores must preserve the same event-effect vocabulary.

