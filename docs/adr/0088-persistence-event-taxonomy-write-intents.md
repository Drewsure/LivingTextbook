# ADR 0088: Persistence Event Taxonomy Write Intents

## Status

Accepted

## Context

The backend schema and migration specs now preserve `event_effect` and `taxonomy_version`. The persistence adapter map also needs the same guarantee so hosted and local implementations do not drift.

## Decision

Add an optional `preservesEventEffectTaxonomy` flag to persistence write intents and require it for `progress-event-stream` intents. Show the flag in the persistence readiness panel.

## Consequences

Future hosted and local persistence implementations get an explicit handoff requirement. Support-only events stay visible to teachers without becoming scoring evidence.

