# ADR 0061: Sentence Builder Reporting Bridge

## Status

Accepted

## Context

Sentence Builder now has a playable route and is discoverable through route contracts, game sequencing, and partner unit offers. The next architectural requirement is teacher visibility.

## Decision

Add Sentence Builder to the sample teacher session monitor using shared event names and text-spelling metadata.

## Consequences

The teacher monitor can show a syntax-construction game without adding a separate report surface. This keeps the next engine integrations aligned with the same reporting pattern.
