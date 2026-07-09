# ADR 0060: Sentence Builder Route Discovery

Date: 2026-07-09

Status: accepted

## Context

The playable Sentence Builder route exists. It needs to be visible in the app's route and offer scaffolds.

## Decision

Add Sentence Builder to:

- `GameSequence`
- `routeContracts`
- `sampleUnitGameOfferMap`

## Implications

The route is easier to test and explain, while still clearly marked as a structural scaffold rather than a final premium game.
