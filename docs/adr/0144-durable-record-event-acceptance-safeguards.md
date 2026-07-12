# ADR 0144: Durable Record Event Acceptance Safeguards

## Status

Accepted

## Context

Persistence adapter intents, backend schema drafts, and migration specs now require event acceptance safeguards for progress events and report packages. The durable record map also needs to carry those same safeguards because it is the first teacher/admin-facing explanation of what must become real storage before a pilot.

## Decision

Add event acceptance and taxonomy safeguards to durable record contracts.

## Consequences

- Progress-event durable records must preserve event effect taxonomy.
- Progress-event durable records must require a passed event acceptance gate.
- Teacher report package durable records must preserve event acceptance summaries.
- The teacher intake durable record map visibly shows those safeguards before backend selection.
