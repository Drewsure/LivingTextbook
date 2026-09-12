# ADR 0634: Z.ai Suite Inventory And First Candidate

**Status:** Accepted for review; integration blocked

## Decision

Inventory the frozen MiniStar Lab source as a 32-scene, 32-catalog-entry
Phaser candidate suite. Begin compatibility review with Balloon Pop, followed
by Memory Match, Label It, and then an optional speech candidate.

## Rationale

Balloon Pop gives the clearest first test of Phaser value while remaining
close to the existing Pairing parent engine. Memory Match provides a simpler
early-learner comparison against the current LivingTextbook pathway. Label It
tests multimedia upload boundaries. Speech games require additional cost and
privacy review.

## Findings That Block Direct Integration

- The suite's summary count is inconsistent with the frozen source inventory.
- BaseEngine owns local score and completion behavior.
- Browser storage and direct API calls are embedded in the candidate.
- Audio and speech features are not yet proven against the canonical manifests
  and entitlement policies.
- Random reward and pirate-themed surfaces conflict with platform rules.

No source files are promoted by this decision.
