# ADR 0173: Earned Collection Storage Contract

Date: 2026-07-12

## Status

Accepted

## Context

The collection room and reward catalog make mastery-earned ownership visible to students. Before backend selection, the platform needs a vendor-neutral storage contract for collection inventory so hosted and local deployments preserve the same child-safe reward model.

## Decision

Add `collection-inventory` to durable record categories, persistence write intents, backend schema draft, migration candidates, and migration specifications.

Collection ownership must reference accepted mastery or completion events, preserve the deterministic rule that created ownership, and reject random pressure loops, paid gacha-like mechanics, and purchase-like ownership state.

## Consequences

Future backend work must implement collection inventory as a policy-gated learner record. Hosted pilots and local classroom deployments must support export/backup without changing reward semantics.
