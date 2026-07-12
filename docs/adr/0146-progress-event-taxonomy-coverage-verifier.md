# ADR 0146: Progress Event Taxonomy Coverage Verifier

## Status

Accepted

## Context

The shared content model owns `GameEventType`, while the teacher/admin taxonomy classifies events for scoring, reporting, and support-only behavior. If a new shared event type is added without taxonomy classification, reports and storage can drift.

## Decision

Add `npm run verify:taxonomy` and include it in `npm run verify:foundation`.

## Consequences

- The verifier fails when `GameEventType` events are missing from the taxonomy.
- The verifier fails when taxonomy events are duplicated or not present in the shared event union.
- The verifier checks that required storage fields remain named in the taxonomy registry.
- Future game, media, speech, AI Tutor, route-guidance, and reward events must be classified before the foundation check passes.
