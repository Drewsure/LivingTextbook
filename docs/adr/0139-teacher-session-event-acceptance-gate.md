# ADR 0139: Teacher Session Event Acceptance Gate

## Status

Accepted

## Context

Teacher session routes can display demo progress, media, and report summaries. Before a real pilot stores student events, the product needs a clear gate separating demo-visible events from live event acceptance.

## Decision

Add an event acceptance gate to teacher session monitor routes.

## Consequences

- Teacher session routes now state whether live student event storage is allowed.
- Live storage remains blocked until reviewed game/audio coverage, persisted settings, event taxonomy, reporting policy, coded student identity, and sensitive-data exclusions are ready.
- Support-only events remain visible for reports without becoming mastery, Star Dust, or unlock evidence.
