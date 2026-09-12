# DR-720: Speak It Canonical Integration

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Canonical game integration / speaking-listening engine

## Decision

Speak It joins Memory Match, Balloon Pop, and Sentence Builder as a canonical
game slice. Its prompt audio, optional microphone policy, deterministic scoring,
shared event sequence, tenant identity, launch identity, and replay evidence
must flow through the platform contracts.

## Consequences

- Audio-led practice is represented in teacher evidence without storing learner
  recordings.
- The same route shell can support future speech matching or premium AI Tutor
  modes behind explicit entitlements.
- A future Phaser speech skin must preserve the same event and policy boundary.
- Frozen Z.ai/Phaser work remains isolated until separately mapped and approved.
