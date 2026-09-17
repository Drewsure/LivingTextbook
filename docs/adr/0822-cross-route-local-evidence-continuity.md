# ADR 0822: Cross-Route Local Evidence Continuity

## Status

Accepted for browser rehearsal only.

## Context

The production-shaped slice now moves through separate routes. Each route had
its own in-memory event list, while the teacher preview read one local evidence
record. That made a route-by-route rehearsal appear fragmented even though the
progression handoff was validated.

## Decision

Add a package-bound local evidence append contract. A route contributes its
validated event list and latest progression snapshot to the record for the
same launch. The store rejects package, tenant, unit, launch, or student-session
mismatches and removes exact duplicate events while preserving first-seen order.

The contract is used by the Flashcards route and the shared canonical game
shell, which covers Memory Match and Sentence Builder. It remains local
browser rehearsal state only. It does not create a hosted write path or make
the teacher view a live reporting system.

## Consequences

- Teacher rehearsal can inspect one coherent event history across routes.
- Re-render and retry behavior does not inflate exact duplicate evidence.
- Local storage failures are surfaced as review warnings and cannot unlock
  games or award mastery.
- The evidence schema version changes, so stale pre-continuity browser records
  are ignored rather than interpreted as current data.
- A future hosted adapter must preserve this identity and privacy boundary
  before any live reporting or export decision.
