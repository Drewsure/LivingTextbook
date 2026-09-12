# DR-719: Sentence Builder Canonical Integration

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Canonical game integration / text-spelling engine

## Decision

Sentence Builder joins Memory Match and Balloon Pop as a canonical game slice.
Its start, round, answer, mastery, completion, audio, scoring, tenant, and
replay evidence must flow through the shared platform contracts.

## Consequences

- Syntax gameplay can be evaluated by the same completion guard as other game
  families.
- Tile speech is visible in the event stream without allowing audio to unlock
  progress.
- Future text-spelling modes can reuse this contract and engine boundary.
- Frozen Z.ai/Phaser work remains isolated until separately mapped and approved.
