# ADR 0321: AI Prototype Fixture Replay Report

Date: 2026-07-31  
Status: Accepted

## Context

Returned prototypes can look correct while still hiding hard-coded vocabulary, sentences, tenant visuals, audio assumptions, scoring shortcuts, or route side effects. A wrapper adapter review defines the boundary, but the platform also needs evidence that the prototype actually loads reviewed JSON fixtures.

## Decision

Add review-only AI prototype fixture replay reports to the teacher generator routes. The reports show source records, replay purpose, fixture coverage, acceptance checks, mode-level input assertions, output assertions, replay evidence, and failure triggers.

## Consequences

- Returned prototypes must prove fixture-driven behavior before integration can be considered.
- Target-language-only progress, support-only assist language, audio cue references, tenant theme injection, and standard event output stay visible.
- Hard-coded unit text, tenant assets, missing audio cue requests, support-language progress triggers, score/reward writes, route side effects, and assignment side effects reject the replay.
- The report remains review-only; storage is deferred until the visible evidence shape settles.
