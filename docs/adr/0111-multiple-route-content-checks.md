# ADR 0111: Multiple Route Content Checks

## Status

Accepted

## Context

The active route verifier checked a single expected text string per route. Media playlist pages now have two important foundation regions: route metadata and demo media controls.

## Decision

Allow each route to declare multiple expected text strings and fail if any are missing.

## Consequences

Route verification becomes a little more expressive without introducing a heavy browser automation dependency.
